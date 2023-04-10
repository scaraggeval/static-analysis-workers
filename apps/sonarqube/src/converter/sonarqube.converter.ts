import { Injectable } from '@nestjs/common';
import { Location, Log, Result, Run } from 'sarif';
import Converter from 'wrappers/common/converter/converter';
import { TYPE_LEVEL_MAP } from '../constants/sonar';
import { Issue } from '../types/types';

@Injectable()
export default class SonarqubeConverter extends Converter<Issue[]> {
  constructor(analysisFile: string) {
    super(analysisFile);
  }

  protected async conversion(input: Issue[]): Promise<Log> {
    const run: Run = {
      tool: {
        driver: {
          name: 'Sonarqube',
          fullName: 'Sonarqube',
          rules: [],
        },
      },
      results: [],
    };

    run.results.push(...input.map(this.getRunResult));
    this.output.runs.push(run);

    return this.output;
  }

  protected loadReport(): Promise<Issue[]> {
    throw new Error('Method not implemented.');
  }

  private getRunResult(issue: Issue): Result {
    const location: Location | undefined = issue.textRange
      ? {
          physicalLocation: {
            artifactLocation: {
              uri: this.analysisFile,
            },
            region: {
              startLine: issue.textRange.startLine,
              endLine: issue.textRange.endLine,
              startColumn: issue.textRange.startOffset,
              endColumn: issue.textRange.endOffset,
            },
          },
        }
      : undefined;

    return {
      ruleId: issue.rule,
      level: TYPE_LEVEL_MAP[issue.type],
      message: {
        text: issue.message,
      },
      locations: location ? [location] : undefined,
    };
  }
}
