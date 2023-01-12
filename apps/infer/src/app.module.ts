import { Module } from '@nestjs/common';
import { ToolController } from './controller/tool.controller';
import { ConfigModule } from '@nestjs/config';
import { InferToolService } from './service/infer.tool.service';
import ExecutorService from 'wrappers/common/service/executor.service';
import * as process from 'process';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: process.env.NODE_ENV === 'production' ? './.env' : './apps/infer/.env',
      expandVariables: true,
    }),
  ],
  controllers: [ToolController],
  providers: [InferToolService, ExecutorService],
})
export class AppModule {}
