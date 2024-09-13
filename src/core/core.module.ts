import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@core/database/database.module';
import { TokenModule } from '@core/token/token.module';
import { APP_GUARD } from '@nestjs/core';
import { ApiKeyGuard } from '@core/guards/api-key.guard';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}.local`,
    }),
    DatabaseModule,
    TokenModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class CoreModule {}
