import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
  ValidateNested,
} from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from 'src/core/constants/constants';
import { DeviceCategory, DeviceStatus } from '../schemas/device.schema';
import { DeviceMetricDto } from './register-device.dto';

export class GetDevicesRequestDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  readonly page?: number = DEFAULT_PAGE;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10), { toClassOnly: true })
  readonly perPage?: number = DEFAULT_PER_PAGE;
}

export class DeviceResponseDto {
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
  userId: string;

  @ApiProperty({
    description: "User's registered device's metrics",
    type: [DeviceMetricDto],
    example: [{ metric: 'Voltage', unit: 'V', min: 0, max: 250 }],
  })
  @Expose()
  @ValidateNested({ each: true })
  metrics: DeviceMetricDto[];
}

export class GetDevicesResponseDto {
  /**
   * Current page number
   * @example 1
   */
  @Expose()
  page: number;

  /**
   * Number of devices per page
   * @example 10
   */
  @Expose()
  perPage: number;

  /**
   * Total pages
   * @example 12
   */
  @Expose()
  totalPages: number;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => DeviceResponseDto)
  devices: DeviceResponseDto[];
}

export class GetDevicesResponse {
  /**
   * Response status code
   * @example 200
   */
  statusCode: number;

  /**
   * Response message
   * @example 'Device fetched successfully.'
   */
  message: string;

  /**
   * User's devices
   */
  data: GetDevicesResponseDto;
}
