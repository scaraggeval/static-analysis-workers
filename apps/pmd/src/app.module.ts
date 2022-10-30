import { Module } from '@nestjs/common';
import { ToolController } from './controller/tool.controller';
import { ConfigModule } from '@nestjs/config';
import { PmdToolService } from './service/pmd.tool.service';
import ExecutorService from 'wrappers/common/service/executor.service';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: './apps/pmd/.env' })],
  controllers: [ToolController],
  providers: [PmdToolService, ExecutorService],
})
export class AppModule {}
