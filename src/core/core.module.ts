import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@core/database/database.module';
import { TokenModule } from '@core/token/token.module';
import { createApiKeyGuardProvider } from '@core/guards/api-key.guard';
import { LoggerModule } from '@core/logger/logger.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`,
    }),
    DatabaseModule,
    TokenModule,
    LoggerModule,
  ],
  providers: [createApiKeyGuardProvider()],
})
export class CoreModule {}
