import { Controller, Post, Body, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { NotariseSurveyDto } from './dto/notarise-survey.dto';
import { SurveyService } from './survey.service';
import * as fs  from 'fs';
import { extname } from 'path';

const _fileFilter = (req, file, callback) => {
    if (!file.originalname.match(/\.(pdf|docx|doc)$/)) {
        return callback(new Error('Only document files are allowed!'), false);
    }
    callback(null, true);
};
  
const _editFileName = (req, file, callback) => {
    const name = file.originalname.split('.')[0];
    const fileExtName = extname(file.originalname);
    const randomName = Array(4)
        .fill(null)
        .map(() => Math.round(Math.random() * 16).toString(16))
        .join('');
    callback(null, `${name}-${randomName}${fileExtName}`);
};
  
@Controller('/survey')
export class SurveyController {
    
    constructor(private readonly surveyService: SurveyService) { }

    @Post('/notarise')
    async notarise(@Body() notoriseSurveyDto: NotariseSurveyDto) {
        return await this.surveyService.notarise(notoriseSurveyDto);
    }
    
    @Post('/notarise/file')
    @UseInterceptors(
        FileInterceptor('file', {
                storage: diskStorage({
                destination: './files',
                filename: _editFileName,
            }),
           fileFilter: _fileFilter,
        }),
    )
    async notariseFile(@Param() params, @Body() body, @UploadedFile() file: Express.Multer.File) {
        console.log(file);
        console.log("UPRN:" +body.uprn);
        console.log("Survey type:" +body.surveyType);
        console.log("Originator:" +body.originatorAddress);
        const path = `${file.destination}/${file.filename}`;
        console.log("File path: "+path)
        console.log("  Exists?: " + fs.existsSync(path))
        const readableStream = fs.createReadStream(path);
        
        return await this.surveyService.notariseFile(readableStream, body.uprn, body.surveyType, body.originatorAddress);
    }
}