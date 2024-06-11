import { IsDateString, IsUUID } from 'class-validator';

export class CreateLoanDto {
  @IsDateString()
  loanReturnAt: Date;

  @IsUUID()
  requestedUser: string;

  @IsUUID()
  elementId: string;
}
