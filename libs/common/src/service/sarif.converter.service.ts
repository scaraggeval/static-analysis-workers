import { Log } from 'sarif';
import { Inject, Injectable } from '@nestjs/common';
import { ToolRunConverter } from 'wrappers/common/interface/tool.run.converter.interface';

@Injectable()
export default class SarifConverterService<T> {
  protected template: Log = {
    $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.4.json',
    version: '2.1.0',
    runs: [],
  };

  constructor(@Inject(ToolRunConverter) private readonly toolRunConverterService: ToolRunConverter<T>) {}

  public async convertFromReportFolder(reportFolder: string, originatingFileName?: string): Promise<Log> {
    if (!reportFolder || !this.toolRunConverterService.loadToolReport) {
      throw new Error('Nothing to load from as report folder has not been set or no way to load the tool report has been given!');
    }

    const input = await this.toolRunConverterService.loadToolReport(reportFolder);

    return this.convertFromInput(input, originatingFileName);
  }

  public async convertFromInput(input: T, originatingFileName?: string): Promise<Log> {
    if (!input) {
      throw new Error('Nothing to load from as no input has been given!');
    }

    const run = await this.toolRunConverterService.convertToolRun(input, originatingFileName);

    return { ...this.template, runs: [run] };
  }
}
