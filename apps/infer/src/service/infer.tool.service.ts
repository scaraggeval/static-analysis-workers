import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { Log } from 'sarif';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import ExecutorService from 'wrappers/common/service/executor.service';
import CodeUtil from 'wrappers/common/util/code.util';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import { retrieveCompilerCommandData } from '../util/infer.util';
import { ToolService } from 'wrappers/common/interface/tool.service.interface';
import { InferReport } from '../types/types';
import SarifConverterService from 'wrappers/common/service/sarif.converter.service';
import { LanguageExtension } from 'wrappers/common/types/types';

@Injectable()
export class InferToolService implements ToolService, OnModuleInit {
  private readonly logger = new Logger(InferToolService.name);

  private readonly codePath: string;
  private readonly toolPath: string;
  private readonly toolExecutable: string;

  private readonly supportedLanguageExtensions: LanguageExtension[];

  constructor(private readonly sarifConverter: SarifConverterService<InferReport>, private readonly executorService: ExecutorService, private readonly configService: ConfigService) {
    this.codePath = configService.get<string>('CODE_LOCATION');
    this.toolPath = path.join(process.cwd(), configService.get<string>('TOOL_LOCATION'));
    this.toolExecutable = path.join(process.cwd(), configService.getOrThrow<string>('TOOL_LOCATION'), configService.getOrThrow<string>('TOOL_EXECUTABLE'));

    this.supportedLanguageExtensions = ['java', 'c', 'cpp'];
  }

  getSupportedLanguageExtensions(): LanguageExtension[] {
    return this.supportedLanguageExtensions;
  }

  getAnalysisFolderBase(): string | undefined {
    return this.codePath;
  }

  async invokeToolAnalysis(command: ToolCommand, analysisFolder): Promise<Log> {
    this.logger.verbose('Executing Infer.');

    const codeFilePath = await CodeUtil.prepareCodeLocation(command.code, command.languageExtension, analysisFolder, command.encoded);
    const resultFolderPath = path.join(analysisFolder, randomUUID());

    const commandArguments = `-o ${resultFolderPath} -- ${retrieveCompilerCommandData(command.languageExtension, analysisFolder)} ${codeFilePath}`;
    await this.executorService.executeExecutable(this.toolExecutable, 'run', commandArguments);

    return this.sarifConverter.convertFromReportFolder(resultFolderPath, codeFilePath.toString());
  }

  async onModuleInit(): Promise<any> {
    this.logger.log('Initializing tool.');
    await this.prepareTool();
    this.logger.log('Tool initialization finished.');
  }

  async downloadTool() {
    this.logger.log('Downloading tool.');

    const toolInstallationCommand = this.configService.get<string>('INSTALLATION_COMMAND');
    await this.executorService.executeCommand(toolInstallationCommand);

    this.logger.log('Tool downloaded.');

    await FilesystemUtil.makeExecutable(this.toolPath);
  }

  async prepareTool() {
    if (!(await FilesystemUtil.checkFileOrFolder(this.toolExecutable))) {
      await FilesystemUtil.createFolder(this.toolPath);
      await this.downloadTool();
    }
  }
}
