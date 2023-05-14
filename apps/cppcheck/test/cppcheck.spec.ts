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
        code: 'I2luY2x1ZGUgPHN0ZGlvLmg+CiNpbmNsdWRlIDxzdGRsaWIuaD4KCmludCBtYWluKCkgewogICAgaW50IGksIGo7CiAgICBpbnQgYXJyYXlbMTBdOwogICAgaW50ICpwdHIgPSBOVUxMOwoKICAgIC8vIEluaXRpYWxpemUgYXJyYXkgd2l0aCB2YWx1ZXMgMCB0byA5CiAgICBmb3IgKGkgPSAwOyBpIDw9IDEwOyBpKyspIHsKICAgICAgICBhcnJheVtpXSA9IGk7CiAgICB9CgogICAgLy8gQWNjZXNzIGFycmF5IG91dCBvZiBib3VuZHMKICAgIGogPSBhcnJheVsxMV07CgogICAgLy8gQXR0ZW1wdCB0byBkZXJlZmVyZW5jZSBhIG51bGwgcG9pbnRlcgogICAgKnB0ciA9IDU7CgogICAgLy8gTWVtb3J5IGxlYWsgLSBkeW5hbWljYWxseSBhbGxvY2F0ZWQgbWVtb3J5IGlzIG5vdCBmcmVlZAogICAgcHRyID0gKGludCopIG1hbGxvYyhzaXplb2YoaW50KSk7CiAgICAqcHRyID0gMTA7CgogICAgLy8gSW5maW5pdGUgbG9vcCAtIGNvbmRpdGlvbiBpcyBhbHdheXMgdHJ1ZQogICAgd2hpbGUgKDEpIHsKICAgICAgICBwcmludGYoIkhlbGxvIHdvcmxkIVxuIik7CiAgICB9CgogICAgcmV0dXJuIDA7Cn0=',
        encoded: true,
        languageExtension: 'c',
      };

      const result = await request(app.getHttpServer()).post('').send(toolCommand).expect(200);

      expect(result.body).toMatchObject(sarif);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
