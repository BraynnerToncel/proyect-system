import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from '@entity/api/user/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserView } from '@entity/view/user/user.vew.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserView])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
