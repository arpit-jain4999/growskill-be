import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class UsersService {
  constructor(
    private userRepository: UserRepository,
    private logger: LoggerService,
  ) {
    this.logger.setContext('UsersService');
  }

  async getUserProfile(userId: string) {
    this.logger.log(`Fetching profile for user: ${userId}`);
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user._id,
      countryCode: user.countryCode,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
      profilePicture: user.profilePicture,
      bio: user.bio,
    };
  }

  async updateUser(userId: string, updateDto: UpdateUserDto) {
    this.logger.log(`Updating user: ${userId}`);
    const user = await this.userRepository.update(userId, updateDto);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user._id,
      countryCode: user.countryCode,
      phoneNumber: user.phoneNumber,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      name: user.name,
      isVerified: user.isVerified,
      profilePicture: user.profilePicture,
      bio: user.bio,
    };
  }
}

