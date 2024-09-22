import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Device, DeviceSchema } from '@devices/schemas/device.schema';
import { DevicesRepository } from '@devices/repositories/devices.repository';
import { DevicesService } from '@devices/services/devices.service';
import { DevicesController } from '@devices/controllers/devices.controller';
import { User } from '@auth/schemas/user.schema';
import { UsersModule } from '@users/users.module';
import { DevicesGateway } from '@devices/gateways/devices.gateway';
import { DevicesMqttService } from '@devices/services/devices.mqtt.service';
import { AuthRepository } from '@auth/repositories/auth.repository';
import { NotificationsService } from '@features/notifications/services/notifications.service';
import { UsersRepository } from '@users/repositories/users.repository';
import { NotificationsRepository } from '@features/notifications/repositories/notifications.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Device.name, schema: DeviceSchema },
      { name: User.name, schema: DeviceSchema },
    ]),
    UsersModule,
  ],
  providers: [
    DevicesRepository,
    DevicesService,
    DevicesGateway,
    DevicesMqttService,
    AuthRepository,
    UsersRepository,
    NotificationsService,
    NotificationsRepository,
  ],
  controllers: [DevicesController],
})
export class DevicesModule {}
