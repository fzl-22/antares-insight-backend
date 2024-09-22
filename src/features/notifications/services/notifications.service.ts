import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GetNotificationHistoryRequestDto,
  GetNotificationHistoryResponseDto,
} from '@notifications/dto/get-notification-history.dto';
import { UsersRepository } from '@users/repositories/users.repository';
import { NotificationsRepository } from '@notifications/repositories/notifications.repository';
import { Types } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { DeviceNotificationLogDto } from '@notifications/dto/device-notification-log.dto';
import { DeviceMetric } from '@devices/schemas/device.schema';

@Injectable()
export class NotificationsService {
  constructor(
    private usersRepository: UsersRepository,
    private notificationsRepository: NotificationsRepository,
  ) {}

  async getDeviceNotificationHistory(
    userId: string,
    getNotificationHistoryDto: GetNotificationHistoryRequestDto,
  ): Promise<GetNotificationHistoryResponseDto> {
    const { page, perPage } = getNotificationHistoryDto;
    const existingUser = await this.usersRepository.findUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const [notificationHistory, totalNotifications] = await Promise.all([
      this.notificationsRepository.findNotificationHistory(
        Types.ObjectId.createFromHexString(userId),
        { page: page, perPage: perPage },
      ),
      this.notificationsRepository.countDocuments(
        Types.ObjectId.createFromHexString(userId),
      ),
    ]);

    const totalPages = Math.ceil(totalNotifications / perPage);

    return plainToClass(
      GetNotificationHistoryResponseDto,
      {
        page: page,
        perPage: perPage,
        totalPages: totalPages,
        notificationHistory: notificationHistory.map((log) => {
          return plainToClass(DeviceNotificationLogDto, log.toObject());
        }),
      },
      { excludePrefixes: ['_'] },
    );
  }

  async createDeviceNotificationLog(params: {
    userId: string;
    deviceId: string;
    title: string;
    content: string;
  }): Promise<void> {
    const { userId, deviceId, title, content } = params;

    await this.notificationsRepository.createNotificationLog({
      userId: Types.ObjectId.createFromHexString(userId),
      deviceId: Types.ObjectId.createFromHexString(deviceId),
      title,
      content,
    });
  }

  async sendNotification(
    userId: string,
    deviceId: string,
    deviceName: string,
    value: number,
    metric: DeviceMetric,
  ): Promise<void> {
    // always fetch user data to prevent send notification mismatch
    const user = await this.usersRepository.findUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const formattedDateTime = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false,
    });

    const title = 'Device Alert';
    const message = `The ${deviceName}'s ${metric.metric} is out of range. Current value: ${value} ${metric.unit}.\n\nThis event occurred at ${formattedDateTime}.\n\nPlease take appropriate action to resolve the issue.`;

    await this.createDeviceNotificationLog({
      userId: user._id.toString(),
      deviceId: deviceId,
      title: title,
      content: message,
    });

    if (user.fcmToken && (user.configuration?.enablePushNotification ?? true)) {
      this.notificationsRepository.sendPushNotification({
        fcmToken: user.fcmToken,
        title: title,
        body: message,
      });
    }

    if (user.configuration?.enableMailNotification ?? true) {
      this.notificationsRepository.sendMailNotification({
        to: user.email,
        subject: title,
        text: message,
      });
    }
  }
}
