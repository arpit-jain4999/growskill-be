import { PreferencesService } from './preferences.service';
export declare class PreferencesController {
    private readonly preferencesService;
    constructor(preferencesService: PreferencesService);
    findAll(): Promise<import("./schemas/preference.schema").PreferenceDocument[]>;
    findOne(key: string): Promise<import("./schemas/preference.schema").PreferenceDocument>;
}
