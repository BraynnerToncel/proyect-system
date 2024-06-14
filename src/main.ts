import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json, urlencoded } from 'body-parser';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // Configuración del logger
  const logger: Logger = new Logger('SERVER');

  // Obteniendo la dirección IP del entorno
  const ip: string | undefined = process.env.IP;

  // Definiendo los nombres de los archivos de clave y certificado
  const keyFile = 'privkey'; //PRIVATE KEY
  const certFile = 'fullchain'; //CERT

  // Ruta del directorio que contiene los archivos de clave y certificado
  const serverSecurePath: string = join(__dirname, '../config/secrets/');
  let keyPath: string;
  let certPath: string;

  // Verificando si existen los archivos de clave y certificado
  existsSync(serverSecurePath) &&
    readdirSync(serverSecurePath).forEach((path) => {
      if (path.startsWith(keyFile) && !keyPath)
        keyPath = join(serverSecurePath, path);
      if (path.startsWith(certFile) && !certPath)
        certPath = join(serverSecurePath, path);
    });

  // Verificando si se encontraron archivos de clave y certificado
  const serverSecure = keyPath && certPath;

  // Registrando el estado de la seguridad del servidor
  logger.log(`Server secure status ${serverSecure ? 'enable' : 'disable'}`);

  // Creando la aplicación NestJS
  const app = serverSecure
    ? await NestFactory.create(AppModule, {
        // Configurando opciones HTTPS si se encontraron archivos de clave y certificado
        httpsOptions: {
          key: readFileSync(keyPath),
          cert: readFileSync(certPath),
        },
      })
    : await NestFactory.create(AppModule);

  // Habilitando CORS para todas las solicitudes
  app.enableCors({ origin: '*' });

  // Configurando middleware para parsear solicitudes con cuerpo JSON y codificado en URL
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  // Aplicando un Pipe global para la validación de datos de entrada
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Permitiendo solo propiedades definidas en las clases DTO
      forbidNonWhitelisted: true, // Rechazando solicitudes con propiedades no definidas en las clases DTO
      transform: true, // Convirtiendo automáticamente el tipo de datos
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

  // Definiendo el puerto seguro y el puerto por defecto
  const securePort: number = process.env.SECURE_PORT
    ? +process.env.SECURE_PORT
    : 443;
  const port: number = process.env.PORT ? +process.env.PORT : 3000;

  // Determinando el puerto en el que escuchará el servidor
  const listenPort: number = serverSecure ? securePort : port;

  // Iniciando el servidor y escuchando en el puerto definido
  await app.listen(listenPort, ip);

  // Registrando la dirección IP y el puerto en el que escucha el servidor
  logger.log(`Server listen on ${ip ?? '*'}:${listenPort}`);
}

// Iniciando la aplicación
bootstrap();
