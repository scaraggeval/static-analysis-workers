import { Module } from '@nestjs/common';
import { CheckstyleToolService } from './service/checkstyle.tool.service';
import { CommonModule } from 'wrappers/common/common.module';

@Module({
  imports: [
    CommonModule.register({
      toolServiceProviderInfo: CheckstyleToolService,
      envFilePath: './apps/checkstyle/.env',
    }),
  ],
})
export class AppModule {}
