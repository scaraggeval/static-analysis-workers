import { Body, Controller, Post } from '@nestjs/common';
import { Log } from 'sarif';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { CheckstyleToolService } from '../service/checkstyle.tool.service';

@Controller()
export class ToolController {
  constructor(private readonly checkstyleService: CheckstyleToolService) {}

  @Post()
  async analyze(@Body() command: ToolCommand): Promise<Log> {
    return this.checkstyleService.analyze(command);
  }
}
