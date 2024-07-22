import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { exposedHeaders: 'content-range' },
  });
  await app.listen(4343);
}
bootstrap();
