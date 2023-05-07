import { HttpException, HttpStatus, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PathLike } from 'fs';
import * as path from 'path';
import { Log } from 'sarif';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import { ToolCommand } from '../command/tool.command';

export default abstract class AbstractToolService {
  protected abstract readonly logger: Logger;

  protected constructor(private readonly codePath?: string) {}

  protected abstract analyseCode(command: ToolCommand, analysisFolder?: PathLike): Promise<Log>;

  protected abstract requiresAnalysisFolder(): boolean;

  private async retrieveAnalysisFolder(): Promise<PathLike | undefined> {
    if (!this.requiresAnalysisFolder()) {
      return undefined;
    }

    const analysisFolderPath = path.join(this.codePath, randomUUID());
    await FilesystemUtil.createFolder(analysisFolderPath);

    return analysisFolderPath;
  }

  async analyze(command: ToolCommand): Promise<Log> {
    const analysisFolder = await this.retrieveAnalysisFolder();

    try {
      return await this.analyseCode(command, analysisFolder);
    } catch (e) {
      this.logger.error(`Analysis unsuccessful:\n ${e}`);

      throw new HttpException({ error: e.error }, HttpStatus.BAD_REQUEST);
    } finally {
      if (this.requiresAnalysisFolder()) {
        await FilesystemUtil.removeFolder(analysisFolder);

        this.logger.verbose('Cleanup successful!');
      }
    }
  }
}
