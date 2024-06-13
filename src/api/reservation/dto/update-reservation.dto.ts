import { PartialType } from '@nestjs/mapped-types';
import { CreateReservationDto } from './create-reservation.dto';
import { IsNumber, IsUUID } from 'class-validator';

export class UpdateReservationDto extends PartialType(CreateReservationDto) {}

export class UpdateStateReservation {
  @IsNumber()
  reservationState: number;
}
export class UpdateElementReservation {
  @IsUUID()
  reservationId: string;

  @IsUUID()
  elementId: string;
}
