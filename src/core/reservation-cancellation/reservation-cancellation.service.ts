import { Element } from '@entity/api/element/element.entity';
import { Reservation } from '@entity/api/resevation/reservation.entity';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';

@Injectable()
export class ReservationCancellationService {
  @InjectRepository(Reservation)
  private reservationRepository: Repository<Reservation>;
  @InjectRepository(Element)
  private elementRepository: Repository<Element>;
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
      relations: ['element'],
    });
    for (const reservation of reservationsToUpdate) {
      reservation.reservationState = 2;
      await this.reservationRepository.save(reservation);
      if (reservation.element) {
        reservation.element.elementState = 0;
        await this.elementRepository.save(reservation.element);
      }
    }
  }
}
