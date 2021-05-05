import { Injectable, BadRequestException } from '@nestjs/common';
import EthUtil from '../ethereum/ethUtil'
import { NotoriseSurveyDto } from './dto/notorise-survey.dto';
import { BuildingDataDto } from 'src/dto';
import StorageService  from './storage.service';

@Injectable()
export class SurveyService {

    async notarise(notoriseSurveyDto: NotoriseSurveyDto): Promise<BuildingDataDto> {
        const { uprn, buildingId, surveyType } = notoriseSurveyDto;

        try {
            // save survey to IPFS
            const saveRes = await StorageService.save(notoriseSurveyDto);            
            const res = await EthUtil.trackBuildingData(buildingId, uprn, saveRes.IpfsHash, surveyType)
            
            return res;
        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable notorise survey '});
        }
    }
}