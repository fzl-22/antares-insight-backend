import { ApiHideProperty } from '@nestjs/swagger';
import { Expose, Exclude, Transform } from 'class-transformer';

export class UserResponseDto {
  /**
   * User's document id
   * @example '66e02e93a4b00a1e1444af56'
   */
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  readonly id: string;

  /**
   * User's first name
   * @example 'John'
   */
  @Expose()
  readonly firstName: string;

  /**
   * User's last name
   * @example 'Doe'
   */
  @Expose()
  readonly lastName: string;

  /**
   * User's registered email address
   * @example 'john.doe@example.com'
   */
  @Expose()
  readonly email: string;

  /**
   * Date when the user was created
   * @example '2023-05-24T13:45:36.789Z'
   */
  @Expose()
  readonly createdAt: Date;

  /**
   * Date when the user was last updated
   * @example '2023-05-24T13:45:36.789Z'
   */
  @Expose()
  readonly updatedAt: Date;

  @ApiHideProperty()
  @Exclude()
  readonly password: string;
}
