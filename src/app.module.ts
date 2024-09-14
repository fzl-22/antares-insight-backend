import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { CoreModule } from '@core/core.module';
import { FeaturesModule } from '@features/features.module';
import { RequestResponseLoggingMiddleware } from '@core/middlewares/request-response-logging.middleware';

@Module({
  imports: [CoreModule, FeaturesModule],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestResponseLoggingMiddleware).forRoutes('/');
  }
}
