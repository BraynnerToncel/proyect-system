import { Logger } from '@nestjs/common';
import {
  TypeOrmModuleAsyncOptions,
  TypeOrmModuleOptions,
} from '@nestjs/typeorm';

export const TypeOrmConfigAsync: TypeOrmModuleAsyncOptions = {
  useFactory: async (): Promise<TypeOrmModuleOptions> => {
    const logger: Logger = new Logger('TypeOrmConfig');

    logger.log(`DATABASE_TYPE ${process.env.DATABASE_TYPE}`);
    logger.log(`DATABASE_HOST ${process.env.DATABASE_HOST}`);
    logger.log(`DATABASE_PASSWORD ${process.env.DATABASE_PASSWORD}`);
    logger.log(`DATABASE_PORT ${process.env.DATABASE_PORT}`);
    logger.log(`DATABASE_NAME ${process.env.DATABASE_NAME}`);
    logger.log(`DATABASE_SYNC ${process.env.DATABASE_SYNC}`);

    return {
      type: process.env.DATABASE_TYPE as
        | 'mysql'
        | 'mssql'
        | 'postgres'
        | 'mongodb',
      host: process.env.DATABASE_HOST,
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT ? +process.env.DATABASE_PORT : undefined,
      database: process.env.DATABASE_NAME,
      entities: ['dist/**/*.entity.{ts,js}'],
      logger: 'file',
      synchronize: process.env.DATABASE_SYNC === 'true' ? true : false, //don't use in production
      options: {
        encrypt: false,
      },
    };
  },
};
