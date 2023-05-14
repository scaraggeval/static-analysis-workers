import { HttpException } from '@nestjs/common';
import { Log } from 'sarif';
import { ToolCommand } from '../command/tool.command';
import FilesystemUtil from '../util/filesystem.util';
import { ToolService } from 'wrappers/common/interface/tool.service.interface';
import AnalysisService from 'wrappers/common/service/analysis.service';

jest.mock('wrappers/common/util/filesystem.util');

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid'),
}));

jest.mock('process', () => ({
  cwd: () => 'path',
}));

describe('AnalysisService', () => {
  let analysisService: AnalysisService;
  let toolService: ToolService;

  beforeEach(() => {
    FilesystemUtil.createFile = jest.fn().mockResolvedValue((analysisFolderPath) => `codePath/${analysisFolderPath})`);
    FilesystemUtil.removeFolder = jest.fn();

    toolService = {
      getSupportedLanguageExtensions: jest.fn().mockReturnValue(['js']),
      getAnalysisFolderBase: jest.fn(),
      invokeToolAnalysis: jest.fn().mockResolvedValue({} as Log),
    } as unknown as ToolService;

    analysisService = new AnalysisService(toolService);
  });

  it('should throw HttpException for unsupported extension', async () => {
    (toolService.getSupportedLanguageExtensions as jest.Mock).mockReturnValue(['js']);
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'c' };

    await expect(() => analysisService.analyze(toolCommand)).rejects.toThrow(HttpException);
  });

  it('should call invokeTool and return the result', async () => {
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'js' };

    const result = await analysisService.analyze(toolCommand);

    expect(result).toEqual({} as Log);
  });

  it('should call invokeTool with the command and analysisFolder if toolService supplies analysisFolderBase', async () => {
    (toolService.getAnalysisFolderBase as jest.Mock).mockReturnValue('code');
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'js' };

    await analysisService.analyze(toolCommand);

    expect(toolService.invokeToolAnalysis).toHaveBeenCalledWith(toolCommand, 'path/code/mock-uuid');
  });

  it('should call invokeTool with the command and undefined analysisFolder if toolService does not supply analysisFolderBase', async () => {
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'js' };

    await analysisService.analyze(toolCommand);

    expect(toolService.invokeToolAnalysis).toHaveBeenCalledWith(toolCommand, undefined);
  });

  it('should catch and handle exceptions thrown by invokeTool', async () => {
    (toolService.invokeToolAnalysis as jest.Mock).mockRejectedValue(new Error('error!'));
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'js' };

    await expect(() => analysisService.analyze(toolCommand)).rejects.toThrow(HttpException);
  });

  it('should clean up the analysis folder if it was required', async () => {
    (toolService.getAnalysisFolderBase as jest.Mock).mockReturnValue('code');
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'js' };

    await analysisService.analyze(toolCommand);

    expect(FilesystemUtil.removeFolder).toHaveBeenCalledWith('path/code/mock-uuid');
  });

  it('should not clean up the analysis folder if it was not required', async () => {
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'js' };

    await analysisService.analyze(toolCommand);

    expect(FilesystemUtil.removeFolder).toHaveBeenCalledTimes(0);
  });

  it('should catch and clean up the analysis folder if it was required', async () => {
    (toolService.getAnalysisFolderBase as jest.Mock).mockReturnValue('code');
    (toolService.invokeToolAnalysis as jest.Mock).mockRejectedValue(new Error('error!'));
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'js' };

    try {
      await analysisService.analyze(toolCommand);
    } catch (e) {}

    expect(FilesystemUtil.removeFolder).toHaveBeenCalledWith('path/code/mock-uuid');
  });
});
