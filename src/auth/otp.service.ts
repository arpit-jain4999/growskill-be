import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class OtpService {
  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private logger: LoggerService,
    private configService: ConfigService,
  ) {
    this.logger.setContext('OtpService');
  }

  /**
   * Generate a 6-digit OTP code
   * Returns "123456" in non-production environments for testing
   */
  generateOtp(): string {
    const nodeEnv = this.configService.get<string>('NODE_ENV') || 'development';
    
    if (nodeEnv !== 'production') {
      return '123456';
    }

    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * Create and store OTP for a phone number
   * Returns existing OTP if still valid (within 5 minutes), otherwise generates new one
   */
  async createOtp(countryCode: string, phoneNumber: string): Promise<string> {
    // Check if there's a valid (unused and not expired) OTP for this phone number
    const existingOtp = await this.otpModel.findOne({
      countryCode,
      phoneNumber,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    // If valid OTP exists, return it
    if (existingOtp) {
      this.logger.log(`Reusing existing OTP for ${countryCode}${phoneNumber}: ${existingOtp.code}`);
      return existingOtp.code;
    }

    // Delete any expired or used OTPs for this phone number
    await this.otpModel.deleteMany({ countryCode, phoneNumber });

    // Generate new OTP
    const code = this.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Store OTP
    await this.otpModel.create({
      countryCode,
      phoneNumber,
      code,
      expiresAt,
    });

    // In production, you would send this OTP via SMS service
    // For now, we'll log it (remove this in production)
    this.logger.log(`OTP generated for ${countryCode}${phoneNumber}: ${code}`);

    return code;
  }

  /**
   * Verify OTP for a phone number
   */
  async verifyOtp(countryCode: string, phoneNumber: string, code: string): Promise<boolean> {
    const otp = await this.otpModel.findOne({
      countryCode,
      phoneNumber,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otp) {
      return false;
    }

    // Mark OTP as used
    otp.isUsed = true;
    await otp.save();

    return true;
  }
}

