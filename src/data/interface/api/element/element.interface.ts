import { IInstall } from '../install/install.interface';
import { ILoan } from '../loan/loan.interface';
import { IReservation } from '../reservation/reservation.interface';
import { IType } from '../type/type.interface';

export interface IElement {
  elementId: string;
  elementName: string;
  elementState: boolean;
  reservation: IReservation;
  loan: ILoan;
  type: IType;
  install: IInstall;
}

export type ICreateElement = Omit<
  IElement,
  'elementId' | 'loan' | 'type' | 'install' | 'elementState'
> &
  Partial<Pick<IElement, 'elementState'>> &
  Pick<ILoan, 'loanId'> &
  Pick<IType, 'typeId'> &
  Pick<IInstall, 'installId'>;

export type IUpdateElement = Partial<ICreateElement>;
