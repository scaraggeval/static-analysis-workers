import { HttpException, HttpStatus, Inject, Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PathLike } from 'fs';
import * as path from 'path';
import { Log } from 'sarif';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import { ToolCommand } from '../command/tool.command';
import { ToolService } from 'wrappers/common/interface/tool.service.interface';

@Injectable()
export default class AnalysisService {
  private readonly logger = new Logger(AnalysisService.name);

  constructor(@Inject(ToolService) private readonly toolService: ToolService) {}

  private async retrieveAnalysisFolder(): Promise<PathLike | undefined> {
    const analysisFolderPathBase = this.toolService.getAnalysisFolderBase?.();

    if (!analysisFolderPathBase) {
      return undefined;
    }

    const analysisFolderPath = path.join(process.cwd(), analysisFolderPathBase, randomUUID());
    await FilesystemUtil.createFolder(analysisFolderPath);

    return analysisFolderPath;
  }

  async analyze(command: ToolCommand): Promise<Log> {
    if (!this.toolService.getSupportedLanguageExtensions().includes(command.languageExtension)) {
      throw new HttpException(
        {
          message: 'This language is not supported by this tool!',
          code: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    let analysisFolder;
    try {
      analysisFolder = await this.retrieveAnalysisFolder();

      return await this.toolService.invokeToolAnalysis(command, analysisFolder);
    } catch (e) {
      this.logger.error(`Analysis unsuccessful:\n ${e}`, e.stack);

      throw new HttpException(
        {
          error: e.error,
          message: e.message ?? 'An exception happened while analysing. Ensure your code compiles and executes correctly beforehand!',
          code: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    } finally {
      if (analysisFolder) {
        await FilesystemUtil.removeFolder(analysisFolder);

        this.logger.verbose('Cleanup successful!');
      }
    }
  }
}
