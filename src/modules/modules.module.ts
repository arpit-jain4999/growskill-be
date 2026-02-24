import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesController } from './modules.controller';
import { AdminModulesController } from './admin-modules.controller';
import { ModulesService } from './modules.service';
import { ModuleRepository } from './repositories/module.repository';
import { Module as ContentModule, ModuleSchema } from './schemas/module.schema';
import { OrganizationsModule } from '../organizations/organizations.module';
import { ChaptersModule } from '../chapters/chapters.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ContentModule.name, schema: ModuleSchema }]),
    OrganizationsModule,
    ChaptersModule,
  ],
  controllers: [ModulesController, AdminModulesController],
  providers: [ModulesService, ModuleRepository],
  exports: [ModulesService],
})
export class ModulesModule {}
