import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from './schemas/device.schema';
import { DevicesRepository } from './repositories/devices.repository';
import { DevicesService } from './services/devices.service';
import { DevicesController } from './controllers/devices.controller';
import { User } from '../auth/schemas/user.schema';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Device.name, schema: DeviceSchema },
      { name: User.name, schema: DeviceSchema },
    ]),
    UsersModule,
  ],
  providers: [DevicesRepository, DevicesService],
  controllers: [DevicesController],
})
export class DevicesModule {}
