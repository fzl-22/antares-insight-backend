import { UserResponseDto } from '@auth/dto/user.dto';
import { Expose } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class GetCurrentUserRequestDto {
  @Expose()
  @IsNotEmpty()
  readonly userId: string;
}

export class GetCurrentUserResponse {
  /**
   * Response status code
   * @example 200
   */
  readonly statusCode: number;

  /**
   * Response message
   * @example 'User fetched successfully.'
   */
  readonly message: string;

  /**
   * Response data
   */
  readonly data: UserResponseDto;
}
