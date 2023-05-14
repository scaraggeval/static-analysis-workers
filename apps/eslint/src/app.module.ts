import { Module } from '@nestjs/common';
import { CommonModule } from 'wrappers/common/common.module';
import { EslintToolService } from './service/eslint.tool.service';

@Module({
  imports: [
    CommonModule.register({
      toolServiceProviderInfo: EslintToolService,
      envFilePath: './apps/eslint/.env',
    }),
  ],
})
export class AppModule {}
