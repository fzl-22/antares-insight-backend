import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class LoginUserRequestDto {
  @Expose({ name: 'email' })
  @IsNotEmpty()
  email: string;

  @Expose({ name: 'password' })
  @IsNotEmpty()
  password: string;
}

export class LoggedInUserDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;
}

export class LoginUserResponseDto {
  @Expose()
  token: string;

  @Expose()
  @Type(() => LoggedInUserDto)
  user: LoggedInUserDto;
}
