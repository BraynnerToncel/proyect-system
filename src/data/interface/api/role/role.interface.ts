import { IPermission } from '../permission/permission.interface';
import { IUser } from '../user/user.interface';

export interface IRole {
  roleId: string;
  roleName: string;
  roleDescription: string;
  roleState: boolean;
  user: Array<IUser>;
  permissions: Array<IPermission>;
}

export type ICreateRole = Omit<IRole, 'roleId' | 'user' | 'permissions'> &
  Record<'permissions', Array<Pick<IPermission, 'permissionId'>>>;

export type IUpdateRole = Partial<ICreateRole>;
