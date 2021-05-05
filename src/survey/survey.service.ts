import { Injectable, BadRequestException } from '@nestjs/common';
import EthUtil from '../config/ethUtil'
import { NotoriseSurveyDto } from './dto/notorise-survey.dto';
import * as crypto from "crypto";
import { BuildingDataDto } from 'src/dto';

@Injectable()
export class SurveyService {

    async notarise(notoriseSurveyDto: NotoriseSurveyDto): Promise<BuildingDataDto> {
        const { uprn, buildingId, survey, surveyType } = notoriseSurveyDto;
        const surveyString = JSON.stringify(survey);
        const docHash = crypto.createHash('sha256').update(surveyString).digest('base64');
        
        try {
            const res = await EthUtil.trackBuildingData(buildingId, uprn, docHash, surveyType)
            
            return res;
        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable notorise survey '});
        }
    }
}