import { Module } from '@nestjs/common';
import { TypeOfUseService } from './type-of-use.service';
import { TypeOfUseController } from './type-of-use.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOfUse } from '@entity/api/typeOfUse/typeOfUse.entity';

@Module({
  imports: [TypeOrmModule.forFeature([TypeOfUse])],
  controllers: [TypeOfUseController],
  providers: [TypeOfUseService],
})
export class TypeOfUseModule {}
