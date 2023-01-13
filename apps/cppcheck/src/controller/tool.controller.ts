import { Body, Controller, Post } from '@nestjs/common';
import { CppcheckToolService } from '../service/cppcheck.tool.service';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { ToolResponse } from 'wrappers/common/response/tool.response';

@Controller()
export class ToolController {
  constructor(private readonly cppcheckService: CppcheckToolService) {}

  @Post()
  async analyze(@Body() command: ToolCommand): Promise<ToolResponse> {
    return this.cppcheckService.analyze(command);
  }
}
