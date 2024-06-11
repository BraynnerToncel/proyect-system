import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from '@entity/api/loan/loan.entity';
import { DataSource, Repository } from 'typeorm';
import { Reservation } from '@entity/api/resevation/reservation.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Element } from '@entity/api/element/element.entity';
import { User } from '@entity/api/user/user.entity';

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

  async create(createLoanDto: CreateLoanDto) {
    const { elementId, requestedUser, idReservation } = createLoanDto;

    const reservation = await this.reservationRepostory.findOne({
      where: { reservationId: idReservation },
      relations: ['element'],
    });
    if (!reservation) {
      throw new NotFoundException(
        `Reservation with id ${idReservation} not found`,
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();

    try {
      const element = await queryRunner.manager.findOne(Element, {
        where: { elementId },
      });
      if (!element) {
        throw new NotFoundException(
          `Reservation with id ${elementId} not found`,
        );
      }
      const user = await queryRunner.manager.findOne(User, {
        where: { userId: requestedUser },
      });
      if (!user) {
        throw new NotFoundException(
          `Reservation with id ${requestedUser} not found`,
        );
      }
    } catch (error) {
    } finally {
    }
  }

  findAll() {
    return `This action returns all loan`;
  }

  findOne(id: string) {
    return `This action returns a #${id} loan`;
  }

  update(id: string, updateLoanDto: UpdateLoanDto) {
    return `This action updates a #${id} loan`;
  }
}
