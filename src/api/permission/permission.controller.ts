import { Controller, Get } from '@nestjs/common';
import { PermissionService } from './permission.service';
import { PermissionRequired } from '@decorator/permission.decorator';
import { ValidPermission } from '@constant/permissions/permissions.constant';
import { IPermission } from '@interface/api/permission/permission.interface';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';

@ApiTags('permission')
@ApiSecurity('x-token')
@Controller('permission')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Get()
  @PermissionRequired(ValidPermission.settings_permission_read)
  findAll(): Promise<Array<IPermission>> {
    return this.permissionService.findAll();
  }
}
