import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { META_PERMISSION } from '@constant/definitions/definitions.constant';
import { ValidPermission } from '../constant/permissions/permissions.constant';
import { PermissionGuard } from '../guard/permission.guard';

export function PermissionRequired(permissions: ValidPermission) {
  return applyDecorators(
    SetMetadata(META_PERMISSION, permissions),
    UseGuards(PermissionGuard),
  );
}
