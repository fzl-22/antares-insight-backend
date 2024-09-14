import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { MongooseModuleOptions } from '@nestjs/mongoose';

const getMongooseConfig = async (
  configService: ConfigService,
): Promise<MongooseModuleOptions> => {
  return {
    uri: `mongodb+srv://${configService.get('MONGODB_CLUSTER')}`,
    auth: {
      username: configService.get('MONGODB_USERNAME'),
      password: configService.get('MONGODB_PASSWORD'),
    },
    dbName: configService.get('MONGODB_DB_NAME'),
    retryWrites: configService.get<boolean>('MONGODB_RETRY_WRITES'),
    writeConcern: {
      w:
        configService.get('MONGODB_WRITE_CONCERN') === 'majority'
          ? 'majority'
          : parseInt(configService.get('MONGODB_WRITE_CONCERN'), 10),
    },
    appName: configService.get('MONGODB_APP_NAME'),
  };
};

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getMongooseConfig,
    }),
  ],
})
export class DatabaseModule {}
