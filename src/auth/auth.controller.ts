import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiUnauthorizedResponse, ApiBadRequestResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RequestOtpDto, VerifyOtpDto } from './dto/auth.dto';
import { RequestOtpResponseDto, VerifyOtpResponseDto, ProfileResponseDto, ResendOtpResponseDto } from './dto/auth-response.dto';
import { StandardErrorResponseDto } from '../common/dto/error-response.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser, CurrentUserPayload } from '../common/decorators/current-user.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('request-otp')
  @ApiOperation({ summary: 'Request OTP for phone number', description: 'Send OTP to user phone number. Works for both new and existing users.' })
  @ApiOkResponse({ 
    description: 'OTP sent successfully',
    type: RequestOtpResponseDto,
  })
  @ApiBadRequestResponse({ 
    description: 'Bad request - Invalid phone number or country code',
    type: StandardErrorResponseDto,
  })
  async requestOtp(@Body() requestOtpDto: RequestOtpDto) {
    return await this.authService.requestOtp(requestOtpDto);
  }

  @Post('resend-otp')
  @ApiOperation({ summary: 'Resend OTP', description: 'Resend OTP to user phone number. Returns same OTP if still valid (within 5 minutes).' })
  @ApiOkResponse({ 
    description: 'OTP resent successfully',
    type: ResendOtpResponseDto,
  })
  @ApiBadRequestResponse({ 
    description: 'Bad request - Invalid phone number or country code',
    type: StandardErrorResponseDto,
  })
  async resendOtp(@Body() requestOtpDto: RequestOtpDto) {
    return await this.authService.resendOtp(requestOtpDto);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'Verify OTP', description: 'Verify OTP and return JWT tokens. Creates new user if not exists.' })
  @ApiOkResponse({ 
    description: 'OTP verified successfully, returns JWT tokens',
    type: VerifyOtpResponseDto,
  })
  @ApiUnauthorizedResponse({ 
    description: 'Invalid or expired OTP',
    type: StandardErrorResponseDto,
  })
  @ApiBadRequestResponse({ 
    description: 'Bad request - Invalid input',
    type: StandardErrorResponseDto,
  })
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    return await this.authService.verifyOtp(verifyOtpDto);
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
  getProfile(@CurrentUser() user: CurrentUserPayload) {
    // Response interceptor will automatically wrap in {success: true, data: {...}}
    return { user };
  }
}

