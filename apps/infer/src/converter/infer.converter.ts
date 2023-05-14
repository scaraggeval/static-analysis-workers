import * as fs from 'fs/promises';
import * as path from 'path';
import { ReportingDescriptor, Result, Run } from 'sarif';
import { InferReport } from '../types/types';
import { ToolRunConverter } from 'wrappers/common/interface/tool.run.converter.interface';

export default class InferConverter implements ToolRunConverter<InferReport> {
  convertToolRun(input: InferReport, originatingFileName: string): Run {
    const run: Run = {
      tool: {
        driver: {
          name: 'Infer',
          rules: [],
        },
      },
      results: [],
    };

    input.forEach((jsonBug) => {
      // create the Rule object if it doesn't already exist
      if (!run.tool.driver.rules.map((value) => value.id).includes(jsonBug.bug_type)) {
        const rule: ReportingDescriptor = {
          id: jsonBug.bug_type,
          name: jsonBug.bug_type_hum,
        };

        run.tool.driver.rules.push(rule);
      }
      // create the Result object
      const result: Result = {
        message: {
          text: jsonBug.qualifier,
        },
        level: this.kindToLevel(jsonBug.kind),
        ruleId: jsonBug.bug_type,
        // there is a single location in an Infer report
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: originatingFileName,
              },
              region: {
                startLine: jsonBug.line,
                startColumn: jsonBug.column,
              },
            },
          },
        ],
      };

      run.results.push(result);
    });

    return run;
  }

  async loadToolReport(reportFolder: string): Promise<InferReport> {
    const fileContent = await fs.readFile(path.join(reportFolder, 'report.json'), { encoding: 'utf-8' });

    return JSON.parse(fileContent) as InferReport;
  }

  private kindToLevel(kind: string): 'warning' | 'error' {
    if (kind === 'ERROR') {
      return 'error';
    } else {
      return 'warning';
    }
  }
}
