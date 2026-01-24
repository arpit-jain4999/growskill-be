import { Controller, Get, Param, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  async findAll(@CurrentUser() user: CurrentUserPayload) {
    return this.notificationsService.findAll(user.userId);
  }

  @Get('unread')
  async findUnread(@CurrentUser() user: CurrentUserPayload) {
    return this.notificationsService.findUnread(user.userId);
  }

  @Patch(':id/read')
  async markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserPayload,
  ) {
    return this.notificationsService.markAsRead(id, user.userId);
  }
}

