import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from '@devices/schemas/device.schema';
import { DevicesRepository } from '@devices/repositories/devices.repository';
import { DevicesService } from '@devices/services/devices.service';
import { DevicesController } from '@devices/controllers/devices.controller';
import { User } from '@auth/schemas/user.schema';
import { UsersModule } from '@users/users.module';

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
