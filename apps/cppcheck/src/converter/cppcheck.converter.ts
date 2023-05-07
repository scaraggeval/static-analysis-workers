import * as fs from 'fs/promises';
import * as path from 'path';
import * as plist from 'plist';
import { Log, ReportingDescriptor, Result, Run } from 'sarif';
import SarifConverter from 'wrappers/common/converter/sarif.converter';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import { Location, PlistReport } from '../types/types';

export default class CppcheckConverter extends SarifConverter<PlistReport> {
  constructor(analysisFile: string, resultFolder: string) {
    super(analysisFile, resultFolder);
  }

  public async conversion(input: PlistReport): Promise<Log> {
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
                uri: this.analysisFile,
              },
              region: this.genRegion(diagnostic.location),
            },
          },
        ],
      };
      run.results.push(res);
    });

    this.output.runs.push(run);

    return this.output;
  }

  private genRegion(location: Location): any {
    return {
      startLine: location.line,
      startColumn: location.col,
    };
  }

  protected async loadReport(): Promise<PlistReport> {
    const resultFiles = await FilesystemUtil.findFileWithExtensionInDirectory(this.reportLoadFolder, 'plist');

    if (resultFiles.length !== 1) {
      throw new Error('No result file generated.');
    }

    const fileContent = await fs.readFile(path.join(this.reportLoadFolder, resultFiles[0].toString()), { encoding: 'utf-8' });
    const plistInput = plist.parse(fileContent);

    return Promise.resolve(plistInput as PlistReport);
  }
}
