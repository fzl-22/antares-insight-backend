import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createValidationPipe } from './core/pipes/validation.pipe';
import { createResponseTransformerInterceptor } from './core/interceptors/transformer.interceptor';
import { setUpSwagger } from './core/docs/swagger.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(createValidationPipe());
  app.useGlobalInterceptors(createResponseTransformerInterceptor());

  setUpSwagger(app);

  await app.listen(3000);
}
bootstrap();
