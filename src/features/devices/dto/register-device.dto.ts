import { Exclude, Expose } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  Matches,
  ValidateNested,
} from 'class-validator';
import { DeviceCategory, DeviceStatus } from '@devices/schemas/device.schema';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { DeviceMetricDto, DeviceResponseDto } from '@devices/dto/device.dto';

export class RegisterDeviceRequestDto {
  /**
   * User's device name
   * @example 'Power Meter Device'
   */
  @Expose()
  @IsNotEmpty()
  readonly name: string;

  /**
   * User's device connection URL
   * @example 'https://example.com/api/power-meter'
   */
  @Expose()
  @IsNotEmpty()
  @Matches(/^(mqtt|http|https):\/\/[^\s$.?#].[^\s]*$/i, {
    message:
      'connectionUrl must be a valid URL with mqtt, http, or https protocol',
  })
  readonly connectionUrl: string;

  /**
   * User's device category
   * @example 'Power Meter'
   */
  @Expose()
  @IsNotEmpty()
  @IsEnum(DeviceCategory)
  readonly category: DeviceCategory;

  /**
   * User's device physical location
   * @example 'Room 1'
   */
  @Expose()
  @IsNotEmpty()
  readonly location: string;

  @ApiProperty({
    description: "User's device metrics",
    type: [DeviceMetricDto],
    example: [{ metric: 'Voltage', unit: 'V', min: 0, max: 250 }],
  })
  @Expose()
  @IsArray()
  @ValidateNested({ each: true })
  readonly metrics: DeviceMetricDto[];

  @ApiHideProperty()
  @Exclude()
  readonly status: DeviceStatus;
}

export class RegisterDeviceResponse {
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
