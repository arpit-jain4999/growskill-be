import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'Request OTP for phone number', description: 'Send OTP to user phone number. Works for both new and existing users.' })
  @ApiResponse({ status: 200, description: 'OTP sent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return await this.authService.requestOtp(requestOtpDto);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP', description: 'Resend OTP to user phone number. Returns same OTP if still valid (within 5 minutes).' })
  @ApiResponse({ status: 200, description: 'OTP resent successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  async resendOtp(@Body() requestOtpDto: RequestOtpDto) {
    return await this.authService.resendOtp(requestOtpDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP', description: 'Verify OTP and return JWT tokens. Creates new user if not exists.' })
  @ApiResponse({ status: 200, description: 'OTP verified successfully, returns JWT tokens' })
  @ApiResponse({ status: 401, description: 'Invalid or expired OTP' })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyOtp(verifyOtpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile', description: 'Get authenticated user profile information' })
  @ApiResponse({ status: 200, description: 'User profile retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@CurrentUser() user: CurrentUserPayload) {
    // Response interceptor will automatically wrap in {success: true, data: {...}}
    return { user };
  }
}

