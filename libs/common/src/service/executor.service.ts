import { Injectable, Logger } from '@nestjs/common';
import { promisify } from 'util';
import { exec, PromiseWithChild } from 'child_process';

@Injectable()
export default class ExecutorService {
  private readonly execute: (arg0: string) => PromiseWithChild<{ stdout: string; stderr: string }>;
  private readonly logger = new Logger(ExecutorService.name);

  constructor() {
    this.execute = promisify(exec);
  }

  async executeExecutable(path: string, executableCommand = '', executableArguments = '', allowFail = false): Promise<string> {
    return this.timedExecute(`${path} ${executableCommand} ${executableArguments}`, allowFail);
  }

  async executeCommand(command: string, executableCommandArguments = '', allowFail = false): Promise<string> {
    return this.timedExecute(`${command} ${executableCommandArguments}`, allowFail);
  }

  private async timedExecute(command: string, allowFail = false): Promise<string> {
    let successful = true;
    const startTime = process.hrtime();

    try {
      this.logger.verbose(`Executing: \n${command}`);

      const result = await this.execute(command);

      return result.stdout;
    } catch (e) {
      if (!allowFail) {
        successful = false;

        throw e;
      } else {
        return e.stdout;
      }
    } finally {
      const elapsedSeconds = this.parseHrtimeToSeconds(process.hrtime(startTime));

      this.logger.debug(`Execution time took ${elapsedSeconds} seconds and was ${successful ? 'successful' : 'unsuccessful'}.`);
    }
  }

  private parseHrtimeToSeconds(hrtime: [number, number]) {
    return (hrtime[0] + hrtime[1] / 1e9).toFixed(3);
  }
}
