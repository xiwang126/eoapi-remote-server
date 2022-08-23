import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../entities/project.entity';
import { ApiDataModule } from '../apiData/apiData.module';
import { ApiGroupModule } from '../apiGroup/apiGroup.module';
import { EnvironmentModule } from '../environment/environment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project]),
    ApiDataModule,
    ApiGroupModule,
    EnvironmentModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
