import { Exclude, Expose, Transform, Type } from 'class-transformer';
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
  @Transform(({ obj }) => obj._id.toString())
  id: string;

  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

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
