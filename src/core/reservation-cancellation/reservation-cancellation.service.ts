import { Reservation } from '@entity/api/resevation/reservation.entity';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class ReservationCancellationService {
  @InjectRepository(Reservation)
  private reservationRepository: Repository<Reservation>;
  constructor() {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60000);
    const reservationsToUpdate = await this.reservationRepository.find({
      where: {
        reservationAt: LessThanOrEqual(fiveMinutesAgo),
        reservationState: 0,
      },
    });
    for (const reservation of reservationsToUpdate) {
      reservation.reservationState = 2;
      await this.reservationRepository.save(reservation);
    }
  }
}
