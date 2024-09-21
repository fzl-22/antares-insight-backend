import { DeviceNotificationLog } from '@features/notifications/schemas/device-notification-log.schema.dto';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export type UserConfigurationDocument = HydratedDocument<UserConfiguration>;

@Schema({ _id: false })
export class UserConfiguration {
  @Prop({ default: true })
  enablePushNotification: boolean;

  @Prop({ default: true })
  enableMailNotification: boolean;
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ type: UserConfiguration, default: () => ({}) })
  configuration?: UserConfiguration;

  @Prop({ type: [DeviceNotificationLog], default: [] })
  notificationHistory?: DeviceNotificationLog[];

  @Prop()
  fcmToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
