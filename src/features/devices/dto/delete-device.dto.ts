import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class DeleteDeviceRequestDto {
  /**
   * Deleted device's id
   * @example ''
   */
  @Expose()
  @IsNotEmpty()
  readonly deviceId: string;
}

export class DeleteDeviceResponse {
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
}
