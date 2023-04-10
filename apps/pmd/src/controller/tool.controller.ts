import { Body, Controller, Post } from '@nestjs/common';
import { Log } from 'sarif';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { PmdToolService } from '../service/pmd.tool.service';

@Controller()
export class ToolController {
  constructor(private readonly pmdService: PmdToolService) {}

  @Post()
  async analyze(@Body() command: ToolCommand): Promise<Log> {
    return this.pmdService.analyze(command);
  }
}
