import { Test, TestingModule } from '@nestjs/testing';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';

describe('SurveyController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    // create app to test
    app = await Test.createTestingModule({
      controllers: [BuildingController],
      providers: [BuildingService],
    }).compile();

  });

  describe('notorise', () => {
    it('should return "This action adds a new survey"', async () => {
      const appController = app.get<BuildingController>(BuildingController);
      
      const res = await appController.all();

      expect(res).toBe('{\"factoryAddress\":\"0xcfeb869f69431e42cdb54a4f4f105c19c080a601\",\"buildings\":[\"0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696\",\"0xcB4e66eCA663FDB61818d52A152601cA6aFEf74F\"]}');
    });
  });
});
