import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from '@entity/api/role/role.entity';
import { JwtConfigAsync } from 'src/data/security-config/jwt/jwt.config';
import { UserModule } from '@api/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role]),
    JwtModule.registerAsync({
      useClass: JwtConfigAsync,
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
