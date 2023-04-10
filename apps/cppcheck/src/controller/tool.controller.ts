import { Body, Controller, Post } from '@nestjs/common';
import { Log } from 'sarif';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { CppcheckToolService } from '../service/cppcheck.tool.service';

@Controller()
export class ToolController {
  constructor(private readonly cppcheckService: CppcheckToolService) {}

  @Post()
  async analyze(@Body() command: ToolCommand): Promise<Log> {
    return this.cppcheckService.analyze(command);
  }
}
