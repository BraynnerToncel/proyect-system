import { ValidPermission } from '@constant/permissions/permissions.constant';
import { IAuthDecodedUser } from '@interface/api/auth/auth.interface';
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredPermission: string = this.reflector.get(
      'permissions',
      context.getHandler(),
    );

    const user: IAuthDecodedUser = context.switchToHttp().getRequest().user;
    if (!user)
      throw new UnauthorizedException(
        `El usuario debe iniciar sesion para realizar esta operacion`,
      );

    if (
      user.permissions.includes(requiredPermission) ||
      user.permissions.includes(ValidPermission.develop_permission_all)
    )
      return true;

    throw new UnauthorizedException(
      `El usuario necesita permiso para realizar esta operacion comuniquese con el admin de sistema`,
    );
  }
}
