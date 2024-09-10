import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getMongooseConfig } from './mongodb';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getMongooseConfig,
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
