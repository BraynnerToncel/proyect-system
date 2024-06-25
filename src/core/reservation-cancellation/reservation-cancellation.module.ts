import { Module } from '@nestjs/common';
import { ReservationCancellationService } from './reservation-cancellation.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '@entity/api/resevation/reservation.entity';
import { Element } from '@entity/api/element/element.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, Element])],
  providers: [ReservationCancellationService],
  exports: [],
})
export class ReservationCancellationModule {}
