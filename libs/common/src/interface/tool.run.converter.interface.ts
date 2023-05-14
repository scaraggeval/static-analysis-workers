import { Run } from 'sarif';

export interface ToolRunConverter<T> {
  convertToolRun(input: T, originatingFileName?: string): Run;

  loadToolReport(reportFolder: string): Promise<T | undefined>;
}

export const ToolRunConverter = Symbol('ToolRunConverter');
