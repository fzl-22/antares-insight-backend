import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class LoginUserRequestDto {
  /**
   * User's registered email address
   * @example 'john.doe@example.com'
   */
  @Expose({ name: 'email' })
  @IsNotEmpty()
  email: string;

  /**
   * User's password
   * @example 'password123'
   */
  @Expose({ name: 'password' })
  @IsNotEmpty()
  password: string;
}

export class LoggedInUserDto {
  /**
   * User's document id
   * @example '66e02e93a4b00a1e1444af56'
   */
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  /**
   * User's first name
   * @example 'John'
   */
  @Expose()
  firstName: string;

  /**
   * User's last name
   * @example 'Doe'
   */
  @Expose()
  lastName: string;

  /**
   * User's registered email address
   * @example 'john.doe@example.com'
   */
  @Expose()
  email: string;

  /**
   * Date when the user was created
   * @example '2023-05-24T13:45:36.789Z'
   */
  @Expose()
  createdAt: Date;

  /**
   * Date when the user was last updated
   * @example '2023-05-24T13:45:36.789Z'
   */
  @Expose()
  updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  password: string;
}

export class LoginUserResponseDto {
  /**
   * Access token
   * @example 'my.access.token'
   */
  @Expose()
  token: string;

  /**
   * User details
   */
  @Expose()
  @Type(() => LoggedInUserDto)
  user: LoggedInUserDto;
}

export class LoginUserResponse {
  /**
   * Response status code
   * @example 200
   */
  statusCode: number;

  /**
   * Response message
   * @example 'User logged in successfully.'
   */
  message: string;

  /**
   * Response data
   */
  data: LoginUserResponseDto;
}
