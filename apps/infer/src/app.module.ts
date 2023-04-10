import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as process from 'process';
import ExecutorService from 'wrappers/common/service/executor.service';
import { ToolController } from './controller/tool.controller';
import { InferToolService } from './service/infer.tool.service';

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
