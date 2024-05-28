import { ILoan } from '../loan/loan.interface';
import { IReservation } from '../reservation/reservation.interface';

export interface ITypeOfUse {
  typeOfUseId: string;
  typeOfUseConcept: string;
  typeOfUseName: string;
  reservation: Array<IReservation>;
  loan: Array<ILoan>;
}

export type ICreateTypeOfUse = Omit<
  ITypeOfUse,
  'typeOfUseId' | 'reservation' | 'loan'
> &
  Record<'reservation', Array<Pick<IReservation, 'reservationId'>>> &
  Record<'loan', Array<Pick<ILoan, 'loanId'>>>;

export type IUpdateTypeOfUse = Partial<ICreateTypeOfUse>;
