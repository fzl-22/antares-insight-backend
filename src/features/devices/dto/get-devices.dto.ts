import { Expose, Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { DEFAULT_PAGE, DEFAULT_PER_PAGE } from '@core/constants/constants';
import { DeviceResponseDto } from '@devices/dto/device.dto';

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

export class GetDevicesResponseDto {
  /**
   * Current page number
   * @example 1
   */
  @Expose()
  readonly page: number;

  /**
   * Number of devices per page
   * @example 10
   */
  @Expose()
  readonly perPage: number;

  /**
   * Total pages
   * @example 12
   */
  @Expose()
  readonly totalPages: number;

  @Expose()
  @ValidateNested({ each: true })
  @Type(() => DeviceResponseDto)
  readonly devices: DeviceResponseDto[];
}

export class GetDevicesResponse {
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
  readonly data: GetDevicesResponseDto;
}
