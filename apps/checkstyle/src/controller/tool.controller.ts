import { Body, Controller, Post } from '@nestjs/common';
import { CheckstyleToolService } from '../service/checkstyle.tool.service';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { ToolResponse } from 'wrappers/common/response/tool.response';

@Controller()
export class ToolController {
  constructor(private readonly checkstyleService: CheckstyleToolService) {}

  @Post()
  async analyze(@Body() command: ToolCommand): Promise<ToolResponse> {
    return this.checkstyleService.analyze(command);
  }
}
