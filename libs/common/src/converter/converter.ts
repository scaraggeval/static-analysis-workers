import { Log } from 'sarif';

export default abstract class Converter<T> {
  protected output: Log;

  protected constructor(protected analysisFile?: string, protected reportLoadFolder?: string) {
    this.output = {
      $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.4.json',
      version: '2.1.0',
      runs: [],
    };
  }

  public async convert(input?: T): Promise<Log> {
    if (!input) {
      if (!this.reportLoadFolder) {
        throw new Error('Nothing to load from as report folder has not been set!');
      }

      input = await this.loadReport();
    }

    return this.conversion(input);
  }

  protected abstract conversion(input: T): Promise<Log>;

  protected abstract loadReport(): Promise<T>;
}
