import * as path from 'path';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import AbstractToolService from 'wrappers/common/service/abstract.tool.service';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { AnalysisResult } from 'wrappers/common/types/types';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import ExecutorService from 'wrappers/common/service/executor.service';
import CodeUtil from 'wrappers/common/util/code.util';
import { retrieveCompilerCommandData } from '../util/infer.util';
import { randomUUID } from 'crypto';
import InferConverter from '../converter/infer.converter';

@Injectable()
export class InferToolService extends AbstractToolService implements OnModuleInit {
  protected readonly logger = new Logger(InferToolService.name);

  private readonly toolPath: string;
  private readonly toolExecutable: string;
  private readonly codePath: string;

  constructor(private configService: ConfigService, private executorService: ExecutorService) {
    super();
    this.toolPath = path.join(process.cwd(), configService.get<string>('TOOL_LOCATION'));
    this.toolExecutable = path.join(process.cwd(), configService.getOrThrow<string>('TOOL_LOCATION'), configService.getOrThrow<string>('TOOL_EXECUTABLE'));
    this.codePath = path.join(process.cwd(), configService.get<string>('CODE_LOCATION'));
  }

  async analyseCode(command: ToolCommand): Promise<AnalysisResult> {
    this.logger.log('Executing Infer.');

    const codeFilePath = await CodeUtil.prepareCodeLocation(command.code, command.language, this.codePath, command.encoded);
    const resultFolderPath = path.join(this.codePath, randomUUID());

    const commandArguments = `-o ${resultFolderPath} -- ${retrieveCompilerCommandData(command.language, resultFolderPath)} ${codeFilePath}`;
    await this.executorService.executeExecutable(this.toolExecutable, 'run', commandArguments);

    const result = await new InferConverter(codeFilePath.toString(), resultFolderPath).convert();

    return { report: result, dataToCleanup: { codeFilePath, resultFolderPath } };
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
