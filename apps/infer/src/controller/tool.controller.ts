import { Body, Controller, Post } from '@nestjs/common';
import { InferToolService } from '../service/infer.tool.service';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { ToolResponse } from 'wrappers/common/response/tool.response';

@Controller()
export class ToolController {
  constructor(private readonly inferService: InferToolService) {}

  @Post()
  async analyze(@Body() command: ToolCommand): Promise<ToolResponse> {
    return this.inferService.analyze(command);
  }
}
