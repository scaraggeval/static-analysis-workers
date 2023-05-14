import { Body, Controller, Post } from '@nestjs/common';
import { Log } from 'sarif';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import AnalysisService from 'wrappers/common/service/analysis.service';

@Controller()
export class ToolController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  async analyze(@Body() command: ToolCommand): Promise<Log> {
    return this.analysisService.analyze(command);
  }
}
