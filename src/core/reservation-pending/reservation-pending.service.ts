import { Reservation } from '@entity/api/resevation/reservation.entity';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class ReservationPendingService {
  @InjectRepository(Reservation)
  private readonly reservationRepository: Repository<Reservation>;
  private readonly logger = new Logger(ReservationPendingService.name);
  constructor() {}

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCron() {
    const now = new Date();
    const reservationsToUpdate = await this.reservationRepository.find({
      where: {
        reservationTime: LessThanOrEqual(now),
        reservationState: 0,
      },
    });
    for (const reservation of reservationsToUpdate) {
      reservation.reservationState = 4;
      await this.reservationRepository.save(reservation);
      this.logger.log(`Reservation  updated to state 4`);
    }
  }
}
