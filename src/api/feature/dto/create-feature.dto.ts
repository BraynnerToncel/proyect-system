import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateFeatureDto {
  @IsString()
  @MinLength(4)
  @MaxLength(45)
  @IsNotEmpty()
  featureName: string;

  @IsBoolean()
  @IsOptional()
  featureRequired?: boolean;

  @IsString()
  featureUseName: string;

  @IsBoolean()
  @IsOptional()
  featureState?: boolean;
}
