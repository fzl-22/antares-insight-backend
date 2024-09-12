import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterUserRequestDto {
  /**
   * User's first name
   * @example 'John'
   */
  @Expose()
  @IsNotEmpty()
  firstName: string;

  /**
   * User's last name
   * @example 'Doe'
   */
  @Expose()
  @IsNotEmpty()
  lastName: string;

  /**
   * User's email address
   * @example 'john.doe@example.com'
   */
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  /**
   * User's password
   * @example 'password123'
   */
  @Expose()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}

export class RegisterUserResponseDto {
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

export class RegisterUserResponse {
  /**
   * Response status code
   * @example 201
   */
  statusCode: number;

  /**
   * Response message
   * @example 'User registered successfully.'
   */
  message: string;

  /**
   * User details
   */
  data: RegisterUserResponseDto;
}
