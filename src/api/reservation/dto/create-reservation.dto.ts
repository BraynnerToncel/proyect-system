import { IsBoolean, IsDateString, IsNotEmpty, IsUUID } from 'class-validator';

export class CreateReservationDto {
  @IsDateString()
  @IsNotEmpty()
  reservationAt: Date;

  @IsBoolean()
  @IsNotEmpty()
  reservationState: boolean;

  @IsUUID()
  @IsNotEmpty()
  userId: string;

  @IsUUID()
  @IsNotEmpty()
  typeOfUseId: string;

  @IsUUID()
  @IsNotEmpty()
  elementId: string;
}
