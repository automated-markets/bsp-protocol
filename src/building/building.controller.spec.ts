import { Test, TestingModule } from '@nestjs/testing';
import { BuildingController } from './building.controller';
import { BuildingService } from './building.service';

describe('BuildingController', () => {
    let app: TestingModule;

    beforeAll(async () => {
        // create app to test
        app = await Test.createTestingModule({
        controllers: [BuildingController],
        providers: [BuildingService],
        }).compile();
    });

    describe('all', () => {
        it('should return all buildings and associated building data', async () => {
            const appController = app.get<BuildingController>(BuildingController);
            const res = await appController.all();
            expect(res.length).toBe(0);
        });
    });
});
