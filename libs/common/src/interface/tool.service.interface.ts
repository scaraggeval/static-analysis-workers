import { ToolCommand } from 'wrappers/common/command/tool.command';
import { PathLike } from 'fs';
import { Log } from 'sarif';
import { LanguageExtension } from 'wrappers/common/types/types';

export interface ToolService {
  invokeToolAnalysis(command: ToolCommand, analysisFolder?: PathLike): Promise<Log>;

  getAnalysisFolderBase(): string | undefined;

  getSupportedLanguageExtensions(): LanguageExtension[];
}

export const ToolService = Symbol('ToolService');
