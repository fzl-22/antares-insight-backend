import { DeviceCategory, DeviceStatus } from '@devices/schemas/device.schema';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsEnum,
  ValidateNested,
  IsNumber,
  IsDefined,
} from 'class-validator';
import { Types } from 'mongoose';

export class DeviceMetricDto {
  /**
   * Metric name
   * @example 'Voltage'
   */
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  readonly metric: string;

  /**
   * Metric unit
   * @example 'V' for volts
   */
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  readonly unit: string;

  /**
   * Minimum value of metric normal condition
   * @example 0
   */
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  readonly min: number;

  /**
   * Maximum value of metric normal condition
   * @example 250
   */
  @Expose()
  @IsDefined()
  @IsNotEmpty()
  @IsNumber()
  readonly max: number;
}

export class DeviceHistoryDto {
  /**
   * Device history id
   * @example '66e02e93a4b00a1e1444af56'
   */
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  readonly id: string;

  /**
   * Device status at the time of the history entry
   * @example 'Active'
   */
  @Expose()
  @IsEnum(DeviceStatus)
  readonly status: DeviceStatus;

  /**
   * Device history message
   * @example 'Device is activate for X reason.'
   */
  @Expose()
  readonly message: string;

  /**
   * Date when the history is created
   * @example '2023-05-24T13:45:36.789Z'
   */
  @Expose()
  readonly createdAt: Date;

  /**
   * Date when the history is updated
   * @example '2023-05-24T13:45:36.789Z'
   */
  @Expose()
  readonly updatedAt: Date;
}

export class DeviceResponseDto {
  /**
   * User's device id
   * @example '66e02e93a4b00a1e1444af56'
   */
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  readonly id: string;

  /**
   * User's device name
   * @example 'Power Meter Device'
   */
  @Expose()
  readonly name: string;

  /**
   * User's device connection URL
   * @example 'https://example.com/api/power-meter'
   */
  @Expose()
  @IsNotEmpty()
  readonly connectionUrl: string;

  /**
   * User's device location
   * @example 'Power Meter'
   */
  @Expose()
  @IsEnum(DeviceCategory)
  readonly category: DeviceCategory;

  /**
   * User's device physical location
   * @example 'Room 1'
   */
  @Expose()
  readonly location: string;

  /**
   * User's registered device's status
   * @example Inactive
   */
  @Expose()
  @IsEnum(DeviceStatus)
  readonly status: DeviceStatus;

  /**
   * User ID associated with the device
   * @example '60d4fe9f4d1a2b001c8c8a0d'
   */
  @Expose()
  @Transform(({ obj }) => obj.userId.toString())
  readonly userId: Types.ObjectId;

  @ApiProperty({
    description: "User's registered device's metrics",
    type: [DeviceMetricDto],
    example: [{ metric: 'Voltage', unit: 'V', min: 0, max: 250 }],
  })
  @Expose()
  @ValidateNested({ each: true })
  readonly metrics: DeviceMetricDto[];

  @ApiProperty({
    description: "User's registered device's history",
    type: [DeviceHistoryDto],
    example: [
      {
        id: '66e5093eda304e25f1b7108a',
        status: 'Inactive',
        message: 'Device is deactivate for X reason.',
        createdAt: new Date('2023-05-24T13:45:36.789Z'),
        updatedAt: new Date('2023-05-24T13:45:36.789Z'),
      },
    ],
  })
  @Expose()
  @ValidateNested({ each: true })
  readonly history?: DeviceHistoryDto[];
}
