import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ElementService } from './element.service';
import { CreateElementDto } from './dto/create-element.dto';
import {
  CancellationElementDto,
  UpdateElementDto,
} from './dto/update-element.dto';
import { Public } from '@decorator/routes-public.decorator';
import { IElement } from '@interface/api/element/element.interface';

@Controller('element')
export class ElementController {
  constructor(private readonly elementService: ElementService) {}

  @Public()
  @Post('create')
  create(@Body() createElementDto: CreateElementDto) {
    return this.elementService.create(createElementDto);
  }

  @Public()
  @Get('list')
  findAll() {
    return this.elementService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.elementService.findOne(id);
  }

  @Public()
  @Put(':id')
  update(@Param('id') id: string, @Body() updateElementDto: UpdateElementDto) {
    return this.elementService.update(id, updateElementDto);
  }
  @Public()
  @Put(':id/state')
  updateState(
    @Param('id') id: string,
    @Body() cancellationElementDto: CancellationElementDto,
  ): Promise<IElement> {
    return this.elementService.updateStates(id, cancellationElementDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.elementService.remove(id);
  }
}
