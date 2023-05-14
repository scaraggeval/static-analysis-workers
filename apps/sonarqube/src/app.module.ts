import { Module } from '@nestjs/common';
import SonarqubeToolService from './services/sonarqube.tool.service';
import SonarqubeService from './services/sonarqube.service';
import LoginHolder from './holder/login.holder';
import SonarqubeConverter from './converter/sonarqube.converter';
import { CommonModule } from 'wrappers/common/common.module';

@Module({
  imports: [
    CommonModule.register({
      toolServiceProvider: SonarqubeToolService,
      toolRunConverterProvider: SonarqubeConverter,
      additionalProviders: [SonarqubeService, LoginHolder],
      envFilePath: './apps/sonarqube/.env',
    }),
  ],
})
export class AppModule {}
