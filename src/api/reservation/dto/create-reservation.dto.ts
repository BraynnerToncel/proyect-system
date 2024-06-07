import { IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsDateString()
  @IsNotEmpty()
  reservationAt: Date;

  @IsDateString()
  @IsNotEmpty()
  reservationTime: Date;

  @IsUUID()
  @IsNotEmpty()
  typeOfUseId: string;

  @IsUUID()
  @IsNotEmpty()
  elementId: string;
}
