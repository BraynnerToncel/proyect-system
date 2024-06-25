import { PartialType } from '@nestjs/mapped-types';
import { CreateLoanDto } from './create-loan.dto';
import { IsNumber, IsUUID } from 'class-validator';

export class UpdateLoanDto extends PartialType(CreateLoanDto) {
  @IsNumber()
  loanStateUpdate: number;

  @IsUUID()
  loanId: string;

  @IsUUID()
  idUserRequest: string;

  @IsUUID()
  reservationId: string;
}
