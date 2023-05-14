import { HttpException, Logger } from '@nestjs/common';
import { Log } from 'sarif';
import { ToolCommand } from '../command/tool.command';
import AbstractToolService from './abstract.tool.service';
import FilesystemUtil from '../util/filesystem.util';

jest.mock('wrappers/common/util/filesystem.util');

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid'),
}));

describe('AbstractToolService', () => {
  beforeEach(() => {
    FilesystemUtil.createFile = jest.fn().mockResolvedValue((analysisFolderPath) => `codePath/${analysisFolderPath})`);
    FilesystemUtil.removeFolder = jest.fn();
  });

  it('should call analyseCode and return the result', async () => {
    class TestToolService extends AbstractToolService {
      protected readonly logger: Logger = new Logger(TestToolService.name);

      constructor(path?: string) {
        super(path);
      }

      public analyseCode = jest.fn().mockResolvedValue({} as Log);
      public requiresAnalysisFolder = jest.fn().mockReturnValue(true);
    }

    const testToolService = new TestToolService('code');
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'c' };

    const result = await testToolService.analyze(toolCommand);

    expect(result).toEqual({} as Log);
  });

  it('should call analyseCode with the command and analysisFolder if it requires analysis folder', async () => {
    class TestToolService extends AbstractToolService {
      protected readonly logger: Logger = new Logger(TestToolService.name);

      constructor(path?: string) {
        super(path);
      }

      public analyseCode = jest.fn().mockResolvedValue({} as Log);
      public requiresAnalysisFolder = jest.fn().mockReturnValue(true);
    }

    const testToolService = new TestToolService('code');
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'c' };

    await testToolService.analyze(toolCommand);

    expect(testToolService.analyseCode).toHaveBeenCalledWith(toolCommand, 'code/mock-uuid');
  });

  it("should call analyseCode with the command and undefined analysisFolder if it doesn't require analysis folder", async () => {
    class TestToolService extends AbstractToolService {
      protected readonly logger: Logger = new Logger(TestToolService.name);

      constructor(path?: string) {
        super(path);
      }

      public analyseCode = jest.fn().mockResolvedValue({} as Log);
      public requiresAnalysisFolder = jest.fn().mockReturnValue(false);
    }

    const testToolService = new TestToolService('code');
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'c' };

    await testToolService.analyze(toolCommand);

    expect(testToolService.analyseCode).toHaveBeenCalledWith(toolCommand, undefined);
  });

  it('should catch and handle exceptions thrown by analyseCode', async () => {
    class TestToolService extends AbstractToolService {
      protected readonly logger: Logger = new Logger(TestToolService.name);

      constructor(path?: string) {
        super(path);
      }

      public analyseCode = jest.fn().mockRejectedValue(new Error('error!'));
      public requiresAnalysisFolder = jest.fn().mockReturnValue(false);
    }

    const testToolService = new TestToolService('code');
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'c' };

    await expect(() => testToolService.analyze(toolCommand)).rejects.toThrow(HttpException);
  });

  it('should clean up the analysis folder if it was required', async () => {
    class TestToolService extends AbstractToolService {
      protected readonly logger: Logger = new Logger(TestToolService.name);

      constructor(path?: string) {
        super(path);
      }

      public analyseCode = jest.fn();
      public requiresAnalysisFolder = jest.fn().mockReturnValue(true);
    }

    const testToolService = new TestToolService('code');
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'c' };

    await testToolService.analyze(toolCommand);

    expect(FilesystemUtil.removeFolder).toHaveBeenCalledWith('code/mock-uuid');
  });

  it('should not clean up the analysis folder if it was not required', async () => {
    class TestToolService extends AbstractToolService {
      protected readonly logger: Logger = new Logger(TestToolService.name);

      constructor(path?: string) {
        super(path);
      }

      public analyseCode = jest.fn();
      public requiresAnalysisFolder = jest.fn().mockReturnValue(false);
    }

    const testToolService = new TestToolService('code');
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'c' };

    await testToolService.analyze(toolCommand);

    expect(FilesystemUtil.removeFolder).toHaveBeenCalledTimes(0);
  });

  it('should catch and clean up the analysis folder if it was required', async () => {
    class TestToolService extends AbstractToolService {
      protected readonly logger: Logger = new Logger(TestToolService.name);

      constructor(path?: string) {
        super(path);
      }

      public analyseCode = jest.fn().mockRejectedValue(new Error('error!'));
      public requiresAnalysisFolder = jest.fn().mockReturnValue(true);
    }

    const testToolService = new TestToolService('code');
    const toolCommand: ToolCommand = { code: '', encoded: true, languageExtension: 'c' };

    try {
      await testToolService.analyze(toolCommand);
    } catch (e) {}

    expect(FilesystemUtil.removeFolder).toHaveBeenCalledWith('code/mock-uuid');
  });
});
