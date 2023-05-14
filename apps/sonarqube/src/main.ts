import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useLogger(process.env.NODE_ENV === 'production' ? ['log', 'warn', 'error'] : ['verbose', 'debug', 'log', 'warn', 'error']);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
