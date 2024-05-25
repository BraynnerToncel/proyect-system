import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { IPermission } from '@interface/api/permission/permission.interface';
import { ValidPermission } from '@constant/permissions/permissions.constant';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Permission } from '@entity/api/permission/permission.entity';

@Injectable()
export class PermissionService implements OnModuleInit {
  @InjectRepository(Permission)
  private readonly permissionRepository: Repository<Permission>;

  private readonly logger: Logger = new Logger(PermissionService.name);

  async onModuleInit() {
    const inconsistentPermission: Array<string> = [];
    this.logger.log('Verifying permissions...');

    const storedPermissions = (await this.permissionRepository.find()).map(
      (permission) => permission.permissionName,
    );

    const staticPermissions = Object.values(ValidPermission) as Array<string>;

    for (const permission of staticPermissions) {
      if (!storedPermissions.includes(permission)) {
        await this.permissionRepository.save({
          permissionDescription: `${permission.split(':').join(' ')} (default)`,
          permissionName: permission,
          permissionState: true,
        });
      }
    }

    storedPermissions.forEach((permission) => {
      if (!staticPermissions.includes(permission))
        inconsistentPermission.push(permission);
    });

    if (inconsistentPermission.length > 0)
      this.logger.error(
        'inconsistent permissions found: ' + inconsistentPermission.join(' ,'),
      );
    this.logger.log('Verify done!');
  }

  async findAll(): Promise<Array<IPermission>> {
    return await this.permissionRepository.find();
  }
}
