import { Injectable, BadRequestException } from '@nestjs/common';
import EthUtil from '../config/ethUtil'
import { NotoriseSurveyDto } from './dto/notorise-survey.dto';
import * as crypto from "crypto";

@Injectable()
export class SurveyService {

    async notarise(notoriseSurveyDto: NotoriseSurveyDto): Promise<string> {
        const { uprn, buildingId, survey, surveyType } = notoriseSurveyDto;
        const surveyString = JSON.stringify(survey);
        const docHash = crypto.createHash('sha256').update(surveyString).digest('base64');
        
        try {
            const instance = await EthUtil.getFactoryContract();
            const fromAddress = EthUtil.buildingIdToAddress(buildingId)
            const res = await instance.trackBuildingData(
                EthUtil.toHex(uprn),
                EthUtil.toHex(docHash),
                surveyType,
                { from: fromAddress}
            );

            const trackedBuildingDataAddress = await instance.buildingDataAddressByHash(EthUtil.toHex(docHash));

            return JSON.stringify({
                surveyAddress: trackedBuildingDataAddress,
                transaction: res
            });

        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable notorise survey: '});
        }
    }
}