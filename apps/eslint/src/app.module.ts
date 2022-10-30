import { Module } from '@nestjs/common';
import { ToolController } from './controller/tool.controller';
import { EslintToolService } from './service/eslint.tool.service';

@Module({
  controllers: [ToolController],
  providers: [EslintToolService],
})
export class AppModule {}
