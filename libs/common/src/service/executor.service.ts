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

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  async executeCommand(path: string, command = '', commandArguments = ''): Promise<string> {
    try {
      const startTime = process.hrtime();
      const result = await this.execute(`${path} ${command} ${commandArguments}`);
      const elapsedSeconds = this.parseHrtimeToSeconds(process.hrtime(startTime));

      this.logger.debug(`Execution time took ${elapsedSeconds} seconds`);

      return result.stdout;
    } catch (e) {
      this.logger.error(`Error occurred while executing command ${command} with arguments ${commandArguments} for path ${path}. Error is:\n${e}`);
      return e;
    }
  }

  private parseHrtimeToSeconds(hrtime) {
    return (hrtime[0] + hrtime[1] / 1e9).toFixed(3);
  }
}
