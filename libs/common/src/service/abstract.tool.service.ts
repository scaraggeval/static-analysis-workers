import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { ToolCommand } from '../command/tool.command';
import { ToolDto } from 'wrappers/common/dto/tool.dto';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import { PathLike } from 'fs';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { Log as Sarif } from 'sarif';

export default abstract class AbstractToolService {
  protected abstract readonly logger: Logger;

  protected constructor(private readonly codePath?: string) {}

  protected abstract analyseCode(command: ToolCommand, analysisFolder?: PathLike): Promise<Sarif>;

  protected abstract requiresAnalysisFolder(): boolean;

  protected async retrieveAnalysisFolder(): Promise<PathLike | undefined> {
    if (!this.requiresAnalysisFolder()) {
      return undefined;
    }

    const analysisFolderPath = path.join(this.codePath, randomUUID());
    await FilesystemUtil.createFolder(analysisFolderPath);

    return analysisFolderPath;
  }

  async analyze(command: ToolCommand): Promise<ToolDto> {
    const analysisFolder = await this.retrieveAnalysisFolder();
    try {
      const report = await this.analyseCode(command, analysisFolder);

      return { executionTime: new Date(), result: report };
    } catch (e) {
      this.logger.error(`Analysis unsuccessful:\n ${e}`);

      throw new HttpException({ error: e.error }, HttpStatus.BAD_REQUEST);
    } finally {
      if (this.requiresAnalysisFolder()) {
        await FilesystemUtil.removeFolder(analysisFolder);

        this.logger.debug('Cleanup successful!');
      }
    }
  }
}
