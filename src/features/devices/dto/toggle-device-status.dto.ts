import { DeviceResponseDto } from '@devices/dto/device.dto';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class ToggleDeviceStatusRequestBodyDto {
  /**
   * Message for activation/deactivation of the device
   * @example 'Deactivated because of X reason'
   */
  @Expose()
  @IsNotEmpty()
  readonly message: string;
}

export class ToggleDeviceStatusRequestParamDto {
  /**
   * Toggled device id
   */
  @Expose()
  @IsNotEmpty()
  readonly deviceId: string;
}

export class ToggleDeviceStatusResponse {
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
