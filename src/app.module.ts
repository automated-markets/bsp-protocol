import { Module } from '@nestjs/common';
import { SurveyModule } from './survey/survey.module';
import { BuildingModule } from './building/building.module';
import { UiModule } from './ui/ui.module';

@Module({
    imports: [SurveyModule, BuildingModule, UiModule],
  })
export class AppModule {}