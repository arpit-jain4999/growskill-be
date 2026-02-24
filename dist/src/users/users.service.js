"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const user_repository_1 = require("./repositories/user.repository");
const logger_service_1 = require("../common/services/logger.service");
let UsersService = class UsersService {
    constructor(userRepository, logger) {
        this.userRepository = userRepository;
        this.logger = logger;
        this.logger.setContext('UsersService');
    }
    async getUserProfile(userId) {
        this.logger.log(`Fetching profile for user: ${userId}`);
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
    async updateUser(userId, updateDto) {
        this.logger.log(`Updating user: ${userId}`);
        const user = await this.userRepository.update(userId, updateDto);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [user_repository_1.UserRepository,
        logger_service_1.LoggerService])
], UsersService);
//# sourceMappingURL=users.service.js.map