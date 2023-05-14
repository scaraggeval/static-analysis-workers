import * as fs from 'fs/promises';
import * as path from 'path';
import * as plist from 'plist';
import { ReportingDescriptor, Result, Run } from 'sarif';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import { Location, PlistReport } from '../types/types';
import { Injectable } from '@nestjs/common';
import { ToolRunConverter } from 'wrappers/common/interface/tool.run.converter.interface';

@Injectable()
export default class CppcheckToolRunConverter implements ToolRunConverter<PlistReport> {
  async loadToolReport(reportFolder: string): Promise<PlistReport> {
    const resultFiles = await FilesystemUtil.findFileWithExtensionInDirectory(reportFolder, 'plist');

    if (resultFiles.length !== 1) {
      throw new Error('No result file generated.');
    }

    const fileContent = await fs.readFile(path.join(reportFolder, resultFiles[0].toString()), { encoding: 'utf-8' });
    const plistInput = plist.parse(fileContent);

    return Promise.resolve(plistInput as PlistReport);
  }

  convertToolRun(input: PlistReport, originatingFileName: string): Run {
    const run: Run = {
      tool: {
        driver: {
          name: 'Cppcheck',
          fullName: input.clang_version,
          rules: [],
        },
      },
      results: [],
    };

    input.diagnostics.forEach((diagnostic) => {
      // create the Rule object if it doesn't already exist
      if (!run.tool.driver.rules.map((value) => value.name).includes(diagnostic.check_name)) {
        const rule: ReportingDescriptor = {
          id: diagnostic.check_name,
          name: diagnostic.check_name,
        };
        run.tool.driver.rules.push(rule);
      }
      // create the Result object
      const res: Result = {
        message: {
          text: diagnostic.description,
        },
        ruleId: diagnostic.check_name,
        locations: [
          {
            physicalLocation: {
              artifactLocation: {
                uri: originatingFileName,
              },
              region: this.genRegion(diagnostic.location),
            },
          },
        ],
      };
      run.results.push(res);
    });

    return run;
  }

  private genRegion(location: Location): any {
    return {
      startLine: location.line,
      startColumn: location.col,
    };
  }
}
