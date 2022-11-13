import { Injectable, Logger } from '@nestjs/common';
import { ESLint } from 'eslint';
import AbstractToolService from 'wrappers/common/service/abstract.tool.service';
import { AnalysisResult, FORMATS } from 'wrappers/common/constants/types';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import CodeUtil from 'wrappers/common/util/code.util';

@Injectable()
export class EslintToolService extends AbstractToolService {
  protected readonly logger = new Logger(EslintToolService.name);

  private readonly eslint: ESLint;

  constructor() {
    super();
    this.eslint = new ESLint({
      useEslintrc: false,
    });
  }

  async analyseCode(command: ToolCommand): Promise<AnalysisResult> {
    const decodedCode = CodeUtil.optionalDecode(command.code, command.encoded);

    const eslintResults = await this.eslint.lintText(decodedCode);

    return { report: await this.formatResult(eslintResults, command.format) };
  }

  async formatResult(results: ESLint.LintResult[], format: FORMATS): Promise<string> {
    let formatString = undefined;
    switch (format) {
      case 'sarif':
        formatString = '@microsoft/sarif';
        break;
      default:
        throw new Error();
    }
    const formatter = await this.eslint.loadFormatter(formatString);

    return formatter.format(results);
  }
}
