import { Body, Controller, Post } from '@nestjs/common';
import { Log } from 'sarif';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { EslintToolService } from '../service/eslint.tool.service';

@Controller()
export class ToolController {
  constructor(private readonly eslintService: EslintToolService) {}

  @Post()
  async analyze(@Body() command: ToolCommand): Promise<Log> {
    return this.eslintService.analyze(command);
  }
}
