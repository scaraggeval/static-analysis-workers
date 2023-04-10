import { Body, Controller, Post } from '@nestjs/common';
import { Log } from 'sarif';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import SonarqubeToolService from '../services/sonarqube.tool.service';

@Controller()
export class ToolController {
  constructor(private readonly sonarqubeToolService: SonarqubeToolService) {}

  @Post()
  async analyze(@Body() command: ToolCommand): Promise<Log> {
    return this.sonarqubeToolService.analyze(command);
  }
}
