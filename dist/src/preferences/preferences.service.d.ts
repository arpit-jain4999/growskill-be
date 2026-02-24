import { PreferenceRepository } from './repositories/preference.repository';
import { LoggerService } from '../common/services/logger.service';
export declare class PreferencesService {
    private preferenceRepository;
    private logger;
    constructor(preferenceRepository: PreferenceRepository, logger: LoggerService);
    findAll(): Promise<import("./schemas/preference.schema").PreferenceDocument[]>;
    findByKey(key: string): Promise<import("./schemas/preference.schema").PreferenceDocument>;
}
