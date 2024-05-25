import { Type } from 'class-transformer';
import {
  IsString,
  MinLength,
  MaxLength,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
} from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @MinLength(4)
  @MaxLength(45)
  @IsNotEmpty()
  roleName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @IsNotEmpty()
  roleDescription: string;

  @IsOptional()
  @IsBoolean()
  roleState: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRolesPermissionDto)
  permissions: Array<CreateRolesPermissionDto>;
}

export class CreateRolesPermissionDto {
  @IsString()
  permissionId: string;
}
