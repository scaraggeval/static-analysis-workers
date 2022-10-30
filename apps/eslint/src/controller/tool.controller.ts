import { Body, Controller, Post } from '@nestjs/common';
import { EslintToolService } from '../service/eslint.tool.service';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { ToolResponse } from 'wrappers/common/response/tool.response';

@Controller()
export class ToolController {
  constructor(private readonly eslintService: EslintToolService) {}

  @Post()
  async analyze(@Body() command: ToolCommand): Promise<ToolResponse> {
    return this.eslintService.analyze(command);
  }
}
