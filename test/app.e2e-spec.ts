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
      .get('/building/all')
      .expect(200)
      .expect('[{"buildingAddr":"0x79183957Be84C0F4dA451E534d5bA5BA3FB9c696","buildingData":[{"documentHash":"0x49354f636c497568392b496b43615979506a6c425655796b6e2b47556739545472642b72447a49345630303d","documentType":"EWS","dataOriginator":"0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1"}],"uprn":"S217007860011\\u0000"}]');
  });

});
