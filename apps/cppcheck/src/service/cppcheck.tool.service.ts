import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Log } from 'sarif';
import ExecutorService from 'wrappers/common/service/executor.service';
import CodeUtil from 'wrappers/common/util/code.util';
import { ToolService } from 'wrappers/common/interface/tool.service.interface';
import { PlistReport } from '../types/types';
import SarifConverterService from 'wrappers/common/service/sarif.converter.service';
import { LanguageExtension } from 'wrappers/common/types/types';
import { ToolCommand } from 'wrappers/common/command/tool.command';

@Injectable()
export class CppcheckToolService implements ToolService, OnModuleInit {
  private readonly logger = new Logger(CppcheckToolService.name);

  private readonly codeLocation: string;

  private readonly supportedLanguageExtensions: LanguageExtension[];

  constructor(private readonly executorService: ExecutorService, private readonly sarifConverter: SarifConverterService<PlistReport>, readonly configService: ConfigService) {
    this.codeLocation = configService.get<string>('CODE_LOCATION');

    this.supportedLanguageExtensions = ['c', 'cpp'];
  }

  getSupportedLanguageExtensions(): LanguageExtension[] {
    return this.supportedLanguageExtensions;
  }

  getAnalysisFolderBase(): string {
    return this.codeLocation;
  }

  async invokeToolAnalysis(command: ToolCommand, analysisFolder: string): Promise<Log> {
    this.logger.verbose('Executing cppcheck.');

    const codeFilePath = await CodeUtil.prepareCodeLocation(command.code, command.languageExtension, analysisFolder, command.encoded);

    const commandArguments = `--plist-output=${analysisFolder} ${codeFilePath}`;
    await this.executorService.executeCommand('cppcheck', commandArguments);

    return this.sarifConverter.convertFromReportFolder(analysisFolder, codeFilePath.toString());
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
      this.logger.error('Tool is not available. Please install the tool!');

      throw Error(e);
    }
  }
}
