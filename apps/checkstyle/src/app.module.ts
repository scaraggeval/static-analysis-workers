import { Module } from '@nestjs/common';
import { ToolController } from './controller/tool.controller';
import { ConfigModule } from '@nestjs/config';
import { CheckstyleToolService } from './service/checkstyle.tool.service';
import ExecutorService from 'wrappers/common/service/executor.service';
import * as process from 'process';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: process.env.NODE_ENV === 'production' ? './.env' : './apps/checkstyle/.env' })],
  controllers: [ToolController],
  providers: [CheckstyleToolService, ExecutorService],
})
export class AppModule {}
