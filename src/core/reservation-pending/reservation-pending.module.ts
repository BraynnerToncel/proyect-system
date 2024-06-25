import { Reservation } from '@entity/api/resevation/reservation.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationPendingService } from './reservation-pending.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  providers: [ReservationPendingService],
  exports: [],
})
export class ReservationPendingModule {}
