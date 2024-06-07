import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { IsNumber } from 'class-validator';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}

export class UpdateStateReservation {
  @IsNumber()
  reservationState: number;
}
