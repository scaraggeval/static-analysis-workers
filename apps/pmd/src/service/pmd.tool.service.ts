import * as path from 'path';
import * as AdmZip from 'adm-zip';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import AbstractToolService from 'wrappers/common/service/abstract.tool.service';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { AnalysisResult } from 'wrappers/common/types/types';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import ExecutorService from 'wrappers/common/service/executor.service';
import CodeUtil from 'wrappers/common/util/code.util';

@Injectable()
export class PmdToolService extends AbstractToolService implements OnModuleInit {
  protected readonly logger = new Logger(PmdToolService.name);

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
    this.logger.log('Executing PMD.');

    const codeFilePath = await CodeUtil.prepareCodeLocation(command.code, command.language, this.codePath, command.encoded);

    const commandArguments = `-d ${this.codePath} -R rulesets/java/quickstart.xml -f sarif --no-cache -failOnViolation false`;
    const result = await this.executorService.executeExecutable(`${this.toolExecutable}`, `pmd`, commandArguments);

    return { report: JSON.parse(result), dataToCleanup: { codeFilePath } };
  }

  async onModuleInit(): Promise<any> {
    this.logger.log('Initializing tool.');
    await this.prepareTool();
    this.logger.log('Tool initialization finished.');
  }

  async downloadTool() {
    this.logger.log('Downloading tool.');
    const zipResponse = await axios({
      method: 'GET',
      url: this.configService.get<string>('TOOL_LINK'),
      responseType: 'arraybuffer',
    });
    this.logger.log('Tool downloaded.');

    const zip = new AdmZip(zipResponse.data);
    await zip.extractAllTo(this.toolPath);
  }

  async prepareTool() {
    if (!(await FilesystemUtil.checkFileOrFolder(this.toolExecutable))) {
      await FilesystemUtil.createFolder(this.toolPath);
      await this.downloadTool();
    }

    this.logger.log('Making tool executable...');
    await FilesystemUtil.makeExecutable(this.toolPath);
    this.logger.log('Tool is executable.');
  }
}
