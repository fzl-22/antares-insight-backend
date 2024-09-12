import { Exclude, Expose, Transform } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';

export class GetCurrentUserRequestDto {
  @Expose()
  @IsNotEmpty()
  userId: string;
}

export class GetCurrentUserResponseDto {
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
