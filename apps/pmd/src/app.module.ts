import { Module } from '@nestjs/common';
import { CommonModule } from 'wrappers/common/common.module';
import { PmdToolService } from './service/pmd.tool.service';

@Module({
  imports: [
    CommonModule.register({
      toolServiceProviderInfo: PmdToolService,
      envFilePath: './apps/pmd/.env',
    }),
  ],
})
export class AppModule {}
