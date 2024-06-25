import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'body-parser';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as os from 'os';

async function bootstrap() {
  const logger: Logger = new Logger('SERVER');
  const networkInterfaces = os.networkInterfaces();

  const ip: string = Object.values(networkInterfaces)
    .flat()
    .filter(({ family, internal }) => family === 'IPv4' && !internal)
    .map(({ address }) => address)[0];

  const keyFile = 'privkey';
  const certFile = 'fullchain';

  const serverSecurePath: string = join(__dirname, '../config/secrets/');
  let keyPath: string;
  let certPath: string;

  existsSync(serverSecurePath) &&
    readdirSync(serverSecurePath).forEach((path) => {
      if (path.startsWith(keyFile) && !keyPath)
        keyPath = join(serverSecurePath, path);
      if (path.startsWith(certFile) && !certPath)
        certPath = join(serverSecurePath, path);
    });

  const serverSecure = keyPath && certPath;

  logger.log(`Server secure status ${serverSecure ? 'enable' : 'disable'}`);

  const app = serverSecure
    ? await NestFactory.create(AppModule, {
        httpsOptions: {
          key: readFileSync(keyPath),
          cert: readFileSync(certPath),
        },
      })
    : await NestFactory.create(AppModule);

  app.enableCors({ origin: '*' });

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Proyect-management system')
    .setDescription('The proyect API management system  description')
    .setVersion('1.0')
    .addApiKey(
      {
        type: 'apiKey',
        name: 'x-token',
        in: 'header',
      },
      'x-token',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const securePort: number = process.env.SECURE_PORT
    ? +process.env.SECURE_PORT
    : 443;
  const port: number = process.env.PORT ? +process.env.PORT : 3000;

  const listenPort: number = serverSecure ? securePort : port;

  await app.listen(listenPort, ip);

  logger.log(`Server listen on ${ip ?? '*'}:${listenPort}`);
}

bootstrap();
