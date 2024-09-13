import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from '@devices/schemas/device.schema';
import { FilterQuery, Model } from 'mongoose';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@core/constants/constants';

interface PaginationParams {
  page?: number;
  perPage?: number;
}

@Injectable()
export class DevicesRepository {
  constructor(@InjectModel(Device.name) private deviceModel: Model<Device>) {}

  async create(device: Device): Promise<DeviceDocument | null> {
    return await this.deviceModel.create(device);
  }

  async findOne(filter: FilterQuery<Device>): Promise<DeviceDocument | null> {
    return await this.deviceModel.findOne(filter).exec();
  }

  async findAll(
    filter: FilterQuery<Device>,
    { page = DEFAULT_PAGE, perPage = DEFAULT_PER_PAGE }: PaginationParams,
  ): Promise<DeviceDocument[]> {
    const skip = (page - 1) * perPage;
    return await this.deviceModel.find(filter).skip(skip).limit(perPage).exec();
  }

  async countDocuments(filter: FilterQuery<Device>): Promise<number> {
    return this.deviceModel.countDocuments(filter).exec();
  }
}
