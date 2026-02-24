import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUserPayload } from '../common/decorators/current-user.decorator';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: CurrentUserPayload): Promise<{
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
    updateProfile(user: CurrentUserPayload, updateDto: UpdateUserDto): Promise<{
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
