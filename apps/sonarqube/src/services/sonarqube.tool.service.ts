import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AdmZip from 'adm-zip';
import axios from 'axios';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { Log } from 'sarif';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import ExecutorService from 'wrappers/common/service/executor.service';
import CodeUtil from 'wrappers/common/util/code.util';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import SonarqubeService from './sonarqube.service';
import { ToolService } from 'wrappers/common/interface/tool.service.interface';
import SarifConverterService from 'wrappers/common/service/sarif.converter.service';
import { Issue } from '../types/types';
import { LanguageExtension } from 'wrappers/common/types/types';

@Injectable()
export default class SonarqubeToolService implements ToolService, OnModuleInit {
  private readonly logger = new Logger(SonarqubeToolService.name);

  private readonly codeLocation: string;
  private readonly toolPath: string;
  private readonly toolExecutable: string;

  private readonly supportedLanguageExtensions: LanguageExtension[];

  constructor(
    private readonly configService: ConfigService,
    private readonly executorService: ExecutorService,
    private readonly sonarqubeService: SonarqubeService,
    private readonly sarifConverterService: SarifConverterService<Issue[]>,
  ) {
    this.codeLocation = configService.get<string>('CODE_LOCATION');
    this.toolPath = path.join(process.cwd(), configService.getOrThrow<string>('TOOL_LOCATION'));
    this.toolExecutable = path.join(process.cwd(), configService.getOrThrow<string>('TOOL_LOCATION'), configService.getOrThrow<string>('TOOL_EXECUTABLE'));

    this.supportedLanguageExtensions = ['java', 'py', 'js'];
  }

  getSupportedLanguageExtensions(): LanguageExtension[] {
    return this.supportedLanguageExtensions;
  }

  getAnalysisFolderBase(): string {
    return this.codeLocation;
  }

  async invokeToolAnalysis(command: ToolCommand, analysisFolder): Promise<Log> {
    this.logger.log('Executing SonarQube scanner.');

    const key = randomUUID();

    const codeFilePath = await CodeUtil.prepareCodeLocation(command.code, command.languageExtension, analysisFolder, command.encoded);

    const commandArguments = ` \
    -Dsonar.projectKey=${key} \
    -Dsonar.sources=${codeFilePath} \
    -Dsonar.projectBaseDir=${analysisFolder} \
    -Dsonar.host.url=${this.configService.getOrThrow<string>('SONAR_HOST_URL')} \
    -Dsonar.login=${this.configService.getOrThrow<string>('SONAR_USERNAME')} \
    -Dsonar.password=${this.configService.getOrThrow<string>('SONAR_PASSWORD')}`;

    await this.executorService.executeExecutable(`${this.toolExecutable}`, undefined, commandArguments);

    let activityResult = await this.sonarqubeService.getActivity(key);
    while (activityResult.pending != 0 || activityResult.inProgress != 0) {
      await new Promise((resolve) => setTimeout(resolve, 100));
      activityResult = await this.sonarqubeService.getActivity(key);
    }

    const issues = await this.sonarqubeService.getIssues(key);

    // This seems weird, but remember that env variables are always strings.
    if (this.configService.get<string>('DELETE_AFTER_SCAN') === 'true') {
      await this.sonarqubeService.deleteProject(key);
    }

    return this.sarifConverterService.convertFromInput(issues, codeFilePath.toString());
  }

  async onModuleInit(): Promise<void> {
    this.logger.log('Initializing tool.');
    await this.prepareTool();
    this.logger.log('Tool initialization finished.');
  }

  async downloadTool() {
    this.logger.log('Downloading tool.');
    const zipResponse = await axios.get(this.configService.getOrThrow<string>('TOOL_LINK'), { responseType: 'arraybuffer' });
    this.logger.log('Tool downloaded.');

    const zip = new AdmZip(zipResponse.data);
    zip.extractAllTo(this.toolPath);
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
