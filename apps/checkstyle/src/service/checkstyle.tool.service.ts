import * as path from 'path';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import AbstractToolService from 'wrappers/common/service/abstract.tool.service';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { AnalysisResult } from 'wrappers/common/constants/types';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import ExecutorService from 'wrappers/common/service/executor.service';
import CodeUtil from 'wrappers/common/util/code.util';

@Injectable()
export class CheckstyleToolService extends AbstractToolService implements OnModuleInit {
  protected readonly logger = new Logger(CheckstyleToolService.name);

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
    this.logger.log('Executing Checkstyle.');

    const codeFilePath = await CodeUtil.prepareCodeLocation(command.code, command.language, this.codePath, command.encoded);

    const commandArguments = `-jar ${this.toolExecutable} -c /sun_checks.xml -f sarif ${codeFilePath}`;
    const result = await this.executorService.executeCommand(`java`, commandArguments, true);

    return { report: JSON.parse(result), dataToCleanup: { codeFilePath } };
  }

  async onModuleInit(): Promise<any> {
    this.logger.log('Initializing tool.');
    await this.prepareTool();
    this.logger.log('Tool initialization finished.');
  }

  async downloadTool() {
    this.logger.log('Downloading tool.');
    const jarResponse = await axios({
      method: 'GET',
      url: this.configService.get<string>('TOOL_LINK'),
      responseType: 'arraybuffer',
    });
    this.logger.log('Tool downloaded.');

    await FilesystemUtil.createFile(this.toolExecutable, jarResponse.data);
  }

  async prepareTool() {
    if (!(await FilesystemUtil.checkFileOrFolder(this.toolExecutable))) {
      await FilesystemUtil.createFolder(this.toolPath);
      await this.downloadTool();
    }
  }
}
