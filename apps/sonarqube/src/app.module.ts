import { Module } from '@nestjs/common';
import { ToolController } from './controller/tool.controller';
import SonarqubeToolService from './services/sonarqube.tool.service';
import SonarqubeService from './services/sonarqube.service';
import LoginHolder from './holder/login.holder';
import { ConfigModule } from '@nestjs/config';
import ExecutorService from 'wrappers/common/service/executor.service';
import SonarqubeConverter from './converter/sonarqube.converter';
import * as process from 'process';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: process.env.NODE_ENV === 'production' ? './.env' : './apps/sonarqube/.env' })],
  controllers: [ToolController],
  providers: [SonarqubeToolService, SonarqubeService, ExecutorService, SonarqubeConverter, LoginHolder],
})
export class AppModule {}
