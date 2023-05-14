/* eslint-disable @typescript-eslint/no-unused-vars */
import { Run } from 'sarif';
import { Injectable } from '@nestjs/common';
import { ToolRunConverter } from 'wrappers/common/interface/tool.run.converter.interface';

@Injectable()
export default class MockToolRunConverter implements ToolRunConverter<any> {
  async loadToolReport(reportFolder: string): Promise<any> {
    throw new Error('Not supported! Please implement a ToolRunConverterService in your wrapper!');
  }

  convertToolRun(input: any, originatingFileName: string): Run {
    throw new Error('Not supported! Please implement a ToolRunConverterService in your wrapper!');
  }
}
