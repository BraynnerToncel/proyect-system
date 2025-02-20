import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '@entity/api/resevation/reservation.entity';
import { Element } from '@entity/api/element/element.entity';
import { TypeOfUse } from '@entity/api/typeOfUse/typeOfUse.entity';
import { User } from '@entity/api/user/user.entity';
import { ReservationCancellationService } from '@core/reservation-cancellation/reservation-cancellation.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reservation, User, TypeOfUse, Element])],

  controllers: [ReservationController],
  providers: [ReservationService, ReservationCancellationService],
})
export class ReservationModule {}
