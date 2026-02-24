import { Controller, Post, Body, UseGuards, Get, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiBearerAuth, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { RequestOtpResponseDto, VerifyOtpResponseDto, ProfileResponseDto, ResendOtpResponseDto } from './dto/auth-response.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

const X_ORG_ID = 'x-org-id';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @ApiOperation({
    summary: 'Request OTP for phone number',
    description: 'Send OTP to user phone number. Works for both new and existing users. Optional header x-org-id: when present, user is scoped to that organisation.',
  })
  @ApiHeader({ name: X_ORG_ID, required: false, description: 'Organization ID (MongoDB ObjectId). When provided, user is created/found in this organisation.' })
  @ApiOkResponse({ description: 'OTP sent successfully', type: RequestOtpResponseDto })
  @ApiBadRequestResponse({ description: 'Bad request - Invalid phone number or country code', type: StandardErrorResponseDto })
  async requestOtp(
    @Body() requestOtpDto: RequestOtpDto,
    @Headers(X_ORG_ID) xOrgId?: string,
  ) {
    return await this.authService.requestOtp(requestOtpDto, xOrgId);
  }

  @Post('resend-otp')
  @ApiOperation({
    summary: 'Resend OTP',
    description: 'Resend OTP to user phone number. Optional header x-org-id: when present, user is scoped to that organisation.',
  })
  @ApiHeader({ name: X_ORG_ID, required: false, description: 'Organization ID. When provided, user is scoped to this organisation.' })
  @ApiOkResponse({ description: 'OTP resent successfully', type: ResendOtpResponseDto })
  @ApiBadRequestResponse({ description: 'Bad request - Invalid phone number or country code', type: StandardErrorResponseDto })
  async resendOtp(
    @Body() requestOtpDto: RequestOtpDto,
    @Headers(X_ORG_ID) xOrgId?: string,
  ) {
    return await this.authService.resendOtp(requestOtpDto, xOrgId);
  }

  @Post('verify-otp')
  @ApiOperation({
    summary: 'Verify OTP',
    description: 'Verify OTP and return JWT tokens. Creates new user if not exists. Optional header x-org-id: when present, user is created/found in that organisation.',
  })
  @ApiHeader({ name: X_ORG_ID, required: false, description: 'Organization ID. When provided, user is created/found in this organisation.' })
  @ApiOkResponse({ description: 'OTP verified successfully, returns JWT tokens', type: VerifyOtpResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid or expired OTP', type: StandardErrorResponseDto })
  @ApiBadRequestResponse({ description: 'Bad request - Invalid input or invalid organisation', type: StandardErrorResponseDto })
  async verifyOtp(
    @Body() verifyOtpDto: VerifyOtpDto,
    @Headers(X_ORG_ID) xOrgId?: string,
  ) {
    return await this.authService.verifyOtp(verifyOtpDto, xOrgId);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile', description: 'Get authenticated user profile information' })
  @ApiOkResponse({ 
    description: 'User profile retrieved successfully',
    type: ProfileResponseDto,
  })
  @ApiUnauthorizedResponse({ 
    description: 'Unauthorized - Invalid or missing JWT token',
    type: StandardErrorResponseDto,
  })
  async getProfile(@CurrentUser() user: CurrentUserPayload) {
    // Load fresh from DB so role and details are current (fixes SUPER_ADMIN showing as USER if DB was updated)
    const profile = await this.authService.getProfile(user.userId);
    return { user: profile };
  }
}

