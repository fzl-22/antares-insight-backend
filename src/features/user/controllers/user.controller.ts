import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import {
  GetCurrentUserRequestDto,
  GetCurrentUserResponse,
  GetCurrentUserResponseDto,
} from '../dto/get-current-user.dto';
import { AuthGuard } from 'src/core/guards/auth.guard';
import { IResponse } from 'src/core/interfaces/interfaces';
import { UserService } from '../services/user.service';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

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
  ): Promise<IResponse<GetCurrentUserResponseDto>> {
    const user = await this.userService.getCurrentUser(getCurrentUserDto);

    return {
      message: 'User fetched successfully.',
      data: user,
    };
  }
}
