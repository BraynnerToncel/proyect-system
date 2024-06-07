import { Module } from '@nestjs/common';
import { ReservationCancellationService } from './reservation-cancellation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '@entity/api/resevation/reservation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation])],
  providers: [ReservationCancellationService],
  exports: [],
})
export class ReservationCancellationModule {}
