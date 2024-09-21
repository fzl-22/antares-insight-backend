import { UserId } from '@core/decorators/user-id.decorator';
import { IResponse } from '@core/interfaces/interfaces';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  GetNotificationHistoryRequestDto,
  GetNotificationHistoryResponseDto,
} from '../dto/get-notification-history.dto';
import { NotificationsService } from '../services/notifications.service';
import { AuthGuard } from '@auth/guards/auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @UseGuards(AuthGuard)
  @Get('/history')
  async getNotificationHistory(
    @UserId() userId: string,
    @Query() getNotificationHistoryDto: GetNotificationHistoryRequestDto,
  ): Promise<IResponse<GetNotificationHistoryResponseDto>> {
    const response = await this.notificationsService.getDeviceNotification(
      userId,
      getNotificationHistoryDto,
    );

    return {
      message: 'Notification history fetched successfully.',
      data: response,
    };
  }
}
