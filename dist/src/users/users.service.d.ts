import { UserRepository } from './repositories/user.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoggerService } from '../common/services/logger.service';
export declare class UsersService {
    private userRepository;
    private logger;
    constructor(userRepository: UserRepository, logger: LoggerService);
    getUserProfile(userId: string): Promise<{
        id: import("mongoose").Types.ObjectId;
        countryCode: string;
        phoneNumber: string;
        firstName: string;
        lastName: string;
        email: string;
        name: string;
        isVerified: boolean;
        profilePicture: string;
        bio: string;
    }>;
    updateUser(userId: string, updateDto: UpdateUserDto): Promise<{
        id: import("mongoose").Types.ObjectId;
        countryCode: string;
        phoneNumber: string;
        firstName: string;
        lastName: string;
        email: string;
        name: string;
        isVerified: boolean;
        profilePicture: string;
        bio: string;
    }>;
}
