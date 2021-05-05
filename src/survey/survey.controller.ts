import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { NotoriseSurveyDto } from './dto/notorise-survey.dto';
import { SurveyService } from './survey.service';

@Controller('/survey')
export class SurveyController {
    
    constructor(private readonly surveyService: SurveyService) { }

    @Post('/notarise')
    async notarise(@Body() notoriseSurveyDto: NotoriseSurveyDto) {
        return await this.surveyService.notarise(notoriseSurveyDto);
    }
}