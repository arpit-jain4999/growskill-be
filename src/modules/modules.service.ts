import { Injectable, NotFoundException } from '@nestjs/common';
import { ModuleRepository } from './repositories/module.repository';
import { LoggerService } from '../common/services/logger.service';

@Injectable()
export class ModulesService {
  constructor(
    private moduleRepository: ModuleRepository,
    private logger: LoggerService,
  ) {
    this.logger.setContext('ModulesService');
  }

  async findAll() {
    this.logger.log('Fetching all modules');
    return this.moduleRepository.findAll();
  }

  async findById(id: string) {
    this.logger.log(`Fetching module: ${id}`);
    const module = await this.moduleRepository.findById(id);
    
    if (!module) {
      throw new NotFoundException('Module not found');
    }

    return module;
  }

  async findByCourseId(courseId: string) {
    this.logger.log(`Fetching modules for course: ${courseId}`);
    return this.moduleRepository.findByCourseId(courseId);
  }
}

