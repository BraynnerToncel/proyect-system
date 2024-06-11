import { Module } from '@nestjs/common';
import { ReservationCancellationModule } from './reservation-cancellation/reservation-cancellation.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ReservationPendingModule } from './reservation-pending/reservation-pending.module';

@Module({
  imports: [
    ReservationCancellationModule,
    ReservationPendingModule,
    ScheduleModule.forRoot(),
  ],
  exports: [ReservationCancellationModule, ReservationPendingModule],
})
export class CoreModule {}
