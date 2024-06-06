import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from '@entity/api/resevation/reservation.entity';
import { DeleteResult, Repository } from 'typeorm';
import { User } from '@entity/api/user/user.entity';
import { TypeOfUse } from '@entity/api/typeOfUse/typeOfUse.entity';
import { Element } from '@entity/api/element/element.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

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
  constructor(private readonly eventEmitter: EventEmitter2) {}

  async create(
    userId: string,
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { reservationAt, typeOfUseId, elementId } = createReservationDto;

    const user = await this.userRepository.findOne({
      where: { userId: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const typeofuse = await this.typeOfUseRepository.findOne({
      where: { typeOfUseId },
    });
    if (!typeofuse) {
      throw new NotFoundException(`TypeOfUse with ID ${typeOfUseId} not found`);
    }

    const element = await this.elementRepository.findOne({
      where: { elementId },
    });
    if (!element) {
      throw new NotFoundException(`Element with ID ${elementId} not found`);
    }
    const activeReservation = await this.reservationRepository.count({
      where: {
        element: { elementId },
        reservationState: 0,
      },
    });

    if (activeReservation > 0) {
      throw new ConflictException(
        `Element with ID ${elementId} already has an active reservation`,
      );
    }

    const reservation = this.reservationRepository.create({
      reservationAt,
      user,
      typeofuse,
      element,
    });

    return await this.reservationRepository.save(reservation);
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
    const { reservationAt, reservationState, typeOfUseId, elementId } =
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

      reservation.reservationAt = reservationAt ?? reservation.reservationAt;
      reservation.reservationState =
        reservationState ?? reservation.reservationState;

      return await this.reservationRepository.save(reservation);
    }
  }

  async remove(id: string) {
    const deleteResult: DeleteResult = await this.userRepository.delete(id);

    if (!deleteResult.affected)
      throw new BadRequestException(`User ${id} was not deleted `);

    this.eventEmitter.emit('emit', {
      channel: 'user/data',
      data: { id, isDelete: true },
    });

    return id;
  }
}
