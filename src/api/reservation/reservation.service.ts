import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from '@entity/api/resevation/reservation.entity';
import { Repository } from 'typeorm';
import { User } from '@entity/api/user/user.entity';
import { TypeOfUse } from '@entity/api/typeOfUse/typeOfUse.entity';
import { Element } from '@entity/api/element/element.entity';
// import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(TypeOfUse)
    private typeOfUseRepository: Repository<TypeOfUse>,
    @InjectRepository(Element)
    private elementRepository: Repository<Element>,
  ) {}

  async create(
    id: string,
    createReservationDto: CreateReservationDto,
  ): Promise<Reservation> {
    const { reservationAt, reservationState, typeOfUseId, elementId } =
      createReservationDto;

    const user = await this.userRepository.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
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

    const reservation = this.reservationRepository.create({
      reservationAt,
      reservationState,
      user,
      typeofuse,
      element,
    });

    // Save the reservation entity
    return await this.reservationRepository.save(reservation);
  }

  async findAll() {
    return `This action returns all reservation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} reservation`;
  }

  update(id: number, updateReservationDto: UpdateReservationDto) {
    return `This action updates a #${id} reservation`;
  }

  remove(id: number) {
    return `This action removes a #${id} reservation`;
  }
}
