import { Module } from '@nestjs/common';
import { ToolController } from './controller/tool.controller';
import SonarqubeToolService from './services/sonarqube.tool.service';
import SonarqubeService from './services/sonarqube.service';
import LoginHolder from './holder/login.holder';
import { ConfigModule } from '@nestjs/config';
import ExecutorService from 'wrappers/common/service/executor.service';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: './apps/sonarqube/.env' })],
  controllers: [ToolController],
  providers: [SonarqubeToolService, SonarqubeService, ExecutorService, LoginHolder],
})
export class AppModule {}
