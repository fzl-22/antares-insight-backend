import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';

const getJwtConfig = (configService: ConfigService): JwtModuleOptions => {
  return {
    global: true,
    secret: configService.get<string>('JWT_SECRET_KEY'),
    signOptions: {
      expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
    },
  };
};

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: getJwtConfig,
    }),
  ],
})
export class TokenModule {}
