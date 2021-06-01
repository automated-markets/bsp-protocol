import { Module } from '@nestjs/common';
import { UiController } from './ui.controller';
import { UiService } from './ui.service';
import { SurveyService } from '../survey/survey.service';

@Module({
  controllers: [UiController],
  providers: [UiService, SurveyService],
})
export class UiModule {}