import { Injectable, Logger } from '@nestjs/common';
import { ESLint } from 'eslint';
import AbstractToolService from 'wrappers/common/service/abstract.tool.service';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import CodeUtil from 'wrappers/common/util/code.util';
import { Log } from 'sarif';

@Injectable()
export class EslintToolService extends AbstractToolService {
  protected readonly logger = new Logger(EslintToolService.name);

  private readonly eslint: ESLint;

  constructor() {
    super();
    this.eslint = new ESLint({
      useEslintrc: false,
      baseConfig: {
        extends: ['eslint:recommended'],
        env: {
          es6: true,
        },
      },
    });
  }

  protected requiresAnalysisFolder(): boolean {
    return false;
  }

  async analyseCode(command: ToolCommand): Promise<Log> {
    const decodedCode = CodeUtil.optionalDecode(command.code, command.encoded);

    const eslintResults = await this.eslint.lintText(decodedCode);

    return await this.formatResult(eslintResults);
  }

  async formatResult(results: ESLint.LintResult[]): Promise<Log> {
    const formatString = '@microsoft/sarif';
    const formatter = await this.eslint.loadFormatter(formatString);

    return JSON.parse(await formatter.format(results));
  }
}
