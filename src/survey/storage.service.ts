import { BadRequestException } from '@nestjs/common';
import { NotariseSurveyDto } from './dto/notarise-survey.dto';
import ipfs from '../ipfs/pinata.service';

class StorageService {

    async save(notoriseSurveyDto: NotariseSurveyDto): Promise<any> {
        const { survey } = notoriseSurveyDto;
        
        try {
            const result = await ipfs.pinJSONToIPFS(survey, {});
            
            /************************************
            Shape of result data:

                {
                    IpfsHash: This is the IPFS multi-hash provided back for your content,
                    PinSize: This is how large (in bytes) the content you just pinned is,
                    Timestamp: This is the timestamp for your content pinning (represented in ISO 8601 format)
                }
            
            ***********************************/
           console.log(result);
            return result;
        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable to save survey to IPFS'});
        }
    }

    async saveFile(file: any): Promise<any> {        
        try {
            const result = await ipfs.pinFileToIPFS(file, {});
            
            /************************************
            Shape of result data:

                {
                    IpfsHash: This is the IPFS multi-hash provided back for your content,
                    PinSize: This is how large (in bytes) the content you just pinned is,
                    Timestamp: This is the timestamp for your content pinning (represented in ISO 8601 format)
                }
            
            ***********************************/
           console.log(result);
            return result;
        } catch (error) {
            console.log(error)
            throw new BadRequestException({ description: 'Unable to save survey to IPFS'});
        }
    }

}

export default new StorageService();