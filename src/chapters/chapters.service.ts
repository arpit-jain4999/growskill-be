import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { ChapterRepository } from './repositories/chapter.repository';
import { LoggerService } from '../common/services/logger.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { UpdateChapterDto } from './dto/update-chapter.dto';

@Injectable()
export class ChaptersService {
  constructor(
    private chapterRepository: ChapterRepository,
    private logger: LoggerService,
  ) {
    this.logger.setContext('ChaptersService');
  }

  async findAll() {
    this.logger.log('Fetching all chapters');
    return this.chapterRepository.findAll();
  }

  async findAllForAdmin(organizationId: string) {
    this.logger.log('Fetching all chapters for admin');
    return this.chapterRepository.findAllForAdmin(organizationId);
  }

  async findById(id: string) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid chapter ID');
    this.logger.log(`Fetching chapter: ${id}`);
    const chapter = await this.chapterRepository.findById(id);
    if (!chapter) throw new NotFoundException('Chapter not found');
    return chapter;
  }

  async findByIdForAdmin(id: string, organizationId: string) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid chapter ID');
    this.logger.log(`Fetching chapter for admin: ${id}`);
    const chapter = await this.chapterRepository.findById(id, organizationId);
    if (!chapter) throw new NotFoundException('Chapter not found');
    return chapter;
  }

  async findByModuleId(moduleId: string) {
    if (!moduleId || !Types.ObjectId.isValid(moduleId)) throw new BadRequestException('Invalid module ID');
    this.logger.log(`Fetching chapters for module: ${moduleId}`);
    return this.chapterRepository.findByModuleId(moduleId);
  }

  async findByModuleIdForAdmin(moduleId: string, organizationId: string) {
    if (!moduleId || !Types.ObjectId.isValid(moduleId)) throw new BadRequestException('Invalid module ID');
    this.logger.log(`Fetching chapters for module (admin): ${moduleId}`);
    return this.chapterRepository.findByModuleIdForAdmin(moduleId, organizationId);
  }

  async create(organizationId: string, dto: CreateChapterDto) {
    if (!dto.moduleId || !Types.ObjectId.isValid(dto.moduleId)) {
      throw new BadRequestException('Invalid module ID');
    }
    this.logger.log(`Creating chapter: ${dto.title}`);
    const data: Record<string, unknown> = {
      ...dto,
      organizationId: new Types.ObjectId(organizationId),
      moduleId: new Types.ObjectId(dto.moduleId),
    };
    const chapter = await this.chapterRepository.create(data);
    this.logger.log(`Chapter created: ${chapter._id}`);
    return chapter;
  }

  async update(id: string, organizationId: string, dto: UpdateChapterDto) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid chapter ID');
    this.logger.log(`Updating chapter: ${id}`);
    const existing = await this.chapterRepository.findById(id, organizationId);
    if (!existing) throw new NotFoundException('Chapter not found');
    const data: Record<string, unknown> = { ...dto };
    if (dto.moduleId) {
      data.moduleId = new Types.ObjectId(dto.moduleId);
    }
    const updated = await this.chapterRepository.update(id, organizationId, data);
    this.logger.log(`Chapter updated: ${id}`);
    return updated;
  }

  async remove(id: string, organizationId: string) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid chapter ID');
    this.logger.log(`Deleting chapter: ${id}`);
    const existing = await this.chapterRepository.findById(id, organizationId);
    if (!existing) throw new NotFoundException('Chapter not found');
    const deleted = await this.chapterRepository.delete(id, organizationId);
    this.logger.log(`Chapter deleted: ${id}`);
    return deleted;
  }

  async removeByModuleId(moduleId: string, organizationId: string) {
    if (!moduleId || !Types.ObjectId.isValid(moduleId)) throw new BadRequestException('Invalid module ID');
    this.logger.log(`Deleting all chapters for module: ${moduleId}`);
    const count = await this.chapterRepository.deleteByModuleId(moduleId, organizationId);
    this.logger.log(`Deleted ${count} chapters for module: ${moduleId}`);
    return count;
  }
}
