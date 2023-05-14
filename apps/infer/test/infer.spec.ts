import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { INestApplication } from '@nestjs/common';
import sarifJava from './sarif.java';
import { AppModule } from '../src/app.module';
import sarifC from './sarif.c';

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
    it('/POST analysis should return valid sarif for java', async () => {
      const toolCommand: ToolCommand = {
        code: 'Ly8gSGVsbG8uamF2YQpjbGFzcyBIZWxsbyB7CiAgaW50IHRlc3QoKSB7CiAgICBTdHJpbmcgcyA9IG51bGw7CiAgICByZXR1cm4gcy5sZW5ndGgoKTsKICB9Cn0=',
        encoded: true,
        languageExtension: 'java',
      };

      const result = await request(app.getHttpServer()).post('').send(toolCommand).expect(200);

      expect(result.body).toMatchObject(sarifJava);
    });

    it('/POST analysis should return valid sarif for c', async () => {
      const toolCommand: ToolCommand = {
        code: 'I2luY2x1ZGUgPHN0ZGlvLmg+CiNpbmNsdWRlIDxzdGRsaWIuaD4KCmludCBtYWluKCkgewogICAgaW50IGksIGo7CiAgICBpbnQgYXJyYXlbMTBdOwogICAgaW50ICpwdHIgPSBOVUxMOwoKICAgIC8vIEluaXRpYWxpemUgYXJyYXkgd2l0aCB2YWx1ZXMgMCB0byA5CiAgICBmb3IgKGkgPSAwOyBpIDw9IDEwOyBpKyspIHsKICAgICAgICBhcnJheVtpXSA9IGk7CiAgICB9CgogICAgLy8gQWNjZXNzIGFycmF5IG91dCBvZiBib3VuZHMKICAgIGogPSBhcnJheVsxMV07CgogICAgLy8gQXR0ZW1wdCB0byBkZXJlZmVyZW5jZSBhIG51bGwgcG9pbnRlcgogICAgKnB0ciA9IDU7CgogICAgLy8gTWVtb3J5IGxlYWsgLSBkeW5hbWljYWxseSBhbGxvY2F0ZWQgbWVtb3J5IGlzIG5vdCBmcmVlZAogICAgcHRyID0gKGludCopIG1hbGxvYyhzaXplb2YoaW50KSk7CiAgICAqcHRyID0gMTA7CgogICAgLy8gSW5maW5pdGUgbG9vcCAtIGNvbmRpdGlvbiBpcyBhbHdheXMgdHJ1ZQogICAgd2hpbGUgKDEpIHsKICAgICAgICBwcmludGYoIkhlbGxvIHdvcmxkIVxuIik7CiAgICB9CgogICAgcmV0dXJuIDA7Cn0=',
        encoded: true,
        languageExtension: 'c',
      };

      const result = await request(app.getHttpServer()).post('').send(toolCommand).expect(200);

      expect(result.body).toMatchObject(sarifC);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
