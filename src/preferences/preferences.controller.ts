import { Controller, Get, Param } from '@nestjs/common';
import { PreferencesService } from './preferences.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('preferences')
@Public()
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Get()
  async findAll() {
    return this.preferencesService.findAll();
  }

  @Get(':key')
  async findOne(@Param('key') key: string) {
    return this.preferencesService.findByKey(key);
  }
}

