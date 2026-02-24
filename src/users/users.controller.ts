import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiOkResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiExtraModels,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileResponseDto } from './dto/user-profile-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';

@ApiTags('Users')
@ApiExtraModels(UserProfileResponseDto, UpdateUserDto, StandardErrorResponseDto)
@Controller('v1/users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('JWT-auth')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @ApiOperation({
    summary: 'Get my profile',
    description: 'Returns the authenticated user’s profile. Response: `{ success: true, data: UserProfileResponseDto }`.',
  })
  @ApiOkResponse({
    description: 'User profile. Response body: { success: true, data: UserProfileResponseDto }',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/UserProfileResponseDto' },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'User not found', type: StandardErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  async getProfile(@CurrentUser() user: CurrentUserPayload) {
    return this.usersService.getUserProfile(user.userId);
  }

  @Put('profile')
  @ApiOperation({
    summary: 'Update my profile',
    description:
      'Updates the authenticated user’s profile. Only provided fields are updated (firstName, lastName, email, profilePicture, bio). Phone/countryCode are not editable here. Response: `{ success: true, data: UserProfileResponseDto }`.',
  })
  @ApiOkResponse({
    description: 'Updated user profile. Response body: { success: true, data: UserProfileResponseDto }',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: { $ref: '#/components/schemas/UserProfileResponseDto' },
      },
    },
  })
  @ApiBadRequestResponse({ description: 'Validation error (e.g. invalid email)', type: StandardErrorResponseDto })
  @ApiNotFoundResponse({ description: 'User not found', type: StandardErrorResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT', type: StandardErrorResponseDto })
  async updateProfile(
    @CurrentUser() user: CurrentUserPayload,
    @Body() updateDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(user.userId, updateDto);
  }
}

