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
}

export type IUserFindCondition = Partial<Pick<IUser, 'userId' | 'username'>>;

export type ICreateUser = Omit<IUser, 'userId' | 'role' | 'userState'> &
  Partial<Pick<IUser, 'userState'>> &
  Pick<IRole, 'roleId'>;

export type IUpdateUser = Partial<ICreateUser> &
  Partial<Record<'newPassword', string>> &
  Partial<Record<'role', Pick<IRole, 'roleId'>>>;

export type IUserRestorePassword = Record<'password', string>;
