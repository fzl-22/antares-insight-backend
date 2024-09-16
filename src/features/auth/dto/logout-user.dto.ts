export class LogoutUserResponse {
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
  readonly data: boolean;
}
