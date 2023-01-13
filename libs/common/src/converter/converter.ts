import { Log as Sarif } from 'sarif';

export default abstract class Converter<T> {
  protected analysisFile: string;

  protected resultsFolder: string;

  protected output: Sarif;

  protected constructor(analysisFile: string, resultsFolder: string) {
    this.analysisFile = analysisFile;
    this.resultsFolder = resultsFolder;

    this.output = {
      $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.4.json',
      version: '2.1.0',
      runs: [],
    };
  }

  public async convert(): Promise<Sarif> {
    const input = await this.loadReport();

    return this.conversion(input);
  }

  protected abstract conversion(input: T);

  protected abstract loadReport(): Promise<T>;
}
