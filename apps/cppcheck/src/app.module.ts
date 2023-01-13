import { Module } from '@nestjs/common';
import { ToolController } from './controller/tool.controller';
import { ConfigModule } from '@nestjs/config';
import { CppcheckToolService } from './service/cppcheck.tool.service';
import ExecutorService from 'wrappers/common/service/executor.service';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? './.env' : './apps/cppcheck/.env',
      expandVariables: true,
    }),
  ],
  controllers: [ToolController],
  providers: [CppcheckToolService, ExecutorService],
})
export class AppModule {}
