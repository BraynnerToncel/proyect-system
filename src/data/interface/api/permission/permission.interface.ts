import { IRole } from '../role/role.interface';

export interface IPermission {
  permissionId: string;
  permissionName: string;
  permissionDescription: string;
  permissionState: boolean;
  role: Array<IRole>;
}
