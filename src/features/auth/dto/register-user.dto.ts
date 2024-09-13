import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';
import { UserResponseDto } from '@auth/dto/user.dto';

export class RegisterUserRequestDto {
  /**
   * User's first name
   * @example 'John'
   */
  @Expose()
  @IsNotEmpty()
  readonly firstName: string;

  /**
   * User's last name
   * @example 'Doe'
   */
  @Expose()
  @IsNotEmpty()
  readonly lastName: string;

  /**
   * User's email address
   * @example 'john.doe@example.com'
   */
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  /**
   * User's password
   * @example 'password123'
   */
  @Expose()
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  readonly password: string;
}

export class RegisterUserResponse {
  /**
   * Response status code
   * @example 201
   */
  readonly statusCode: number;

  /**
   * Response message
   * @example 'User registered successfully.'
   */
  readonly message: string;

  /**
   * Response data
   */
  readonly data: UserResponseDto;
}
