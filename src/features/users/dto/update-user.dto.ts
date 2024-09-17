import { UserConfigurationDto } from '@auth/dto/user.dto';
import { DeviceResponseDto } from '@devices/dto/device.dto';
import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateUserRequestDto {
  /**
   * User's first name
   * @example 'John'
   */
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  readonly firstName?: string;

  /**
   * User's last name
   * @example 'Doe
   */
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  readonly lastName?: string;

  /**
   * User's email address
   * @example 'john.doe@example.com'
   */
  @Expose()
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  readonly email?: string;

  @ApiHideProperty()
  @Exclude()
  password: string;

  @ApiHideProperty()
  @Exclude()
  configuration?: UserConfigurationDto;
}

export class UpdateUserResponse {
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
