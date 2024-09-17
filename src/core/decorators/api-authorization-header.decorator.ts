import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiAuthorizationHeader() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description: 'JWT token for authentication',
      required: true,
      schema: {
        type: 'string',
        example: 'my.jwt.token',
      },
    }),
  );
}
