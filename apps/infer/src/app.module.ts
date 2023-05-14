import { Module } from '@nestjs/common';
import { CommonModule } from 'wrappers/common/common.module';
import { InferToolService } from './service/infer.tool.service';
import InferConverter from './converter/infer.converter';

@Module({
  imports: [
    CommonModule.register({
      toolServiceProviderInfo: InferToolService,
      toolRunConverterProviderInfo: InferConverter,
      envFilePath: './apps/infer/.env',
    }),
  ],
})
export class AppModule {}
