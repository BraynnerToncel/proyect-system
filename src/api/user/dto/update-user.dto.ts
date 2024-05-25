import { OmitType, PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import {
  IsUUID,
  IsOptional,
  IsString,
  MaxLength,
  IsBoolean,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['roleId']),
) {
  @IsUUID()
  roleId: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  userPassword: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  newPassword: string;
}

export class UpdateUserStateDto {
  @IsBoolean()
  userState: boolean;
}

export class UpdateUserRestorePassword {
  @IsString()
  @MinLength(5)
  @MaxLength(50)
  password: string;
}
