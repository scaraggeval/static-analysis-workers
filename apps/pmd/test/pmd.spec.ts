import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { INestApplication } from '@nestjs/common';
import sarifJava from './sarif.java';
import { AppModule } from '../src/app.module';
import sarifJs from './sarif.js';

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
        code: 'aW1wb3J0IGphdmEudXRpbC5BcnJheUxpc3Q7CmltcG9ydCBqYXZhLnV0aWwuTGlzdDsKCnB1YmxpYyBjbGFzcyBFeGFtcGxlIHsKCiAgICBwcml2YXRlIExpc3Q8SW50ZWdlcj4gbGlzdDsKCiAgICBwdWJsaWMgRXhhbXBsZSgpIHsKICAgIH0KCiAgICBwdWJsaWMgdm9pZCBhZGRUb0xpc3QoSW50ZWdlciBpKSB7CiAgICAgICAgbGlzdC5hZGQoaSk7CiAgICB9CgogICAgcHVibGljIEludGVnZXIgZ2V0SXRlbShpbnQgaW5kZXgpIHsKICAgICAgICByZXR1cm4gbGlzdC5nZXQoaW5kZXgpOwogICAgfQoKICAgIHB1YmxpYyBzdGF0aWMgdm9pZCBtYWluKFN0cmluZ1tdIGFyZ3MpIHsKICAgICAgICBFeGFtcGxlIGV4YW1wbGUgPSBuZXcgRXhhbXBsZSgpOwoKICAgICAgICBleGFtcGxlLmFkZFRvTGlzdCgxMCk7CiAgICAgICAgZXhhbXBsZS5hZGRUb0xpc3QoMjApOwogICAgICAgIGV4YW1wbGUuYWRkVG9MaXN0KDMwKTsKCiAgICAgICAgU3lzdGVtLm91dC5wcmludGxuKCJJdGVtIGF0IGluZGV4IDE6ICIgKyBleGFtcGxlLmdldEl0ZW0oMSkpOwogICAgICAgIFN5c3RlbS5vdXQucHJpbnRsbigiSXRlbSBhdCBpbmRleCAzOiAiICsgZXhhbXBsZS5nZXRJdGVtKDMpKTsKICAgIH0KfQ==',
        encoded: true,
        languageExtension: 'java',
      };

      const result = await request(app.getHttpServer()).post('').send(toolCommand).expect(200);

      expect(result.body).toMatchObject(sarifJava);
    });

    it('/POST analysis should return valid sarif for javascript', async () => {
      const toolCommand: ToolCommand = {
        code: 'ZnVuY3Rpb24gU29tZUZ1bmN0aW9uKCkgewogIHZhciB4LCB5OwogIGNvbnNvbGUubG9nKHgpCn0KClNvbWVGdW5jdGlvbigpOw==',
        encoded: true,
        languageExtension: 'js',
      };

      const result = await request(app.getHttpServer()).post('').send(toolCommand).expect(200);

      expect(result.body).toMatchObject(sarifJs);
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
