import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(LoggerMiddleware);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }));
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Proyecto Modulo 4')
    .setDescription(
      'Esta es una API hecha con NestJS, cumpliendo con los requerimientos del Proyecto Integrador | Modulo 4 | Especialidad: Back end | Cohorte FT48 de HENRY.',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
