import * as fs from 'fs/promises';
import * as path from 'path';
import { Log, ReportingDescriptor, Result, Run } from 'sarif';
import SarifConverter from 'wrappers/common/converter/sarif.converter';
import { InferReport } from '../types/types';

export default class InferConverter extends SarifConverter<InferReport> {
  constructor(analysisFile: string, resultFolder: string) {
    super(analysisFile, resultFolder);
  }

  protected async conversion(input: InferReport): Promise<Log> {
    const run: Run = {
      tool: {
        driver: {
          name: 'Infer',
          rules: [],
        },
      },
      results: [],
    };

    this.output.runs.push(run);

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
                uri: this.analysisFile,
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

    return this.output;
  }

  protected async loadReport(): Promise<InferReport> {
    const fileContent = await fs.readFile(path.join(this.reportLoadFolder, 'report.json'), { encoding: 'utf-8' });

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
