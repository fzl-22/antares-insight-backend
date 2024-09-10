import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createValidationPipe } from './common/pipes/validation.pipe';
import { createResponseTransformerInterceptor } from './common/interceptors/transformer.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalInterceptors(createResponseTransformerInterceptor());

  await app.listen(3000);
}
bootstrap();
