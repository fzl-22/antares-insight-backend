import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export enum DeviceCategory {
  POWER_METER = 'Power Meter',
  WATER_METER = 'Water Meter',
  WATER_LEVEL = 'Water Level',
  ENVIRONMENTAL_MONITOR = 'Environmental Monitor',
}

export enum DeviceStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export type DeviceDocument = HydratedDocument<Device>;

@Schema({ _id: false })
export class DeviceMetric {
  @Prop({ required: true })
  metric: string;

  @Prop({ required: true })
  unit: string;

  @Prop({ required: true })
  min: number;

  @Prop({ required: true })
  max: number;
}

@Schema({ timestamps: true })
export class Device {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  connectionUrl: string;

  @Prop({
    required: true,
    enum: DeviceCategory,
    default: DeviceCategory.POWER_METER,
  })
  category: DeviceCategory;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true, enum: DeviceStatus, default: DeviceStatus.INACTIVE })
  status: DeviceStatus;

  @Prop({ required: true, type: [DeviceMetric], default: [] })
  metrics: DeviceMetric[];

  // Add userId field that references the User schema
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;
}

export const DeviceSchema = SchemaFactory.createForClass(Device);
