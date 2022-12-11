import { Injectable } from '@nestjs/common';
import { Location, Log, Result } from 'sarif';
import { Issue } from '../types/types';
import { TYPE_LEVEL_MAP } from '../constants/sonar';

@Injectable()
export default class FormatService {
  public format(input: Issue[]): Log {
    return {
      $schema: 'https://schemastore.azurewebsites.net/schemas/json/sarif-2.1.0-rtm.4.json',
      version: '2.1.0',
      runs: [
        {
          tool: {
            driver: { name: 'Sonarqube' },
          },
          results: input.map(this.getRunResult),
        },
      ],
    };
  }

  private getRunResult(issue: Issue): Result {
    const location: Location | undefined = issue.textRange
      ? {
          physicalLocation: {
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
