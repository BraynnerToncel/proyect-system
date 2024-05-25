import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import {
  UpdateUserDto,
  UpdateUserRestorePassword,
  UpdateUserStateDto,
} from './dto/update-user.dto';
import { ValidPermission } from '@constant/permissions/permissions.constant';
import { PermissionRequired } from '@decorator/permission.decorator';
import { IUser } from '@interface/api/user/user.interface';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @PermissionRequired(ValidPermission.settings_users_create)
  public create(@Body() userData: CreateUserDto): Promise<IUser> {
    return this.userService.create(userData);
  }

  @Get()
  @PermissionRequired(ValidPermission.settings_users_read)
  findAll(): Promise<Array<IUser>> {
    return this.userService.findAll();
  }

  @Get(':id')
  @PermissionRequired(ValidPermission.settings_users_read)
  findOne(@Param('id') userId: string): Promise<IUser> {
    return this.userService.findOne(userId);
  }

  @Put(':id')
  @PermissionRequired(ValidPermission.settings_users_update)
  update(
    @Param('id') userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IUser> {
    return this.userService.update(userId, updateUserDto);
  }

  @Put(':id/state')
  @PermissionRequired(ValidPermission.settings_users_update)
  updateState(
    @Param('id') userId: string,
    @Body() updateUserStateDto: UpdateUserStateDto,
  ): Promise<IUser> {
    return this.userService.updateState(userId, updateUserStateDto);
  }

  @Put('restorePassword/:id')
  @PermissionRequired(ValidPermission.settings_users_update)
  restorePassword(
    @Param('id') userId: string,
    @Body() updateUserRestorePassword: UpdateUserRestorePassword,
  ): Promise<boolean> {
    return this.userService.restorePassword(userId, updateUserRestorePassword);
  }

  @Delete(':id')
  @PermissionRequired(ValidPermission.settings_users_delete)
  remove(@Param('id') userId: string): Promise<string> {
    return this.userService.remove(userId);
  }
}
