import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateElementDto {
  @IsString()
  @MinLength(4)
  @MaxLength(45)
  @IsNotEmpty()
  elementName: string;

  @IsOptional()
  @IsBoolean()
  elementState: boolean;

  @IsUUID()
  @IsNotEmpty()
  typeId: string;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => FeatureDto)
  featureInstall: FeatureDto[];
}

class FeatureDto {
  @IsUUID()
  featureId: string;
  @IsString()
  value: string;
}
