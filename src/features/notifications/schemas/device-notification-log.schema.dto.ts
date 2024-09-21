import { Prop, Schema } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type DeviceNotificationLogDocument =
  HydratedDocument<DeviceNotificationLog>;

@Schema({ timestamps: true })
export class DeviceNotificationLog {
  @Prop({ required: true })
  deviceId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;
}
