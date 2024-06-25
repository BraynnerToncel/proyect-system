import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateTypeOfUseDto {
  @IsString()
  @MinLength(4)
  @MaxLength(45)
  @IsNotEmpty()
  typeOfUseName: string;

  @IsString()
  @MinLength(8)
  @MaxLength(100)
  @IsNotEmpty()
  typeOfUseConcept: string;
}
