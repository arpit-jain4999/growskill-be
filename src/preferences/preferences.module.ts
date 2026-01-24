import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PreferencesController } from './preferences.controller';
import { PreferencesService } from './preferences.service';
import { PreferenceRepository } from './repositories/preference.repository';
import { Preference, PreferenceSchema } from './schemas/preference.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Preference.name, schema: PreferenceSchema }]),
  ],
  controllers: [PreferencesController],
  providers: [PreferencesService, PreferenceRepository],
  exports: [PreferencesService],
})
export class PreferencesModule {}

