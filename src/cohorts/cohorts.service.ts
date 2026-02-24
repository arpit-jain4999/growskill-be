import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CohortRepository } from './repositories/cohort.repository';
import { LoggerService } from '../common/services/logger.service';
import { CreateCohortDto } from './dto/create-cohort.dto';
import { UpdateCohortDto } from './dto/update-cohort.dto';

@Injectable()
export class CohortsService {
  constructor(
    private cohortRepository: CohortRepository,
    private logger: LoggerService,
  ) {
    this.logger.setContext('CohortsService');
  }

  async findAll(organizationId: string) {
    this.logger.log('Fetching all active cohorts');
    return this.cohortRepository.findAll(organizationId);
  }

  async findAllForAdmin(organizationId: string) {
    this.logger.log('Fetching all cohorts for admin');
    return this.cohortRepository.findAllForAdmin(organizationId);
  }

  async findById(id: string, organizationId: string) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid cohort ID');
    this.logger.log(`Fetching cohort: ${id}`);
    const cohort = await this.cohortRepository.findById(id, organizationId);
    if (!cohort) throw new NotFoundException('Cohort not found');
    if (!cohort.isActive) throw new NotFoundException('Cohort not found');
    return cohort;
  }

  async findByIdForAdmin(id: string, organizationId: string) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid cohort ID');
    this.logger.log(`Fetching cohort for admin: ${id}`);
    const cohort = await this.cohortRepository.findById(id, organizationId);
    if (!cohort) throw new NotFoundException('Cohort not found');
    return cohort;
  }

  async create(organizationId: string, createCohortDto: CreateCohortDto) {
    this.logger.log(`Creating new cohort: ${createCohortDto.name}`);
    const cohortData = {
      ...createCohortDto,
      organizationId: new Types.ObjectId(organizationId),
      countryCode: createCohortDto.countryCode || 'IN',
      displayOrder: createCohortDto.displayOrder ?? 0,
      isVisibleOnHomePage: createCohortDto.isVisibleOnHomePage ?? false,
      isActive: true,
    };
    const cohort = await this.cohortRepository.create(cohortData);
    this.logger.log(`Cohort created successfully: ${cohort._id}`);
    return cohort;
  }

  async update(
    id: string,
    organizationId: string,
    updateCohortDto: UpdateCohortDto,
  ) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid cohort ID');
    this.logger.log(`Updating cohort: ${id}`);
    const cohort = await this.cohortRepository.findById(id, organizationId);
    if (!cohort) throw new NotFoundException('Cohort not found');
    const updated = await this.cohortRepository.update(
      id,
      organizationId,
      updateCohortDto,
    );
    this.logger.log(`Cohort updated successfully: ${id}`);
    return updated;
  }

  async remove(id: string, organizationId: string) {
    if (!id || !Types.ObjectId.isValid(id)) throw new BadRequestException('Invalid cohort ID');
    this.logger.log(`Soft deleting cohort: ${id}`);
    const cohort = await this.cohortRepository.findById(id, organizationId);
    if (!cohort) throw new NotFoundException('Cohort not found');
    if (!cohort.isActive) throw new ConflictException('Cohort is already inactive');
    const deleted = await this.cohortRepository.softDelete(id, organizationId);
    this.logger.log(`Cohort soft deleted successfully: ${id}`);
    return deleted;
  }
}

