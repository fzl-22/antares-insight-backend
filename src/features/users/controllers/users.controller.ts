import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  GetCurrentUserRequestDto,
  GetCurrentUserResponse,
} from '@users/dto/get-current-user.dto';
import { AuthGuard } from '@core/guards/auth.guard';
import { IResponse } from '@core/interfaces/interfaces';
import { UsersService } from '@users/services/users.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserResponseDto } from '@auth/dto/user.dto';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiHeader({
    name: 'Authorization',
    description: 'JWT token for authentication',
    required: true,
    schema: {
      type: 'string',
      example: 'my.jwt.token',
    },
  })
  @ApiOkResponse({
    description: 'User fetched successfully.',
    type: GetCurrentUserResponse,
  })
  @UseGuards(AuthGuard)
  @Get('/current')
  async getCurrentUser(
    @Request() getCurrentUserDto: GetCurrentUserRequestDto,
  ): Promise<IResponse<UserResponseDto>> {
    const user = await this.usersService.getCurrentUser(getCurrentUserDto);

    return {
      message: 'User fetched successfully.',
      data: user,
    };
  }
}
