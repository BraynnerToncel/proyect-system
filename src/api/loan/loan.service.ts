import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from '@entity/api/loan/loan.entity';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from '@entity/api/resevation/reservation.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Element } from '@entity/api/element/element.entity';
import { User } from '@entity/api/user/user.entity';
import { formatInTimeZone } from 'date-fns-tz';

@Injectable()
export class LoanService {
  @InjectRepository(Loan)
  private readonly loanRepository: Repository<Loan>;
  @InjectRepository(Reservation)
  private readonly reservationRepostory: Repository<Reservation>;
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly dataSource: DataSource,
  ) {}

  async create(userDelivery: string, createLoanDto: CreateLoanDto) {
    const { elementId, requestedUser, reservationId } = createLoanDto;
    const now = new Date();
    const nowInColombia = formatInTimeZone(
      now,
      'America/Bogota',
      'yyyy-MM-dd HH:mm:ss.SSSXXX',
    );

    const activeReservation = await this.reservationRepostory.findOne({
      where: { element: { elementId }, reservationState: 1 },
    });

    if (activeReservation) {
      throw new ConflictException(
        `There is already an active reservation for element with id ${elementId}`,
      );
    }

    const reservation = await this.reservationRepostory.findOne({
      where: { reservationId },
      relations: ['element', 'user'],
    });

    if (
      !reservation ||
      reservation.user.userId !== requestedUser ||
      reservation.element.elementId !== elementId
    ) {
      throw new BadRequestException(
        'Loan details do not match the reservation details.',
      );
    }

    const reservationCreateTime = new Date(reservation.reservationAt);
    const differenceInMinutes =
      (now.getTime() - reservationCreateTime.getTime()) / (1000 * 60);

    if (differenceInMinutes < 0 || differenceInMinutes > 5) {
      throw new BadRequestException(
        'Loan creation must be at the reservation time or within 5 minutes after.',
      );
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { userId: userDelivery },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userDelivery} not found`);
      }
      const activeLoanCount = await queryRunner.manager.count(Loan, {
        where: { requestedUser: { userId: requestedUser }, loanState: 0 },
      });
      if (activeLoanCount > 0) {
        throw new ConflictException('The user already has an active loan');
      }

      await queryRunner.manager.update(Reservation, reservationId, {
        reservationState: 1,
      });
      await queryRunner.manager.update(Element, elementId, { elementState: 2 });

      const loan = queryRunner.manager.create(Loan, {
        loanCreateAt: new Date(nowInColombia),
        loanReturnAt: new Date(nowInColombia),
        element: { elementId },
        requestedUser: { userId: requestedUser },
        deliveryUser: { userId: userDelivery },
      });

      const saveLoan = await queryRunner.manager.save(Loan, loan);
      await queryRunner.commitTransaction();
      return saveLoan;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.loanRepository.find();
  }

  async findOne(id: string) {
    return await this.loanRepository.findOne({
      where: { loanId: id },
    });
  }

  async update(adminUserId: string, updateLoanDto: UpdateLoanDto) {
    const { loanStateUpdate, idUserRequest, elementId, loanId, reservationId } =
      updateLoanDto;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    const adminUser = await queryRunner.manager.findOne(User, {
      where: { userId: adminUserId },
    });
    if (!adminUser)
      throw new NotFoundException(
        `Admin user with ID ${adminUserId} not found`,
      );

    const loan = await this.dataSource.getRepository(Loan).findOne({
      where: { loanId },
      relations: ['element', 'requestedUser', 'deliveryUser', 'receivedUser'],
    });

    if (!loan) {
      throw new NotFoundException(`Loan with ID ${loanId} not found`);
    }
    if (loan.loanState !== 0) {
      throw new ConflictException(
        `Loan with ID ${loanId} has already been updated`,
      );
    }
    const reservation = await this.reservationRepostory.findOne({
      where: { reservationId },
      relations: ['element', 'user'],
    });

    if (
      loan.requestedUser.userId !== idUserRequest ||
      loan.element.elementId !== elementId ||
      !reservation
    ) {
      throw new BadRequestException(
        'User ID / element ID / reservationId does not match the loan details.',
      );
    }

    try {
      await queryRunner.manager.update(Loan, loanId, {
        loanState: loanStateUpdate,
        receivedUser: { userId: adminUserId },
      });

      await queryRunner.manager.update(Reservation, reservationId, {
        reservationState: 3,
      });
      const otherActiveReservations = await queryRunner.manager.count(
        Reservation,
        {
          where: { element: { elementId }, reservationState: 0 },
        },
      );
      const newElementState = otherActiveReservations > 0 ? 1 : 0;
      await queryRunner.manager.update(Element, elementId, {
        elementState: newElementState,
      });

      await queryRunner.commitTransaction();
      return `Loan with ID ${loanId} completed`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
