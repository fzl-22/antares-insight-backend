import { UserId } from '@core/decorators/user-id.decorator';
import { IResponse } from '@core/interfaces/interfaces';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  GetNotificationHistoryRequestDto,
  GetNotificationHistoryResponse,
  GetNotificationHistoryResponseDto,
} from '@notifications/dto/get-notification-history.dto';
import { NotificationsService } from '@notifications/services/notifications.service';
import { AuthGuard } from '@auth/guards/auth.guard';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Notifications')
@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @ApiOkResponse({
    description: 'Notification history fetched successfully.',
    type: GetNotificationHistoryResponse,
  })
  @UseGuards(AuthGuard)
  @Get('/history')
  async getNotificationHistory(
    @UserId() userId: string,
    @Query() getNotificationHistoryDto: GetNotificationHistoryRequestDto,
  ): Promise<IResponse<GetNotificationHistoryResponseDto>> {
    const response =
      await this.notificationsService.getDeviceNotificationHistory(
        userId,
        getNotificationHistoryDto,
      );

    return {
      message: 'Notification history fetched successfully.',
      data: response,
    };
  }
}
