import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const OLD_ENV = process.env;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    process.env = { ...OLD_ENV };

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/reapit', () => {
    process.env.CONNECT_CLIENT_ID = '3igto7aurjc6tklk81ucfhlh3n';
    process.env.CONNECT_CLIENT_SECRET =
      '18filv4c73tbro81u4sqqcp11l5qjhneopqujl1mnbr36t27nrhf';
    process.env.CONNECT_OAUTH_URL = 'https://connect.reapit.cloud';
    process.env.PLATFORM_API_URL = 'https://platform.reapit.cloud';
    process.env.REAPIT_CUSTOMER = 'SBOX';

    return request(app.getHttpServer())
      .post('/reapit')
      .send({ entityId: 'OXF732021', topicId: 'properties.created' })
      .timeout(4000)
      .expect(201);
  });

  it('/reapit (GET)', () => {
    return request(app.getHttpServer()).get('/reapit').expect(200);
  });
});
