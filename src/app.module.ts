import { Module } from '@nestjs/common';

import { AuthModule } from './features/auth/auth.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [CommonModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
