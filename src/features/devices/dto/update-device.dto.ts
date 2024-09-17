import {
  DeviceCategory,
  DeviceHistory,
  DeviceStatus,
} from '@devices/schemas/device.schema';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Matches,
  ValidateNested,
} from 'class-validator';
import { DeviceMetricDto, DeviceResponseDto } from './device.dto';
import { Types } from 'mongoose';

export class UpdateDeviceRequestParamDto {
  /**
   * updated device's id
   */
  @Expose()
  @IsNotEmpty()
  readonly deviceId: string;
}

export class UpdateDeviceRequestBodyDto {
  /**
   * new device's name
   * @example 'Power Meter Device
   */
  @Expose()
  @IsOptional()
  readonly name?: string;

  /**
   * new device's connection URL
   * @example 'https://example.com/api/power-meter
   */
  @Expose()
  @IsOptional()
  @Matches(/^(mqtt|http|https):\/\/[^\s$.?#].[^\s]*$/i, {
    message:
      'connectionUrl must be a valid URL with mqtt, http, or https protocol',
  })
  readonly connectionUrl?: string;

  /**
   * new device's category
   * @example 'Power Meter'
   */
  @Expose()
  @IsOptional()
  @IsEnum(DeviceCategory)
  readonly category?: DeviceCategory;

  /**
   * new device's physical location
   * @example 'Room 1'
   */
  @Expose()
  @IsOptional()
  readonly location?: string;

  @ApiProperty({
    description: "new device's metrics",
    type: [DeviceMetricDto],
    example: [{ metric: 'Voltage', unit: 'V', min: 0, max: 250 }],
  })
  @Expose()
  @IsOptional()
  @IsArray()
  @Type(() => DeviceMetricDto)
  @ValidateNested({ each: true })
  readonly metrics?: DeviceMetricDto[];

  @ApiHideProperty()
  @Exclude()
  readonly status?: DeviceStatus;

  @ApiHideProperty()
  @Exclude()
  readonly userId?: Types.ObjectId;

  @ApiHideProperty()
  @Exclude()
  readonly history?: DeviceHistory[];
}

export class UpdateDeviceResponse {
  /**
   * Response status code
   * @example 201
   */
  readonly statusCode: number;

  /**
   * Response message
   * @example 'Device created successfully.'
   */
  readonly message: string;

  /**
   * Response data
   */
  readonly data: DeviceResponseDto;
}
