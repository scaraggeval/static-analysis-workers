import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ESLint } from 'eslint';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import CodeUtil from 'wrappers/common/util/code.util';
import { Log } from 'sarif';
import { ToolService } from 'wrappers/common/interface/tool.service.interface';
import { LanguageExtension } from 'wrappers/common/types/types';

@Injectable()
export class EslintToolService implements ToolService, OnModuleInit {
  private readonly logger = new Logger(EslintToolService.name);
  private formatter: ESLint.Formatter;

  private readonly eslint: ESLint;

  private readonly supportedLanguageExtensions: LanguageExtension[];

  constructor() {
    this.eslint = new ESLint({
      useEslintrc: false,
      baseConfig: {
        extends: ['eslint:recommended'],
        env: {
          browser: true,
          es6: true,
        },
      },
    });

    this.supportedLanguageExtensions = ['js'];
  }

  async onModuleInit(): Promise<void> {
    this.formatter = await this.eslint.loadFormatter('@microsoft/sarif');
  }

  getSupportedLanguageExtensions(): LanguageExtension[] {
    return this.supportedLanguageExtensions;
  }

  getAnalysisFolderBase(): string | undefined {
    return undefined;
  }

  async invokeToolAnalysis(command: ToolCommand): Promise<Log> {
    this.logger.verbose('Executing EsLint');

    const decodedCode = CodeUtil.optionalDecode(command.code, command.encoded);

    const eslintResults = await this.eslint.lintText(decodedCode);

    return JSON.parse(await this.formatter.format(eslintResults));
  }
}
