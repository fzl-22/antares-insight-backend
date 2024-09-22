import { User } from '@auth/schemas/user.schema';
import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeviceNotificationLogDocument } from '@notifications/schemas/device-notification-log.schema.dto';
import * as firebase from 'firebase-admin';
import {
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
} from '@notifications/dto/get-notification-history.dto';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { MailerService } from '@nestjs-modules/mailer';

interface PaginationParams {
  page?: number;
  perPage?: number;
}

@Injectable()
export class NotificationsRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private mailerService: MailerService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
  ) {}

  async createNotificationLog(params: {
    userId: Types.ObjectId;
    deviceId: Types.ObjectId;
    title: string;
    content: string;
  }): Promise<void> {
    const { userId, deviceId, title, content } = params;

    const newLog = { deviceId, title, content };

    await this.userModel
      .findByIdAndUpdate(
        userId,
        { $push: { notificationHistory: newLog } },
        { new: true },
      )
      .exec();
  }

  async findNotificationHistory(
    userId: Types.ObjectId,
    { page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE }: PaginationParams,
  ): Promise<DeviceNotificationLogDocument[]> {
    const skip = (page - 1) * perPage;
    const user = await this.userModel
      .findById(userId)
      .populate({
        path: 'notificationHistory',
        options: {
          skip: skip,
          limit: perPage,
        },
      })
      .exec();

    return (user?.notificationHistory as DeviceNotificationLogDocument[]) || [];
  }

  async countDocuments(userId: Types.ObjectId): Promise<number> {
    return await this.userModel
      .findById(userId)
      .exec()
      .then((user) => {
        return user?.notificationHistory.length;
      });
  }

  async sendPushNotification(params: {
    fcmToken: string;
    title: string;
    body: string;
  }): Promise<void> {
    try {
      await firebase.messaging().send({
        notification: {
          title: params.title,
          body: params.body,
        },
        token: params.fcmToken,
        data: {},
        android: {
          priority: 'high',
          notification: {
            sound: 'default',
            channelId: 'default',
          },
        },
      });
      this.logger.info(
        `Push notification sent successfully to ${params.fcmToken}.`,
        { context: 'FIREBASE_NOTIFICATION' },
      );
    } catch (e) {
      this.logger.warn(
        `Failed to push notification to ${params.fcmToken}: ${e.message}.`,
        { context: 'FIREBASE_NOTIFICATION' },
      );
    }
  }

  async sendMailNotification(params: {
    to: string;
    subject: string;
    text: string;
  }): Promise<boolean> {
    try {
      await this.mailerService.sendMail({
        to: params.to,
        subject: params.subject,
        text: params.text,
      });

      return true;
    } catch (err) {
      this.logger.warn(err.message, { context: 'MAILER' });
      return false;
    }
  }
}
