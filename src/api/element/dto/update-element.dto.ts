import { PartialType } from '@nestjs/mapped-types';
import { CreateElementDto } from './create-element.dto';
import { IsNumber } from 'class-validator';

export class UpdateElementDto extends PartialType(CreateElementDto) {}

export class CancellationElementDto {
  @IsNumber()
  elementState: number;
}
