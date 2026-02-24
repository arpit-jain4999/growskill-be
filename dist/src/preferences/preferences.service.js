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
exports.PreferencesService = void 0;
const common_1 = require("@nestjs/common");
const preference_repository_1 = require("./repositories/preference.repository");
const logger_service_1 = require("../common/services/logger.service");
let PreferencesService = class PreferencesService {
    constructor(preferenceRepository, logger) {
        this.preferenceRepository = preferenceRepository;
        this.logger = logger;
        this.logger.setContext('PreferencesService');
    }
    async findAll() {
        this.logger.log('Fetching all preferences');
        return this.preferenceRepository.findAll();
    }
    async findByKey(key) {
        this.logger.log(`Fetching preference: ${key}`);
        const preference = await this.preferenceRepository.findByKey(key);
        if (!preference) {
            throw new common_1.NotFoundException('Preference not found');
        }
        return preference;
    }
};
exports.PreferencesService = PreferencesService;
exports.PreferencesService = PreferencesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [preference_repository_1.PreferenceRepository,
        logger_service_1.LoggerService])
], PreferencesService);
//# sourceMappingURL=preferences.service.js.map