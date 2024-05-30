import { PartialType } from '@nestjs/mapped-types';
import { CreateInstallDto } from './create-install.dto';

export class UpdateInstallDto extends PartialType(CreateInstallDto) {}
