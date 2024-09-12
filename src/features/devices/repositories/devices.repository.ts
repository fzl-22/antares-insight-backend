import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Device, DeviceDocument } from '../schemas/device.schema';
import { FilterQuery, Model } from 'mongoose';

@Injectable()
export class DevicesRepository {
  constructor(@InjectModel(Device.name) private deviceModel: Model<Device>) {}

  async create(device: Device): Promise<DeviceDocument | null> {
    return await this.deviceModel.create(device);
  }

  async findOne(filter: FilterQuery<Device>): Promise<DeviceDocument | null> {
    return await this.deviceModel.findOne(filter).exec();
  }
}
