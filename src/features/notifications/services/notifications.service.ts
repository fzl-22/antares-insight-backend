import { Injectable, NotFoundException } from '@nestjs/common';
import {
  GetNotificationHistoryRequestDto,
  GetNotificationHistoryResponseDto,
} from '../dto/get-notification-history.dto';
import { UsersRepository } from '@users/repositories/users.repository';
import { NotificationsRepository } from '../repositories/notifications.repository';
import { Types } from 'mongoose';
import { plainToClass } from 'class-transformer';
import { DeviceNotificationLogDto } from '../dto/device-notification-log.dto';

@Injectable()
export class NotificationsService {
  constructor(
    private usersRepository: UsersRepository,
    private notificationsRepository: NotificationsRepository,
  ) {}

  async getDeviceNotification(
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

    const notificationHistoryResponse = notificationHistory.map((log) => {
      return plainToClass(DeviceNotificationLogDto, log.toObject());
    });

    return plainToClass(GetNotificationHistoryResponseDto, {
      page: page,
      perPage: perPage,
      totalPages: totalPages,
      notificationHistory: notificationHistoryResponse,
    });
  }

  async createDeviceNotificationLog(params: {
    userId: string;
    deviceId: string;
    title: string;
    content: string;
  }): Promise<void> {
    const { userId, deviceId, title, content } = params;

    const existingUser = await this.usersRepository.findUserById(userId);
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    
  }
}
