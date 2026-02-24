import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { Otp, OtpDocument } from './schemas/otp.schema';
import { LoggerService } from '../common/services/logger.service';
import {
  normalizeCountryCode,
  normalizePhoneNumber,
  countryCodeQueryVariants,
} from '../common/helpers/phone';

/** Brute-force protection: max failed OTP verify attempts per phone before lockout */
const MAX_VERIFY_ATTEMPTS = 5;
/** Lockout duration (ms) after max failed verify attempts */
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
/** Max OTP request (request-otp / resend-otp) per phone per window */
const MAX_REQUEST_PER_WINDOW = 5;
/** Request rate limit window (ms) */
const REQUEST_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

interface VerifyAttempts {
  count: number;
  lockedUntil?: number;
}

interface RequestRate {
  count: number;
  windowStart: number;
}

@Injectable()
export class OtpService {
  /** In-memory: failed verify attempts per phone. Use Redis/DB for multi-instance. */
  private verifyAttempts = new Map<string, VerifyAttempts>();
  /** In-memory: request-otp/resend-otp count per phone per window */
  private requestRate = new Map<string, RequestRate>();

  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private logger: LoggerService,
    private configService: ConfigService,
  ) {
    this.logger.setContext('OtpService');
  }

  private phoneKey(countryCode: string, phoneNumber: string): string {
    return `${countryCode}:${phoneNumber}`;
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
   * Enforce rate limit on OTP request (request-otp / resend-otp) per phone.
   */
  private checkRequestRateLimit(countryCode: string, phoneNumber: string): void {
    const key = this.phoneKey(countryCode, phoneNumber);
    const now = Date.now();
    let entry = this.requestRate.get(key);
    if (!entry) {
      this.requestRate.set(key, { count: 1, windowStart: now });
      return;
    }
    if (now - entry.windowStart >= REQUEST_WINDOW_MS) {
      entry = { count: 1, windowStart: now };
      this.requestRate.set(key, entry);
      return;
    }
    entry.count += 1;
    if (entry.count > MAX_REQUEST_PER_WINDOW) {
      const waitMin = Math.ceil((REQUEST_WINDOW_MS - (now - entry.windowStart)) / 60000);
      throw new HttpException(
        { message: `Too many OTP requests. Try again after ${waitMin} minute(s).` },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
  }

  /**
   * Create and store OTP for a phone number.
   * Normalizes country/phone so "91" and "+91" use the same OTP; always stores normalized.
   */
  async createOtp(countryCode: string, phoneNumber: string): Promise<string> {
    const normalizedCountry = normalizeCountryCode(countryCode);
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    this.checkRequestRateLimit(normalizedCountry, normalizedPhone);

    const countryVariants = countryCodeQueryVariants(normalizedCountry);
    const existingOtp = await this.otpModel.findOne({
      countryCode: { $in: countryVariants },
      phoneNumber: normalizedPhone,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (existingOtp) {
      this.logger.log(`Reusing existing OTP for ${normalizedCountry}${normalizedPhone}: ${existingOtp.code}`);
      return existingOtp.code;
    }

    await this.otpModel.deleteMany({
      countryCode: { $in: countryVariants },
      phoneNumber: normalizedPhone,
    });

    const code = this.generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpModel.create({
      countryCode: normalizedCountry,
      phoneNumber: normalizedPhone,
      code,
      expiresAt,
    });

    this.logger.log(`OTP generated for ${normalizedCountry}${normalizedPhone}: ${code}`);
    return code;
  }

  /** Fixed OTP for seeded platform-owner: always accepted for this phone (lifetime). */
  private static readonly SEED_PLATFORM_OWNER = {
    countryCode: '91',
    phoneNumber: '9910176391',
    code: '040999',
  };

  /**
   * Verify OTP for a phone number.
   * Brute-force protection: after MAX_VERIFY_ATTEMPTS failed attempts, lock out for LOCKOUT_DURATION_MS.
   * Fixed seed OTP 040999 for platform-owner phone is always accepted (lifetime).
   */
  async verifyOtp(countryCode: string, phoneNumber: string, code: string): Promise<boolean> {
    const normalizedCountry = normalizeCountryCode(countryCode);
    const normalizedPhone = normalizePhoneNumber(phoneNumber);
    if (
      normalizedCountry === OtpService.SEED_PLATFORM_OWNER.countryCode &&
      normalizedPhone === OtpService.SEED_PLATFORM_OWNER.phoneNumber &&
      code === OtpService.SEED_PLATFORM_OWNER.code
    ) {
      return true;
    }

    const key = this.phoneKey(normalizedCountry, normalizedPhone);
    const now = Date.now();

    let attempts = this.verifyAttempts.get(key);
    if (attempts?.lockedUntil && attempts.lockedUntil > now) {
      const waitMin = Math.ceil((attempts.lockedUntil - now) / 60000);
      throw new HttpException(
        { message: `Too many failed attempts. Try again after ${waitMin} minute(s).` },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }
    if (attempts && attempts.lockedUntil && attempts.lockedUntil <= now) {
      this.verifyAttempts.set(key, { count: 0 });
      attempts = { count: 0 };
    }

    const countryVariants = countryCodeQueryVariants(normalizedCountry);
    const otp = await this.otpModel.findOne({
      countryCode: { $in: countryVariants },
      phoneNumber: normalizedPhone,
      code,
      isUsed: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otp) {
      const count = (attempts?.count ?? 0) + 1;
      const lockedUntil = count >= MAX_VERIFY_ATTEMPTS ? now + LOCKOUT_DURATION_MS : undefined;
      this.verifyAttempts.set(key, { count, lockedUntil });
      if (lockedUntil) {
        this.logger.warn(`OTP verify locked for ${key} after ${count} failed attempts`);
      }
      return false;
    }

    this.verifyAttempts.delete(key);
    otp.isUsed = true;
    await otp.save();

    return true;
  }
}

