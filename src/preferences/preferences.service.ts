import { Injectable, NotFoundException } from '@nestjs/common';
import { PreferenceRepository } from './repositories/preference.repository';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class PreferencesService {
  constructor(
    private preferenceRepository: PreferenceRepository,
    private logger: LoggerService,
  ) {
    this.logger.setContext('PreferencesService');
  }

  async findAll() {
    this.logger.log('Fetching all preferences');
    return this.preferenceRepository.findAll();
  }

  async findByKey(key: string) {
    this.logger.log(`Fetching preference: ${key}`);
    const preference = await this.preferenceRepository.findByKey(key);
    
    if (!preference) {
      throw new NotFoundException('Preference not found');
    }

    return preference;
  }
}

