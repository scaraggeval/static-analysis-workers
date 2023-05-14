import { Location, Result, Run } from 'sarif';
import { TYPE_LEVEL_MAP } from '../constants/sonar';
import { Issue } from '../types/types';
import { ToolRunConverter } from 'wrappers/common/interface/tool.run.converter.interface';

export default class SonarqubeConverter implements ToolRunConverter<Issue[]> {
  loadToolReport(reportFolder: string): Promise<Issue[]> {
    throw new Error('Method not implemented.');
  }

  convertToolRun(input: Issue[], originatingFileName: string): Run {
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

    run.results.push(...input.map((value) => this.getRunResult(value, originatingFileName), this));

    return run;
  }

  protected loadReport(): Promise<Issue[]> {
    throw new Error('Method not implemented.');
  }

  private getRunResult(issue: Issue, originatingFileName: string): Result {
    const location: Location | undefined = issue.textRange
      ? {
          physicalLocation: {
            artifactLocation: {
              uri: originatingFileName,
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
