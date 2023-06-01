import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Log } from 'sarif';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import AnalysisService from 'wrappers/common/service/analysis.service';

@Controller()
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post()
  @HttpCode(200)
  async analyze(@Body() command: ToolCommand): Promise<Log> {
    return this.analysisService.analyze(command);
  }
}
