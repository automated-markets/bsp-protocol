import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { NotoriseSurveyDto } from './dto/notorise-survey.dto';


describe('SurveyController', () => {
    let app: TestingModule;

    beforeAll(async () => {
    // create app to test
        app = await Test.createTestingModule({
            controllers: [SurveyController],
            providers: [SurveyService],
        }).compile();
    });

    describe('notorise', () => {

        it('should return "This action adds a new survey"', async () => {
            const appController = app.get<SurveyController>(SurveyController);
            const notoriseSurveyDto = new NotoriseSurveyDto();

            notoriseSurveyDto.buildingId = "90F8bf6A479f320";
            notoriseSurveyDto.survey = { key: "survey data here" };
            notoriseSurveyDto.uprn = "S217007860011";
            notoriseSurveyDto.surveyType = "EWS";

            const res = await appController.notarise(notoriseSurveyDto);

            expect(res.dataOriginator).toBe("0xde9cAd5fe929B2Bc702494E6f7219B520ae1350E");
            expect(res.documentHash).toBe("QmZhgtoSCRqD6cQQTQE1AEV7AaiA9gHT3FEuCwhhp6Ptnx");
            expect(res.documentType).toBe(notoriseSurveyDto.surveyType);
        });
    });

    describe('save', () => {

    })
});
