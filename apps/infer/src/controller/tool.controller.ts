import { Body, Controller, Post } from '@nestjs/common';
import { Log } from 'sarif';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { InferToolService } from '../service/infer.tool.service';

@Controller()
export class ToolController {
  constructor(private readonly inferService: InferToolService) {}

  @Post()
  async analyze(@Body() command: ToolCommand): Promise<Log> {
    return this.inferService.analyze(command);
  }
}
