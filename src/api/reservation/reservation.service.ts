import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import {
  UpdateElementReservation,
  UpdateReservationDto,
} from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from '@entity/api/resevation/reservation.entity';
import {
  DataSource,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { User } from '@entity/api/user/user.entity';
import { TypeOfUse } from '@entity/api/typeOfUse/typeOfUse.entity';
import { Element } from '@entity/api/element/element.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { isBefore } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { IReservation } from '@interface/api/reservation/reservation.interface';

@Injectable()
export class ReservationService {
  @InjectRepository(Reservation)
  private reservationRepository: Repository<Reservation>;
  @InjectRepository(User)
  private userRepository: Repository<User>;
  @InjectRepository(TypeOfUse)
  private typeOfUseRepository: Repository<TypeOfUse>;
  @InjectRepository(Element)
  private elementRepository: Repository<Element>;
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly dataSource: DataSource,
  ) {}

  async create(
    userId: string,
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { reservationAt, typeOfUseId, elementId, reservationTime } =
      createReservationDto;

    const now = new Date();
    const nowInColombia = formatInTimeZone(
      now,
      'America/Bogota',
      `"yyyy-MM-dd HH:mm:ss.SSSXXX"`,
    );

    if (new Date(nowInColombia) > new Date(reservationAt)) {
      throw new BadRequestException(
        'The booking date cannot be less than the current date and time in the Colombian time zone.',
      );
    }

    if (isBefore(reservationTime, reservationAt)) {
      throw new BadRequestException(
        'The reservation end date cannot be less than the reservation start date and time.',
      );
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const user = await queryRunner.manager.findOne(User, {
        where: { userId: userId },
      });
      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      const typeofuse = await queryRunner.manager.findOne(TypeOfUse, {
        where: { typeOfUseId },
      });
      if (!typeofuse) {
        throw new NotFoundException(
          `TypeOfUse with ID ${typeOfUseId} not found`,
        );
      }

      const element = await queryRunner.manager.findOne(Element, {
        where: { elementId },
      });
      if (!element) {
        throw new NotFoundException(`Element with ID ${elementId} not found`);
      }

      const activeReservation = await queryRunner.manager.count(Reservation, {
        where: {
          element: { elementId },
          reservationState: 0,
          reservationAt: LessThanOrEqual(reservationTime),
          reservationTime: MoreThanOrEqual(reservationAt),
        },
      });

      if (activeReservation > 0) {
        throw new ConflictException(
          `Element with ID ${elementId} already has an active reservation`,
        );
      }

      const reservation = queryRunner.manager.create(Reservation, {
        reservationAt,
        reservationCreateAt: new Date(nowInColombia),
        user,
        typeofuse,
        element,
        reservationTime,
      });

      await queryRunner.manager.save(Reservation, reservation);

      element.elementState = 1;
      await queryRunner.manager.save(Element, element);

      await queryRunner.commitTransaction();
      return reservation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll() {
    return await this.reservationRepository.find();
  }

  async findOne(reservationId: string) {
    return await this.reservationRepository.findOne({
      where: { reservationId },
    });
  }

  async update(
    reservationIds: string,
    updateReservationDto: UpdateReservationDto,
  ) {
    const { reservationAt, typeOfUseId, elementId, reservationTime } =
      updateReservationDto;
    const reservation = await this.reservationRepository.findOne({
      where: { reservationId: reservationIds },
    });
    if (!reservation) {
      throw new NotFoundException(
        `Reservation with ID ${reservationIds} not found`,
      );
    }

    if (typeOfUseId) {
      const typeofuse = await this.typeOfUseRepository.findOne({
        where: { typeOfUseId },
      });
      if (!typeofuse) {
        throw new NotFoundException(
          `TypeOfUse with ID ${typeOfUseId} not found`,
        );
      }
      reservation.typeofuse = typeofuse;
    }

    if (elementId) {
      const element = await this.elementRepository.findOne({
        where: { elementId },
      });
      if (!element) {
        throw new NotFoundException(`Element with ID ${elementId} not found`);
      }
      reservation.element = element;
      reservation.reservationTime = reservationTime;
      reservation.reservationAt = reservationAt ?? reservation.reservationAt;

      return await this.reservationRepository.save(reservation);
    }
  }

  async updateStates(
    reservationId: string,
    { reservationState }: Pick<IReservation, 'reservationState'>,
  ): Promise<IReservation> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.startTransaction();
    try {
      const reservation = await queryRunner.manager.findOne(Reservation, {
        where: { reservationId },
        relations: ['element'],
      });

      if (!reservation) {
        throw new NotFoundException(
          `Reservation with id ${reservationId} not found`,
        );
      }

      if (
        reservationState === 1 ||
        reservationState === 2 ||
        reservationState === 3
      ) {
        const elementState = reservationState === 1 ? 2 : 0;
        await queryRunner.manager.update(
          Element,
          reservation.element.elementId,
          {
            elementState,
          },
        );
      }

      await queryRunner.manager.update(Reservation, reservationId, {
        reservationState,
      });

      await queryRunner.commitTransaction();
      return reservation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async check() {
    const reservations = await this.reservationRepository.find({
      where: { reservationState: 4 },
    });

    if (reservations.length === 0) {
      throw new NotFoundException('No reservations found in state 4.');
    }

    return reservations;
  }

  async updateElement(
    id: string,
    updateElementReservation: UpdateElementReservation,
  ) {
    const { elementId, reservationId } = updateElementReservation;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const adminUser = await queryRunner.manager.findOne(User, {
        where: { userId: id },
      });
      if (!adminUser) {
        throw new NotFoundException(`Admin user with ID ${id} not found`);
      }

      const reservation = await queryRunner.manager.findOne(Reservation, {
        where: { reservationId },
      });

      if (!reservation) {
        throw new NotFoundException(
          `Reservation with ID ${reservationId} not found`,
        );
      }
      const element = await queryRunner.manager.findOne(Element, {
        where: { elementId },
      });

      if (!element) {
        throw new NotFoundException(`element with ID ${elementId} not found`);
      }

      if (element.elementState !== 0) {
        throw new BadRequestException(
          `the element is not available to be assigned to the reservation`,
        );
      }
      await queryRunner.manager.update(Reservation, reservationId, {
        element,
      });
      await queryRunner.manager.update(Element, elementId, {
        elementState: 1,
      });
      await queryRunner.commitTransaction();
      return reservation;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
