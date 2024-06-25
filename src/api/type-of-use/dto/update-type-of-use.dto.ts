import { PartialType } from '@nestjs/mapped-types';
import { CreateTypeOfUseDto } from './create-type-of-use.dto';

export class UpdateTypeOfUseDto extends PartialType(CreateTypeOfUseDto) {}
