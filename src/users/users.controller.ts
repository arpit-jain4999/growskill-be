import { Controller, Get, Put, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { UseGuards } from '@nestjs/common';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.getUserProfile(user.userId);
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(user.userId, updateDto);
  }
}

