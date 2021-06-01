import { Test, TestingModule } from '@nestjs/testing';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { NotariseSurveyDto } from './dto/notarise-survey.dto';

describe('SurveyController', () => {
    let app: TestingModule;

    beforeAll(async () => {
    // create app to test
        app = await Test.createTestingModule({
            controllers: [SurveyController],
            providers: [SurveyService],
        }).compile();
    });

    describe('notarise', () => {

        it('should return "This action adds a new survey"', async () => {
            const appController = app.get<SurveyController>(SurveyController);
            const notoriseSurveyDto = new NotariseSurveyDto();

            notoriseSurveyDto.originatorAddress = "0x55a401d54532c7a56cd0c1497a190e767a756a18";
            notoriseSurveyDto.survey = { key: "survey data here" };
            notoriseSurveyDto.uprn = "S217007860011";
            notoriseSurveyDto.surveyType = "EWS";

            const res = await appController.notarise(notoriseSurveyDto);

            expect(res.dataOriginator.toLowerCase()).toBe(notoriseSurveyDto.originatorAddress);
            expect(res.documentHash).toBe("QmZhgtoSCRqD6cQQTQE1AEV7AaiA9gHT3FEuCwhhp6Ptnx");
            expect(res.documentType).toBe(notoriseSurveyDto.surveyType);
        });
    });

});
