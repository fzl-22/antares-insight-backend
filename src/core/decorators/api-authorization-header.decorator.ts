import { applyDecorators } from '@nestjs/common';
import { ApiBearerAuth, ApiHeader } from '@nestjs/swagger';

export function ApiAuthorizationHeader() {
  return applyDecorators(
    ApiBearerAuth(),
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
