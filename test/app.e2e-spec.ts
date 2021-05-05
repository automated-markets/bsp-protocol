import * as request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';

describe('SurveyController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // it('/survey/notarise (POST)', () => {
  //   return request(app.getHttpServer())
  //     .post('/survey/notarise')
  //     .expect(200)
  //     .expect('Hello World!');
  // });

  it('/building/all (GET)', () => {
    return request(app.getHttpServer())
      .get('/building')
      .expect(200)
      .expect('[{"buildingAddr":"0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696","buildingData":[{"documentHash":"QmZhgtoSCRqD6cQQTQE1AEV7AaiA9gHT3FEuCwhhp6Ptnx","documentType":"EWS","dataOriginator":"0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1","uri":"https://gateway.pinata.cloud/ipfs/QmZhgtoSCRqD6cQQTQE1AEV7AaiA9gHT3FEuCwhhp6Ptnx"}],"uprn":"S217007860011"}]');
  });

});
