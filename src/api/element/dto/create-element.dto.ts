import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateElementDto {
  @IsString()
  @MinLength(4)
  @MaxLength(45)
  @IsNotEmpty()
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
  featureIds: Array<Array<string>>;
}
