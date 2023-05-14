import ExecutorService from 'wrappers/common/service/executor.service';
import * as child_process from 'child_process';

jest.mock('child_process');

describe('ExecutorService', () => {
  let executorService: ExecutorService;

  beforeEach(() => {
    executorService = new ExecutorService();
  });

  afterEach(() => jest.resetAllMocks());

  describe('executeExecutable', () => {
    it('should execute the given executable and return its output', async () => {
      jest.mock('child_process');

      const path = 'path/to/executable';
      const executableCommand = 'some-command';
      const executableArguments = 'arg1 arg2';

      (child_process.exec as unknown as jest.Mock).mockImplementation((command, callback) => {
        callback(null, { stdout: 'pass!', stderr: '' });
      });

      const output = await executorService.executeExecutable(path, executableCommand, executableArguments);

      expect(child_process.exec as unknown as jest.Mock).toHaveBeenCalledWith(`${path} ${executableCommand} ${executableArguments}`, expect.anything());
      expect(output).toBe('pass!');
    });

    it('should throw an error if the command fails and allowFail is false', async () => {
      const path = 'path/to/executable';
      const executableCommand = 'some-command';
      const executableArguments = 'arg1 arg2';

      (child_process.exec as unknown as jest.Mock).mockImplementation((command, callback) => {
        callback(new Error('Error!'));
      });

      await expect(executorService.executeExecutable(path, executableCommand, executableArguments)).rejects.toThrowError('Error!');
      expect(child_process.exec as unknown as jest.Mock).toHaveBeenCalledWith(`${path} ${executableCommand} ${executableArguments}`, expect.anything());
    });

    it('should not throw an error if the command fails and allowFail is true', async () => {
      const path = 'path/to/executable';
      const executableCommand = 'some-command';
      const executableArguments = 'arg1 arg2';

      (child_process.exec as unknown as jest.Mock).mockImplementation((command, callback) => {
        callback(new Error('Error!'), { stdout: 'whoops!' });
      });

      const output = await executorService.executeExecutable(path, executableCommand, executableArguments, true);

      expect(child_process.exec as unknown as jest.Mock).toHaveBeenCalledWith(`${path} ${executableCommand} ${executableArguments}`, expect.anything());
      expect(output).toBe(undefined);
    });
  });

  describe('executeCommand', () => {
    it('should execute the given command and return its output', async () => {
      const command = 'some-command';
      const executableCommandArguments = 'arg1 arg2';

      (child_process.exec as unknown as jest.Mock).mockImplementation((command, callback) => {
        callback(null, { stdout: 'output' });
      });

      const output = await executorService.executeCommand(command, executableCommandArguments);

      expect(child_process.exec as unknown as jest.Mock).toHaveBeenCalledWith(`${command} ${executableCommandArguments}`, expect.anything());
      expect(output).toBe('output');
    });

    it('should throw an error if the command fails and allowFail is false', async () => {
      const command = 'some-command';
      const executableCommandArguments = 'arg1 arg2';

      (child_process.exec as unknown as jest.Mock).mockImplementation((command, callback) => {
        callback(new Error('Error!'));
      });

      await expect(executorService.executeCommand(command, executableCommandArguments)).rejects.toThrowError('Error!');
      expect(child_process.exec as unknown as jest.Mock).toHaveBeenCalledWith(`${command} ${executableCommandArguments}`, expect.anything());
    });

    it('should not throw an error if the command fails and allowFail is true', async () => {
      const command = 'some-command';
      const executableCommandArguments = 'arg1 arg2';

      (child_process.exec as unknown as jest.Mock).mockImplementation((command, callback) => {
        callback(new Error('Error!'), { stdout: 'whoops!' });
      });

      const output = await executorService.executeCommand(command, executableCommandArguments, true);

      expect(child_process.exec as unknown as jest.Mock).toHaveBeenCalledWith(`${command} ${executableCommandArguments}`, expect.anything());
      expect(output).toBe(undefined);
    });
  });
});
