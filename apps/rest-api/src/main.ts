/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { fastifyMultipart } from '@fastify/multipart';
import { fastifyStatic } from '@fastify/static';
import path from 'path';
import { getKafkaOptions } from '@streams/transport';

import { AppModule } from './app/app.module';


async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter();
  fastifyAdapter.register(fastifyMultipart, {
    limits: {
      fileSize: 15 * 1024 * 1024 // 15 mb
    }
  });
  fastifyAdapter.register(fastifyStatic, {
    root: path.resolve('tmp'),
    prefix: '/public/'
  });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, fastifyAdapter);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );
  app.enableCors();

  const port = process.env.PORT || 3000;
  const address = process.env.HOST || '0.0.0.0';

  app.connectMicroservice(getKafkaOptions('REST-API'));

  await app.startAllMicroservices();

  await app.listen(port, address);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
