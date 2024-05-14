import { Module } from '@nestjs/common';
import { ApiModule } from './api/api.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigAsync } from '@database-config/typeorm/typeorm.config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { getEnvPath } from 'common/helper/env.helper';
import { ConfigModule } from '@nestjs/config';
import { SharedModule } from './data/shared/shared.module';

const envFilePath: string = getEnvPath(`${__dirname}/../common/envs`);

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    // delimitar los nombres de los envetos en puntos
    // en caso de no tenerlos installado
    // npm install --save @nestjs/config
    EventEmitterModule.forRoot({ delimiter: '.' }),

    TypeOrmModule.forRootAsync(TypeOrmConfigAsync),
    //esto se usa Para servir contenido estático como una aplicación de página única
    // en caso de no tenerlos installado
    // npm install --save @nestjs/serve-static
    // ServeStaticModule.forRoot({
    //   serveRoot: '/static',
    //   rootPath: process.env.STORE_FILES_PATH,
    // }),
    ApiModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
