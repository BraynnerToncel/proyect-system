import { Module } from '@nestjs/common';
import { ReservationCancellationModule } from './reservation-cancellation/reservation-cancellation.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ReservationCancellationModule, ScheduleModule.forRoot()],
  exports: [ReservationCancellationModule],
})
export class CoreModule {}
