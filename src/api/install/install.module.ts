import { Module } from '@nestjs/common';
import { InstallService } from './install.service';
import { InstallController } from './install.controller';

@Module({
  controllers: [InstallController],
  providers: [InstallService],
})
export class InstallModule {}
