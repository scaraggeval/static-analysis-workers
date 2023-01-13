import * as path from 'path';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AbstractToolService from 'wrappers/common/service/abstract.tool.service';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { AnalysisResult } from 'wrappers/common/types/types';
import ExecutorService from 'wrappers/common/service/executor.service';
import CodeUtil from 'wrappers/common/util/code.util';
import { randomUUID } from 'crypto';
import CppcheckConverter from '../converter/cppcheck.converter';

@Injectable()
export class CppcheckToolService extends AbstractToolService implements OnModuleInit {
  protected readonly logger = new Logger(CppcheckToolService.name);

  private readonly codePath: string;

  constructor(private configService: ConfigService, private executorService: ExecutorService) {
    super();
    this.codePath = path.join(process.cwd(), configService.get<string>('CODE_LOCATION'));
  }

  async analyseCode(command: ToolCommand): Promise<AnalysisResult> {
    this.logger.log('Executing Infer.');

    const analysisFolderPath = path.join(this.codePath, randomUUID());
    const codeFilePath = await CodeUtil.prepareCodeLocation(command.code, command.language, analysisFolderPath, command.encoded);

    const commandArguments = `--plist-output=${analysisFolderPath} ${codeFilePath}`;
    await this.executorService.executeCommand('cppcheck', commandArguments);

    const result = await new CppcheckConverter(codeFilePath.toString(), analysisFolderPath).convert();

    return { report: result, dataToCleanup: { analysisFolderPath } };
  }

  async onModuleInit(): Promise<any> {
    this.logger.log('Initializing tool.');
    await this.checkTool();
    this.logger.log('Tool initialization finished.');
  }

  async checkTool() {
    try {
      await this.executorService.executeCommand('cppcheck', '--help');
    } catch (e) {
      this.logger.error('Tool is not available');
      throw Error(e);
    }
  }
}
