import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

export const createValidationPipe = (): ValidationPipe => {
  const options: ValidationPipeOptions = {
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  };

  return new ValidationPipe(options);
};
