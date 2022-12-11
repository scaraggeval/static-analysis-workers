import { Logger } from '@nestjs/common';
import { ToolCommand } from '../command/tool.command';
import { AnalysisResult } from '../types/types';
import { ToolDto } from 'wrappers/common/dto/tool.dto';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import { PathLike } from 'fs';

export default abstract class AbstractToolService {
  protected abstract readonly logger: Logger;

  protected abstract analyseCode(command: ToolCommand): Promise<AnalysisResult>;

  async analyze(command: ToolCommand): Promise<ToolDto> {
    let cleanupData = undefined;
    try {
      const { report, dataToCleanup } = await this.analyseCode(command);
      cleanupData = dataToCleanup;

      return { executionTime: new Date(), result: report };
    } catch (e) {
      this.logger.error(`Analysis unsuccessful:\n ${e}`);
      return e;
    } finally {
      const cleanedUp = this.cleanup(cleanupData);

      if (cleanedUp) {
        this.logger.debug('Cleanup successful!');
      } else {
        this.logger.warn('Cleanup not successful!');
      }
    }
  }

  private async cleanup(cleanupData: undefined | Record<string, PathLike>) {
    if (!cleanupData) {
      this.logger.log('Cleanup is not required because no cleanup data was given.');

      return;
    }

    for (const value of Object.values(cleanupData)) {
      if (await FilesystemUtil.isFile(value)) {
        await FilesystemUtil.removeFile(value);
      } else {
        await FilesystemUtil.removeFolder(value);
      }
    }
  }
}
