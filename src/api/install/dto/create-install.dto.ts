import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateInstallDto {
  @IsUUID()
  @IsNotEmpty()
  featureId: string;

  @IsUUID()
  @IsNotEmpty()
  elementId: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
