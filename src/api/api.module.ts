import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { RoleModule } from './role/role.module';
import { PermissionModule } from './permission/permission.module';
import { FileModule } from './file/file.module';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtAuthGuard } from '@guard/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { FeatureModule } from './feature/feature.module';
import { TypeModule } from './type/type.module';
import { ElementModule } from './element/element.module';
import { InstallModule } from './install/install.module';
import { TypeOfUseModule } from './type-of-use/type-of-use.module';
import { ReservationModule } from './reservation/reservation.module';
import { LoanModule } from './loan/loan.module';

@Module({
  imports: [
    UserModule,
    RoleModule,
    PermissionModule,
    FileModule,
    AuthModule,
    JwtModule,
    FeatureModule,
    TypeModule,
    ElementModule,
    InstallModule,
    TypeOfUseModule,
    ReservationModule,
    LoanModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class ApiModule {}
