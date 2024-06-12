import { IsUUID } from 'class-validator';

export class CreateLoanDto {
  @IsUUID()
  requestedUser: string;

  @IsUUID()
  elementId: string;

  @IsUUID()
  reservationId: string;
}
