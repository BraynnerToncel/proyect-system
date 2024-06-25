import { Module } from '@nestjs/common';
import { ElementService } from './element.service';
import { ElementController } from './element.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Element } from '@entity/api/element/element.entity';
import { Type } from '@entity/api/type/type.entity';
import { Feature } from '@entity/api/feature/feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Element, Type, Feature])],
  controllers: [ElementController],
  providers: [ElementService],
  exports: [ElementModule],
})
export class ElementModule {}
