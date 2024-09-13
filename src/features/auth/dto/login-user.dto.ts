import { Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { UserResponseDto } from '@auth/dto/user.dto';

export class LoginUserRequestDto {
  /**
   * User's registered email address
   * @example 'john.doe@example.com'
   */
  @Expose({ name: 'email' })
  @IsNotEmpty()
  readonly email: string;

  /**
   * User's password
   * @example 'password123'
   */
  @Expose({ name: 'password' })
  @IsNotEmpty()
  readonly password: string;
}

export class LoginUserResponseDto {
  /**
   * Access token
   * @example 'my.access.token'
   */
  @Expose()
  readonly token: string;

  /**
   * User details
   */
  @Expose()
  @Type(() => UserResponseDto)
  readonly user: UserResponseDto;
}

export class LoginUserResponse {
  /**
   * Response status code
   * @example 200
   */
  readonly statusCode: number;

  /**
   * Response message
   * @example 'User logged in successfully.'
   */
  readonly message: string;

  /**
   * Response data
   */
  readonly data: LoginUserResponseDto;
}
