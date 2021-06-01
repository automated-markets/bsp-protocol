import { Injectable, BadRequestException } from '@nestjs/common';
import EthereumUtil from '../ethereum/ethereumUtil'
import { NotariseSurveyDto } from './dto/notarise-survey.dto';
import { BuildingDataDto } from 'src/dto';
import StorageService  from './storage.service';

@Injectable()
export class SurveyService {

    async notarise(notoriseSurveyDto: NotariseSurveyDto): Promise<BuildingDataDto> {
        const { uprn, originatorAddress, surveyType } = notoriseSurveyDto;

        try {
            // save survey to IPFS
            const saveResponse = await StorageService.save(notoriseSurveyDto);
            const documentHash = saveResponse.IpfsHash;
            const timestamp = saveResponse.Timestamp;
            const res = await EthereumUtil.trackBuildingDataUsingKnownAccount(originatorAddress, uprn, documentHash, surveyType, timestamp)
            
            return res;
        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable notorise survey '});
        }
    }

    async notariseFile(file:any, uprn: string, surveyType: string, originatorAddress: string): Promise<BuildingDataDto> {
        try {
            // save survey to IPFS
            const saveResponse = await StorageService.saveFile(file);
            const documentHash = saveResponse.IpfsHash;
            const timestamp = saveResponse.Timestamp;
            const res = await EthereumUtil.trackBuildingData(originatorAddress, uprn, documentHash, surveyType, timestamp)
            
            return res;
        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable notorise survey '});
        }

    }
}