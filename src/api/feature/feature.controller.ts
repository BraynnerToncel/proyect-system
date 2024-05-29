import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { FeatureService } from './feature.service';
import { CreateFeatureDto } from './dto/create-feature.dto';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { IFeature } from '@interface/api/feature/feature.interface';
import { Public } from '@decorator/routes-public.decorator';

@Controller('feature')
export class FeatureController {
  constructor(private readonly featureService: FeatureService) {}

  @Public()
  @Post('create')
  public create(@Body() createFeatureDto: CreateFeatureDto): Promise<IFeature> {
    return this.featureService.create(createFeatureDto);
  }

  @Public()
  @Get('list')
  findAll(): Promise<Array<IFeature>> {
    return this.featureService.findAll();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.featureService.findOne(id);
  }

  @Public()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFeatureDto: UpdateFeatureDto) {
    return this.featureService.update(id, updateFeatureDto);
  }

  @Public()
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.featureService.remove(id);
  }
}
