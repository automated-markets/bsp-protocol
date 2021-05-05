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

      expect(res.dataOriginator).toBe("0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1");
      expect(res.documentHash).toBe("0x49354f636c497568392b496b43615979506a6c425655796b6e2b47556739545472642b72447a49345630303d");
      expect(res.documentType).toBe(notoriseSurveyDto.surveyType);

    });
  });
});
