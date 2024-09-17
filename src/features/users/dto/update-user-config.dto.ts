import { UserResponseDto } from '@auth/dto/user.dto';
import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class UpdateUserConfigRequestDto {
  /**
   * User configuration for enable/disable push notification
   * @example true
   */
  @Expose()
  @IsOptional()
  @IsBoolean()
  readonly enablePushNotification: boolean;

  /**
   * User configuration for enable/disable email notification
   * @example true
   */
  @Expose()
  @IsOptional()
  @IsBoolean()
  readonly enableMailNotification: boolean;
}

export class UpdateUserConfigResponse {
  /**
   * Response status code
   * @example 200
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
  readonly data: UserResponseDto;
}
