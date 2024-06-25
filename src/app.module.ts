import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigAsync } from '@database-config/typeorm/typeorm.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './data/shared/shared.module';
import { AllExceptionsFilter } from '@interceptor/catch/catch.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from '@interceptor/response/response.interceptor';
import { MorganInterceptor, MorganModule } from 'nest-morgan';
import { getEnvPath } from 'common/helper/env.helper';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CoreModule } from './core/core.module';

const envFilePath: string = getEnvPath(`${__dirname}/../common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    // delimitar los nombres de los envetos en puntos

    EventEmitterModule.forRoot({ delimiter: '.' }),

    TypeOrmModule.forRootAsync(TypeOrmConfigAsync),
    //esto se usa Para servir contenido estático como una aplicación de página única
    ServeStaticModule.forRoot({
      serveRoot: '/static',
      rootPath: process.env.STORE_FILES_PATH,
    }),

    ApiModule,
    MorganModule,
    SharedModule,
    CoreModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // morgan es para reguistar en logging todas las peticiones
    // npm install --save morgan

    {
      provide: APP_INTERCEPTOR,
      useClass: MorganInterceptor('dev'),
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
