import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AdmZip from 'adm-zip';
import axios from 'axios';
import { randomUUID } from 'crypto';
import * as path from 'path';
import { Log } from 'sarif';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import AbstractToolService from 'wrappers/common/service/abstract.tool.service';
import ExecutorService from 'wrappers/common/service/executor.service';
import CodeUtil from 'wrappers/common/util/code.util';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import SonarqubeConverter from '../converter/sonarqube.converter';
import SonarqubeService from './sonarqube.service';

@Injectable()
export default class SonarqubeToolService extends AbstractToolService implements OnModuleInit {
  protected readonly logger = new Logger(SonarqubeToolService.name);

  private readonly toolPath: string;
  private readonly toolExecutable: string;

  constructor(private configService: ConfigService, private executorService: ExecutorService, private sonarqubeService: SonarqubeService, private formatService: SonarqubeConverter) {
    super(path.join(process.cwd(), configService.getOrThrow<string>('CODE_LOCATION')));
    this.toolPath = path.join(process.cwd(), configService.getOrThrow<string>('TOOL_LOCATION'));
    this.toolExecutable = path.join(process.cwd(), configService.getOrThrow<string>('TOOL_LOCATION'), configService.getOrThrow<string>('TOOL_EXECUTABLE'));
  }

  protected requiresAnalysisFolder(): boolean {
    return true;
  }

  async analyseCode(command: ToolCommand, analysisFolder): Promise<Log> {
    this.logger.log('Executing SonarQube scanner.');

    const key = randomUUID();

    const codeFilePath = await CodeUtil.prepareCodeLocation(command.code, command.language, analysisFolder, command.encoded);

    try {
      const commandArguments = ` \
    -Dsonar.projectKey=${key} \
    -Dsonar.sources=${codeFilePath} \
    -Dsonar.working.directory=${analysisFolder} \
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

      return await new SonarqubeConverter(codeFilePath.toString()).convert(issues);
    } catch (e) {
      return e;
    }
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
