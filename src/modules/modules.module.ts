import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModulesController } from './modules.controller';
import { ModulesService } from './modules.service';
import { ModuleRepository } from './repositories/module.repository';
import { Module as CourseModule, ModuleSchema } from './schemas/module.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: CourseModule.name, schema: ModuleSchema }]),
  ],
  controllers: [ModulesController],
  providers: [ModulesService, ModuleRepository],
  exports: [ModulesService],
})
export class ModulesModule {}

