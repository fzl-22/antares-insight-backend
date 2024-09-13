import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { createValidationPipe } from '@core/pipes/validation.pipe';
import { createResponseTransformerInterceptor } from '@core/interceptors/transformer.interceptor';
import { setUpSwagger } from '@core/docs/swagger.config';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  const logger = app.get(WINSTON_MODULE_NEST_PROVIDER);

  app.useLogger(logger);
  app.useGlobalPipes(createValidationPipe());
  app.useGlobalInterceptors(createResponseTransformerInterceptor());

  setUpSwagger(app);

  await app.listen(3000);
}
bootstrap();
