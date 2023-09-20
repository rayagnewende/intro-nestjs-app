import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import * as config from 'config';

async function bootstrap() {
  const logger = new Logger('BootStrap');
  const app = await NestFactory.create(AppModule);

  const serverConfig = config.get('server');

  const port = process.env.PORT || serverConfig.port;
  await app.listen(port);
  logger.log(`le serveur a été lancé sur le port :${port} avec succès!! `);
}
bootstrap();
