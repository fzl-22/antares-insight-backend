import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class RegisterUserRequestDto {
  @Expose({ name: 'first_name' })
  @IsNotEmpty()
  firstName: string;

  @Expose({ name: 'last_name' })
  @IsNotEmpty()
  lastName: string;

  @Expose({ name: 'email' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @Expose({ name: 'password' })
  @IsNotEmpty()
  @MinLength(8)
  @MaxLength(16)
  password: string;
}

export class RegisterUserResponseDto {
  @Expose()
  firstName: string;

  @Expose()
  lastName: string;

  @Expose()
  email: string;

  @Exclude()
  password: string;
}
