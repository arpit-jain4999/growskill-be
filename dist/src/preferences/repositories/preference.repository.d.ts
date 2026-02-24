import { Model } from 'mongoose';
import { PreferenceDocument } from '../schemas/preference.schema';
export declare class PreferenceRepository {
    private preferenceModel;
    constructor(preferenceModel: Model<PreferenceDocument>);
    findAll(): Promise<PreferenceDocument[]>;
    findByKey(key: string): Promise<PreferenceDocument | null>;
}
