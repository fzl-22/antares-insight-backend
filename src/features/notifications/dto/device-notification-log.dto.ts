import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class DeviceNotificationLogDto {
  /**
   * Device notification log id
   * @example '66e02e93a4b00a1e1444af56'
   */
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  readonly id: string;

  /**
   * Device related to the notification
   * @example '66e02e93a4b00a1e1444'
   */
  @Expose()
  @Transform(({ obj }) => obj.deviceId.toString())
  readonly deviceId: string;

  /**
   * Notification title
   * @example 'Device Alert'
   */
  @Expose()
  @IsNotEmpty()
  readonly title: string;

  /**
   * Notification content
   * @example 'Device is exceeded range ...'
   */
  @Expose()
  @IsNotEmpty()
  readonly content: string;

  /**
   * Date when the notification is created
   * @example '2023-05-24T13:45:36.789Z'
   */
  @Expose()
  @IsNotEmpty()
  readonly createdAt: Date;

  /**
   * Date when the notification is updated
   * @example '2023-05-24T13:45:36.789Z'
   */
  @Expose()
  @IsNotEmpty()
  readonly updatedAt: Date;
}
