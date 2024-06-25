import { Injectable } from '@nestjs/common';
import { CreateInstallDto } from './dto/create-install.dto';
import { UpdateInstallDto } from './dto/update-install.dto';

@Injectable()
export class InstallService {
  create(createInstallDto: CreateInstallDto) {
    return 'This action adds a new install';
  }

  findAll() {
    return `This action returns all install`;
  }

  findOne(id: number) {
    return `This action returns a #${id} install`;
  }

  update(id: number, updateInstallDto: UpdateInstallDto) {
    return `This action updates a #${id} install`;
  }

  remove(id: number) {
    return `This action removes a #${id} install`;
  }
}
