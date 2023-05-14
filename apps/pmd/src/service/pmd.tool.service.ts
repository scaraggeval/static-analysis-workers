import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AdmZip from 'adm-zip';
import axios from 'axios';
import * as path from 'path';
import { Log } from 'sarif';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import ExecutorService from 'wrappers/common/service/executor.service';
import CodeUtil from 'wrappers/common/util/code.util';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import { ToolService } from 'wrappers/common/interface/tool.service.interface';
import { LanguageExtension } from 'wrappers/common/types/types';

@Injectable()
export class PmdToolService implements ToolService, OnModuleInit {
  private readonly logger = new Logger(PmdToolService.name);

  private readonly codePath: string;
  private readonly toolPath: string;
  private readonly toolExecutable: string;

  private readonly supportedLanguageExtensions: LanguageExtension[];

  constructor(private readonly configService: ConfigService, private readonly executorService: ExecutorService) {
    this.codePath = configService.get<string>('CODE_LOCATION');
    this.toolPath = path.join(process.cwd(), configService.get<string>('TOOL_LOCATION'));
    this.toolExecutable = path.join(process.cwd(), configService.getOrThrow<string>('TOOL_LOCATION'), configService.getOrThrow<string>('TOOL_EXECUTABLE'));

    this.supportedLanguageExtensions = ['java', 'js'];
  }

  getSupportedLanguageExtensions(): LanguageExtension[] {
    return this.supportedLanguageExtensions;
  }

  getAnalysisFolderBase(): string | undefined {
    return this.codePath;
  }

  async invokeToolAnalysis(command: ToolCommand, analysisFolder): Promise<Log> {
    this.logger.verbose('Executing PMD.');

    const codeFilePath = await CodeUtil.prepareCodeLocation(command.code, command.languageExtension, analysisFolder, command.encoded);

    const commandArguments = `-d ${codeFilePath} -R rulesets/java/quickstart.xml -f sarif --no-cache -failOnViolation false`;
    const result = await this.executorService.executeExecutable(`${this.toolExecutable}`, `pmd`, commandArguments);

    return JSON.parse(result);
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
