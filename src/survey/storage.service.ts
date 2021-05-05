import { BadRequestException } from '@nestjs/common';
import { NotoriseSurveyDto } from './dto/notorise-survey.dto';
import pinJSONToIPFS from '../ipfs/pinata.service';

class StorageService {

    async save(notoriseSurveyDto: NotoriseSurveyDto): Promise<any> {
        const { survey } = notoriseSurveyDto;
        
        try {
            const result = await pinJSONToIPFS(survey, {});
            
            /************************************
            Shape of result data:

                {
                    IpfsHash: This is the IPFS multi-hash provided back for your content,
                    PinSize: This is how large (in bytes) the content you just pinned is,
                    Timestamp: This is the timestamp for your content pinning (represented in ISO 8601 format)
                }
            
            ***********************************/
            return result;
        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable to save survey to IPFS'});
        }
    }
}

export default new StorageService();