import { Module } from '@nestjs/common';
import { CppcheckToolService } from './service/cppcheck.tool.service';
import { CommonModule } from 'wrappers/common/common.module';
import CppcheckToolRunConverter from './converter/cppcheck.tool.run.converter';

@Module({
  imports: [
    CommonModule.register({
      toolServiceProviderInfo: CppcheckToolService,
      toolRunConverterProviderInfo: CppcheckToolRunConverter,
      envFilePath: './apps/cppcheck/.env',
    }),
  ],
})
export class AppModule {}
