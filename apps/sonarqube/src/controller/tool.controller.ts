import { Body, Controller, Post } from '@nestjs/common';
import SonarqubeToolService from '../services/sonarqube.tool.service';
import { ToolCommand } from 'wrappers/common/command/tool.command';
import { ToolResponse } from 'wrappers/common/response/tool.response';

@Controller()
export class ToolController {
  constructor(private readonly sonarqubeToolService: SonarqubeToolService) {}

  @Post()
  async analyze(@Body() command: ToolCommand): Promise<ToolResponse> {
    return this.sonarqubeToolService.analyze(command);
  }
}
