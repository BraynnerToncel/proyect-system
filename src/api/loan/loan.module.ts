import { Module } from '@nestjs/common';
import { LoanService } from './loan.service';
import { LoanController } from './loan.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from '@entity/api/loan/loan.entity';
import { Reservation } from '@entity/api/resevation/reservation.entity';
import { User } from '@entity/api/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Loan, Reservation, User])],
  controllers: [LoanController],
  providers: [LoanService],
})
export class LoanModule {}
