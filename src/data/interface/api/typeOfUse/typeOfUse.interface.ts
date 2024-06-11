import { IReservation } from '../reservation/reservation.interface';

export interface ITypeOfUse {
  typeOfUseId: string;
  typeOfUseConcept: string;
  typeOfUseName: string;
  reservation: Array<IReservation>;
}

export type ICreateTypeOfUse = Omit<ITypeOfUse, 'typeOfUseId' | 'reservation'> &
  Record<'reservation', Array<Pick<IReservation, 'reservationId'>>>;
export type IUpdateTypeOfUse = Partial<ICreateTypeOfUse>;
