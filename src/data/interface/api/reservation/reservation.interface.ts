import { IElement } from '../element/element.interface';
import { ITypeOfUse } from '../typeOfUse/typeOfUse.interface';
import { IUser } from '../user/user.interface';

export interface IReservation {
  reservationId: string;
  reservationCreateAt: Date;
  reservationReturnAt: Date;
  reservationState: boolean;
  user: IUser;
  typeofuse: ITypeOfUse;
  element: IElement;
}

export type ICreateReservation = Omit<
  IReservation,
  'reservationId' | 'user' | 'typeofuse' | 'element' | 'reservationState'
> &
  Partial<Pick<IReservation, 'reservationState'>> &
  Pick<IUser, 'userId'> &
  Pick<ITypeOfUse, 'typeOfUseId'> &
  Pick<IElement, 'elementId'>;

export type IUpdateReservation = Partial<ICreateReservation>;
