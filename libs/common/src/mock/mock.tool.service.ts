import { LanguageExtension } from 'wrappers/common/types/types';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { PathLike } from 'fs';
import { Log } from 'sarif';
import { ToolService } from 'wrappers/common/interface/tool.service.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
class MockToolService implements ToolService {
  getAnalysisFolderBase(): string | undefined {
    return undefined;
  }

  getSupportedLanguageExtensions(): LanguageExtension[] {
    return ['js', 'java', 'c', 'cpp', 'py'];
  }

  invokeToolAnalysis(command: ToolCommand, analysisFolder?: PathLike): Promise<Log> {
    return Promise.resolve(undefined);
  }
}
