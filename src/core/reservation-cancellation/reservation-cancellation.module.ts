import { Module } from '@nestjs/common';
import { ReservationCancellationService } from './reservation-cancellation.service';

@Module({
  providers: [ReservationCancellationService],
})
export class ReservationCancellationModule {}
