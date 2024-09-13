import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { DeviceResponseDto } from '@devices/dto/device.dto';

export class GetDeviceByIdRequestDto {
  @Expose()
  @IsNotEmpty()
  readonly deviceId: string;
}

export class GetDeviceByIdResponse {
  /**
   * Response status code
   * @example 200
   */
  readonly statusCode: number;

  /**
   * Response message
   * @example 'Device fetched successfully.'
   */
  readonly message: string;

  /**
   * Response data
   */
  readonly data: DeviceResponseDto;
}
