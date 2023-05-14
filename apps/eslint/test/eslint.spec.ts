import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { INestApplication } from '@nestjs/common';
import sarif from './sarif';
import { AppModule } from '../src/app.module';

describe('Checkstyle', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  describe('Call', () => {
    it('/POST analysis should return valid sarif', async () => {
      const toolCommand: ToolCommand = {
        code: 'ZnVuY3Rpb24gU29tZUZ1bmN0aW9uKCkgewogIHZhciB4LCB5OwogIGNvbnNvbGUubG9nKHgpCn0KClNvbWVGdW5jdGlvbigpOw==',
        encoded: true,
        languageExtension: 'js',
      };

      const result = await request(app.getHttpServer()).post('').send(toolCommand).expect(200);

      expect(result.body).toMatchObject(sarif);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
