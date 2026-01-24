import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
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

  /**
   * Public: Get all active cohorts
   */
  async findAll() {
    this.logger.log('Fetching all active cohorts');
    return this.cohortRepository.findAll();
  }

  /**
   * Admin: Get all cohorts (including inactive)
   */
  async findAllForAdmin() {
    this.logger.log('Fetching all cohorts for admin');
    return this.cohortRepository.findAllForAdmin();
  }

  /**
   * Public: Get cohort by ID (only active)
   */
  async findById(id: string) {
    this.logger.log(`Fetching cohort: ${id}`);
    const cohort = await this.cohortRepository.findById(id);
    
    if (!cohort) {
      throw new NotFoundException('Cohort not found');
    }

    if (!cohort.isActive) {
      throw new NotFoundException('Cohort not found');
    }

    return cohort;
  }

  /**
   * Admin: Get cohort by ID (including inactive)
   */
  async findByIdForAdmin(id: string) {
    this.logger.log(`Fetching cohort for admin: ${id}`);
    const cohort = await this.cohortRepository.findById(id);
    
    if (!cohort) {
      throw new NotFoundException('Cohort not found');
    }

    return cohort;
  }

  /**
   * Admin: Create new cohort
   */
  async create(createCohortDto: CreateCohortDto) {
    this.logger.log(`Creating new cohort: ${createCohortDto.name}`);

    const cohortData = {
      ...createCohortDto,
      countryCode: createCohortDto.countryCode || 'IN',
      displayOrder: createCohortDto.displayOrder ?? 0,
      isVisibleOnHomePage: createCohortDto.isVisibleOnHomePage ?? false,
      isActive: true,
      currentParticipants: 0,
    };

    const cohort = await this.cohortRepository.create(cohortData);
    this.logger.log(`Cohort created successfully: ${cohort._id}`);

    return cohort;
  }

  /**
   * Admin: Update cohort
   */
  async update(id: string, updateCohortDto: UpdateCohortDto) {
    this.logger.log(`Updating cohort: ${id}`);

    const cohort = await this.cohortRepository.findById(id);
    if (!cohort) {
      throw new NotFoundException('Cohort not found');
    }

    const updatedCohort = await this.cohortRepository.update(id, updateCohortDto);
    this.logger.log(`Cohort updated successfully: ${id}`);

    return updatedCohort;
  }

  /**
   * Admin: Soft delete cohort (set isActive to false)
   */
  async remove(id: string) {
    this.logger.log(`Soft deleting cohort: ${id}`);

    const cohort = await this.cohortRepository.findById(id);
    if (!cohort) {
      throw new NotFoundException('Cohort not found');
    }

    if (!cohort.isActive) {
      throw new ConflictException('Cohort is already inactive');
    }

    const deletedCohort = await this.cohortRepository.softDelete(id);
    this.logger.log(`Cohort soft deleted successfully: ${id}`);

    return deletedCohort;
  }
}

