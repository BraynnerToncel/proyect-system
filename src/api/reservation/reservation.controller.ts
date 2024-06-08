import { IReservation } from './../../data/interface/api/reservation/reservation.interface';
import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import {
  UpdateReservationDto,
  UpdateStateReservation,
} from './dto/update-reservation.dto';
import { Public } from '@decorator/routes-public.decorator';

@Controller('reservation')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}
  @Public()
  @Post(':userId')
  create(
    @Param('userId') userId: string,
    @Body() createReservationDto: CreateReservationDto,
  ) {
    return this.reservationService.create(userId, createReservationDto);
  }
  @Public()
  @Get('list')
  findAll() {
    return this.reservationService.findAll();
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationService.findOne(id);
  }
  @Public()
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ) {
    return this.reservationService.update(id, updateReservationDto);
  }

  @Public()
  @Put(':id/state')
  updateState(
    @Param('id') id: string,
    @Body() updateStateReservation: UpdateStateReservation,
  ): Promise<IReservation> {
    return this.reservationService.updateStates(id, updateStateReservation);
  }
}
