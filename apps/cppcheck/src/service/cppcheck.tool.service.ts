import * as path from 'path';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AbstractToolService from 'wrappers/common/service/abstract.tool.service';
import ExecutorService from 'wrappers/common/service/executor.service';
import CodeUtil from 'wrappers/common/util/code.util';
import CppcheckConverter from '../converter/cppcheck.converter';
import { Log } from 'sarif';

@Injectable()
export class CppcheckToolService extends AbstractToolService implements OnModuleInit {
  protected readonly logger = new Logger(CppcheckToolService.name);

  constructor(private configService: ConfigService, private executorService: ExecutorService) {
    super(path.join(process.cwd(), configService.get<string>('CODE_LOCATION')));
  }

  protected requiresAnalysisFolder(): boolean {
    return true;
  }

  async analyseCode(command, analysisFolder): Promise<Log> {
    this.logger.verbose('Executing cppcheck.');

    const codeFilePath = await CodeUtil.prepareCodeLocation(command.code, command.language, analysisFolder, command.encoded);

    const commandArguments = `--plist-output=${analysisFolder} ${codeFilePath}`;
    await this.executorService.executeCommand('cppcheck', commandArguments);

    return await new CppcheckConverter(codeFilePath.toString(), analysisFolder).convert();
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
