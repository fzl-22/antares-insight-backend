import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  GetCurrentUserRequestDto,
  GetCurrentUserResponseDto,
} from '../dto/get-current-user.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { IResponse } from 'src/core/interfaces/interfaces';
import { UserService } from '../services/user.service';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Get('/current')
  async getCurrentUser(
    @Request() getCurrentUserDto: GetCurrentUserRequestDto,
  ): Promise<IResponse<GetCurrentUserResponseDto>> {
    const user = await this.userService.getCurrentUser(getCurrentUserDto);

    return {
      message: 'User fetched successfully',
      data: user,
    };
  }
}
