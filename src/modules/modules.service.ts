import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ModuleRepository } from './repositories/module.repository';
import { ChaptersService } from '../chapters/chapters.service';
import { LoggerService } from '../common/services/logger.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Injectable()
export class ModulesService {
  constructor(
    private moduleRepository: ModuleRepository,
    private chaptersService: ChaptersService,
    private logger: LoggerService,
  ) {
    this.logger.setContext('ModulesService');
  }

  async findAll() {
    this.logger.log('Fetching all modules');
    return this.moduleRepository.findAll();
  }

  async findAllForAdmin(organizationId: string) {
    this.logger.log('Fetching all modules for admin');
    return this.moduleRepository.findAllForAdmin(organizationId);
  }

  async findById(id: string) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid module ID');
    this.logger.log(`Fetching module: ${id}`);
    const module = await this.moduleRepository.findById(id);
    if (!module) {
      throw new NotFoundException('Module not found');
    }
    return module;
  }

  async findByIdForAdmin(id: string, organizationId: string) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid module ID');
    this.logger.log(`Fetching module for admin: ${id}`);
    const module = await this.moduleRepository.findById(id, organizationId);
    if (!module) throw new NotFoundException('Module not found');
    return module;
  }

  async findByCourseId(courseId: string) {
    if (!courseId || !Types.ObjectId.isValid(courseId)) throw new BadRequestException('Invalid course ID');
    this.logger.log(`Fetching modules for course: ${courseId}`);
    return this.moduleRepository.findByCourseId(courseId);
  }

  async create(organizationId: string, dto: CreateModuleDto) {
    this.logger.log(`Creating module: ${dto.title}`);
    const data: Record<string, unknown> = {
      ...dto,
      organizationId: new Types.ObjectId(organizationId),
    };
    if (dto.courseId) {
      data.courseId = new Types.ObjectId(dto.courseId);
    }
    const mod = await this.moduleRepository.create(data);
    this.logger.log(`Module created: ${mod._id}`);
    return mod;
  }

  async update(id: string, organizationId: string, dto: UpdateModuleDto) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid module ID');
    this.logger.log(`Updating module: ${id}`);
    const existing = await this.moduleRepository.findById(id, organizationId);
    if (!existing) throw new NotFoundException('Module not found');
    const data: Record<string, unknown> = { ...dto };
    if (dto.courseId) {
      data.courseId = new Types.ObjectId(dto.courseId);
    }
    const updated = await this.moduleRepository.update(id, organizationId, data);
    this.logger.log(`Module updated: ${id}`);
    return updated;
  }

  async remove(id: string, organizationId: string) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid module ID');
    this.logger.log(`Deleting module: ${id}`);
    const existing = await this.moduleRepository.findById(id, organizationId);
    if (!existing) throw new NotFoundException('Module not found');

    await this.chaptersService.removeByModuleId(id, organizationId);

    const deleted = await this.moduleRepository.delete(id, organizationId);
    this.logger.log(`Module deleted: ${id}`);
    return deleted;
  }
}
