import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';

export class CreateTypeDto {
  @IsString()
  @MinLength(4)
  @MaxLength(45)
  @IsNotEmpty()
  typeName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @IsNotEmpty()
  typeDescription: string;

  @IsOptional()
  @IsBoolean()
  typeState: boolean;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTypeFeatureDto)
  feature: Array<CreateTypeFeatureDto>;
}
export class CreateTypeFeatureDto {
  @IsString()
  featureId: string;
}
