import { Module } from '@nestjs/common';
import { ToolController } from './controller/tool.controller';
import { ConfigModule } from '@nestjs/config';
import { PmdToolService } from './service/pmd.tool.service';
import ExecutorService from 'wrappers/common/service/executor.service';
import * as process from 'process';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: process.env.NODE_ENV === 'production' ? './.env' : './apps/pmd/.env' })],
  controllers: [ToolController],
  providers: [PmdToolService, ExecutorService],
})
export class AppModule {}
