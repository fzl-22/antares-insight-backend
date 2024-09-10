import { Body, Controller, Post } from '@nestjs/common';
import {
  RegisterUserRequestDto,
  RegisterUserResponseDto,
} from '../dto/register-user.dto';
import { AuthService } from '../services/auth.service';
import {
  LoginUserRequestDto,
  LoginUserResponseDto,
} from '../dto/login-user.dto';
import { IResponse } from 'src/common/interfaces/interfaces';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('/register')
  async registerUser(
    @Body() registerUserDto: RegisterUserRequestDto,
  ): Promise<{ message: string; data: RegisterUserResponseDto }> {
    const response = await this.authService.registerUser(registerUserDto);
    return {
      message: 'User registered successfully.',
      data: response,
    };
  }

  @Post('/login')
  async loginUser(
    @Body() loginUserDto: LoginUserRequestDto,
  ): Promise<IResponse<LoginUserResponseDto>> {
    const response = await this.authService.loginUser(loginUserDto);

    return {
      message: 'User logged in successfully.',
      data: response,
    };
  }
}
