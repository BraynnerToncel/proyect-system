import { IFile } from '../file/file.interface';
import { ILoan } from '../loan/loan.interface';
import { IReservation } from '../reservation/reservation.interface';
import { IRole } from '../role/role.interface';

export interface IUser {
  userId: string;
  userFullName: string;
  userLastName: string;
  username: string;
  userEmail: string;
  userPassword: string;
  userState: boolean;
  role: IRole;
  deliveryUser: Array<ILoan>;
  receivedUser: Array<ILoan>;
  requestedUser: Array<ILoan>;
  reservation: Array<IReservation>;
  file: IFile;
}

export type IUserFindCondition = Partial<Pick<IUser, 'userId' | 'username'>>;

export type ICreateUser = Omit<
  IUser,
  | 'userId'
  | 'role'
  | 'userState'
  | 'deliveryUser'
  | 'receivedUser'
  | 'requestedUser'
  | 'reservation'
  | 'file'
> & {
  roleId: string;
  userState: boolean;
  fileId: string;
};

export type IUpdateUser = Partial<ICreateUser> &
  Partial<Record<'newPassword', string>> &
  Partial<Record<'role', Pick<IRole, 'roleId'>>> &
  Partial<Record<'file', Pick<IFile, 'fileId'>>>;

export type IUserRestorePassword = Record<'password', string>;
