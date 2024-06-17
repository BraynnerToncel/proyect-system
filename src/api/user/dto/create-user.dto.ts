import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsOptional,
  IsBoolean,
  IsUUID,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(24)
  username: string;

  @IsString()
  @MinLength(5)
  @MaxLength(46)
  userPassword: string;

  @IsString()
  @MinLength(3)
  @MaxLength(32)
  userFullName: string;

  @IsString()
  @MinLength(4)
  @MaxLength(32)
  userLastName: string;

  @IsEmail()
  userEmail: string;

  @IsOptional()
  @IsBoolean()
  userState: boolean;

  @IsUUID()
  roleId: string;

  @IsUUID()
  fileId: string;
}
