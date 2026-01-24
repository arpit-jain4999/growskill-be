import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Preference, PreferenceDocument } from '../schemas/preference.schema';

@Injectable()
export class PreferenceRepository {
  constructor(
    @InjectModel(Preference.name) private preferenceModel: Model<PreferenceDocument>,
  ) {}

  async findAll(): Promise<PreferenceDocument[]> {
    return this.preferenceModel.find({ isActive: true });
  }

  async findByKey(key: string): Promise<PreferenceDocument | null> {
    return this.preferenceModel.findOne({ key, isActive: true });
  }
}

