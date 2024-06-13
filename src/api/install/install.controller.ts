import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { InstallService } from './install.service';
import { CreateInstallDto } from './dto/create-install.dto';
import { UpdateInstallDto } from './dto/update-install.dto';
import { Public } from '@decorator/routes-public.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('install')
@Public()
@Controller('install')
export class InstallController {
  constructor(private readonly installService: InstallService) {}

  @Post()
  create(@Body() createInstallDto: CreateInstallDto) {
    return this.installService.create(createInstallDto);
  }

  @Get()
  findAll() {
    return this.installService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.installService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateInstallDto: UpdateInstallDto) {
    return this.installService.update(+id, updateInstallDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.installService.remove(+id);
  }
}
