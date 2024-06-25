import { IElement } from '../element/element.interface';
import { IUser } from '../user/user.interface';

export interface ILoan {
  loanId: string;
  loanCreateAt: Date;
  loanReturnAt: Date;
  loanState: number;
  requestedUser: IUser;
  receivedUser: IUser;
  deliveryUser: IUser;
  element: IElement;
}
export type ICreateLoan = Omit<
  ILoan,
  | 'loanId'
  | 'requestedUser'
  | 'element'
  | 'loanState'
  | 'receivedUser'
  | 'deliveryUser'
> &
  Partial<Pick<ILoan, 'loanState'>> &
  Pick<IUser, 'deliveryUser'> &
  Pick<IUser, 'receivedUser'> &
  Pick<IUser, 'requestedUser'> &
  Pick<IElement, 'elementId'>;

export type IUpdateLoan = Partial<ICreateLoan>;
