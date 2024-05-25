import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto, UpdateRoleStateDto } from './dto/update-role.dto';
import { ValidPermission } from '@constant/permissions/permissions.constant';
import { PermissionRequired } from '@decorator/permission.decorator';
import { IRole } from '@interface/api/role/role.interface';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}
  @Post()
  @PermissionRequired(ValidPermission.settings_roles_create)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  @Get()
  @PermissionRequired(ValidPermission.settings_roles_read)
  findAll(): Promise<Array<IRole>> {
    return this.roleService.findAll();
  }

  @Get(':id')
  @PermissionRequired(ValidPermission.settings_roles_read)
  findOne(@Param('id') id: string): Promise<IRole> {
    return this.roleService.findOne(id);
  }

  @Put(':id')
  @PermissionRequired(ValidPermission.settings_roles_update)
  update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<IRole> {
    return this.roleService.update(id, updateRoleDto);
  }

  @Put(':id/state')
  @PermissionRequired(ValidPermission.settings_roles_update)
  updateState(
    @Param('id') id: string,
    @Body() updateRoleStateDto: UpdateRoleStateDto,
  ): Promise<IRole> {
    return this.roleService.updateState(id, updateRoleStateDto);
  }

  @Delete(':id')
  @PermissionRequired(ValidPermission.settings_roles_delete)
  remove(@Param('id') id: string): Promise<string> {
    return this.roleService.remove(id);
  }
}
