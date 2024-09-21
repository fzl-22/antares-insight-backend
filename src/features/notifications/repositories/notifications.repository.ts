import { User } from '@auth/schemas/user.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DeviceNotificationLogDocument } from '../schemas/device-notification-log.schema.dto';
import {
  DEFAULT_PAGE,
  DEFAULT_PER_PAGE,
} from '../dto/get-notification-history.dto';

interface PaginationParams {
  page?: number;
  perPage?: number;
}

@Injectable()
export class NotificationsRepository {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async createNotificationLog(params: {
    userId: Types.ObjectId;
    deviceId: Types.ObjectId;
    title: string;
    content: string;
  }): Promise<void> {}

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
}
