import { Module } from '@nestjs/common';
import { ReservationCancellationModule } from './reservation-cancellation/reservation-cancellation.module';

@Module({
  imports: [ReservationCancellationModule],
  exports: [ReservationCancellationModule],
})
export class CoreModule {}
