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
import { UsersService } from '@users/services/users.service';
import { MailNotificationService } from '@core/utils/notification/mail-notification.service';
import { FirebaseNotificationService } from '@core/utils/notification/firebase-notification.service';

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
    UsersService,
    MailNotificationService,
    FirebaseNotificationService,
  ],
  controllers: [DevicesController],
})
export class DevicesModule {}
