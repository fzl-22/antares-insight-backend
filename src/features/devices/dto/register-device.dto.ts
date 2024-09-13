import { Exclude, Expose, Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsUrl,
  ValidateNested,
} from 'class-validator';
import { DeviceCategory, DeviceStatus } from '../schemas/device.schema';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
// import { Types } from 'mongoose';

export class DeviceMetricDto {
  /**
   * Metric name
   * @example 'Voltage'
   */
  @Expose()
  @IsNotEmpty()
  metric: string;

  /**
   * Metric unit
   * @example 'V' for volts
   */
  @Expose()
  @IsNotEmpty()
  unit: string;

  /**
   * Minimum value of metric normal condition
   * @example 0
   */
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  min: number;

  /**
   * Maximum value of metric normal condition
   * @example 250
   */
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  max: number;
}

export class RegisterDeviceRequestDto {
  /**
   * User's device name
   * @example 'Power Meter Device'
   */
  @Expose()
  @IsNotEmpty()
  name: string;

  /**
   * User's device connection URL
   * @example 'https://example.com/api/power-meter'
   */
  @Expose()
  @IsNotEmpty()
  @IsUrl()
  connectionUrl: string;

  /**
   * User's device location
   * @example 'Power Meter'
   */
  @Expose()
  @IsNotEmpty()
  @IsEnum(DeviceCategory)
  category: DeviceCategory;

  /**
   * User's device physical location
   * @example 'Room 1'
   */
  @Expose()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    description: "User's device metrics",
    type: [DeviceMetricDto],
    example: [{ metric: 'Voltage', unit: 'V', min: 0, max: 250 }],
  })
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  metrics: DeviceMetricDto[];

  @ApiHideProperty()
  @Exclude()
  status: DeviceStatus;
}

export class RegisterDeviceResponseDto {
  /**
   * User's device id
   * @example '66e02e93a4b00a1e1444af56'
   */
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  /**
   * User's device name
   * @example 'Power Meter Device'
   */
  @Expose()
  name: string;

  /**
   * User's device connection URL
   * @example 'https://example.com/api/power-meter'
   */
  @Expose()
  @IsNotEmpty()
  connectionUrl: string;

  /**
   * User's device location
   * @example 'Power Meter'
   */
  @Expose()
  @IsEnum(DeviceCategory)
  category: DeviceCategory;

  /**
   * User's device physical location
   * @example 'Room 1'
   */
  @Expose()
  location: string;

  /**
   * User's registered device's status
   * @example Inactive
   */
  @Expose()
  @IsEnum(DeviceStatus)
  status: DeviceStatus;

  /**
   * User ID associated with the device
   * @example '60d4fe9f4d1a2b001c8c8a0d'
   */
  @Expose()
  @Transform(({ obj }) => obj.userId.toString())
  userId: Types.ObjectId;

  @ApiProperty({
    description: "User's registered device's metrics",
    type: [DeviceMetricDto],
    example: [{ metric: 'Voltage', unit: 'V', min: 0, max: 250 }],
  })
  @Expose()
  @ValidateNested({ each: true })
  metrics: DeviceMetricDto[];
}

export class RegisterDeviceResponse {
  /**
   * Response status code
   * @example 201
   */
  statusCode: number;

  /**
   * Response message
   * @example 'Device created successfully.'
   */
  message: string;

  /**
   * Registered device details
   */
  data: RegisterDeviceResponseDto;
}
