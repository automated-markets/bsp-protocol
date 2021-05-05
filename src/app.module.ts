import { Module } from '@nestjs/common';
import { SurveyModule } from './survey/survey.module';
import { BuildingModule } from './building/building.module';

@Module({
    imports: [SurveyModule, BuildingModule],
  })
export class AppModule {}