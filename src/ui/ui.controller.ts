import { UiService } from './ui.service';
import { SurveyService } from '../survey/survey.service';
import { Response } from 'express';
import { Controller, Res, Get, Post, Body, UploadedFile, UseInterceptors, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
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

@Controller('/ui')
export class UiController {
    
    constructor(
        private readonly uiService: UiService, 
        private readonly surveyService: SurveyService) { }

    @Get('/start')
    start(@Res() res: Response) {
        res.render('start.njk');
    }

    @Get('/search')
    search(@Res() res: Response) {
        res.render('search.njk');
    }

    @Post('/building')
    building(@Body() body, @Res() res: Response) {
        res.redirect(`/ui/building/${body.uprn}`);
    }

    @Get('/building/:uprn')
    async findOneBuilding(@Param() params, @Res() res: Response) {
        const uprn = params.uprn;
        console.log(`Finding UPRN: ${uprn}`);
        const buildingData = await this.uiService.findBuildingByUprn(uprn);
        console.log(`Found data: ${buildingData}`)
        console.log(buildingData)

        res.render('building.njk', buildingData );
    }

    @Get('/notarise/:uprn')
    notarise(@Param() params, @Res() res: Response) {
        const uprn = params.uprn;
        res.render('notarise.njk', { uprn });
    }

    @Get('/notarise-success/:uprn')
    notariseSuccess(@Param() params, @Res() res: Response) {
        const uprn = params.uprn;
        res.render('notarise-success.njk', { 
            uprn, 
            surveyType: 'EWS', 
            fingerprint: 'QmbbrMP66asWpskigro27SkcaHu2WTNF6fijFZXbV6mact' });
    }

    @Post('/notarise')
    @UseInterceptors(
        FileInterceptor('file', {
                storage: diskStorage({
                destination: './files',
                filename: _editFileName,
            }),
           fileFilter: _fileFilter,
        }),
    )
    async notariseFile(@Param() params, @Body() body, @UploadedFile() file: Express.Multer.File, @Res() res: Response) {
        console.log(file);
        const path = `${file.destination}/${file.filename}`;
        const uprn = body.uprn;
        const surveyType = body.surveyType;
        const originatorAddress = body.originatorAddress;
        const readableStream = fs.createReadStream(path);
        
        const buildingData = await this.surveyService.notariseFile(readableStream, uprn, surveyType, originatorAddress);
        console.log(buildingData)
        res.render('notarise-success.njk', { 
            uprn, 
            surveyType, 
            fingerprint: buildingData.documentHash,
            buildingData: buildingData });
    }

}