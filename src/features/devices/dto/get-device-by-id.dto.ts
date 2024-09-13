import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsNotEmpty, IsEnum, ValidateNested } from 'class-validator';
import { DeviceCategory, DeviceStatus } from '@devices/schemas/device.schema';
import { DeviceMetricDto } from '@devices/dto/register-device.dto';

export class GetDeviceByIdRequestDto {
  @Expose()
  @IsNotEmpty()
  deviceId: string;
}

export class GetDeviceByIdResponseDto {
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
   * User's device category
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

export class GetDeviceByIdResponse {
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
   * Response data
   */
  data: GetDeviceByIdResponseDto;
}
