import { Expose, Transform, Type } from 'class-transformer';
import { IsInt, IsOptional, Min, ValidateNested } from 'class-validator';
import { DeviceNotificationLogDto } from './device-notification-log.dto';

export const DEFAULT_PAGE = 1;
export const DEFAULT_PER_PAGE = 10;

export class GetNotificationHistoryRequestDto {
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

export class GetNotificationHistoryResponseDto {
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
  @Type(() => DeviceNotificationLogDto)
  readonly devices: DeviceNotificationLogDto[];
}

export class GetNotificationHistoryResponse {
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
  readonly data: GetNotificationHistoryResponseDto;
}
