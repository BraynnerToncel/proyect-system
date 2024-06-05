import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { TypeOfUseService } from './type-of-use.service';
import { CreateTypeOfUseDto } from './dto/create-type-of-use.dto';
import { UpdateTypeOfUseDto } from './dto/update-type-of-use.dto';
import { Public } from '@decorator/routes-public.decorator';

@Controller('type-of-use')
export class TypeOfUseController {
  constructor(private readonly typeOfUseService: TypeOfUseService) {}

  @Public()
  @Post('create')
  create(@Body() createTypeOfUseDto: CreateTypeOfUseDto) {
    return this.typeOfUseService.create(createTypeOfUseDto);
  }
  @Public()
  @Get('list')
  findAll() {
    return this.typeOfUseService.findAll();
  }
  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.typeOfUseService.findOne(id);
  }
  @Public()
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateTypeOfUseDto: UpdateTypeOfUseDto,
  ) {
    return this.typeOfUseService.update(id, updateTypeOfUseDto);
  }
  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.typeOfUseService.remove(id);
  }
}
