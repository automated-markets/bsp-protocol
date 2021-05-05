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
      .expect('Hello World!');
  });

});
