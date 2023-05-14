import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import ExecutorService from 'wrappers/common/service/executor.service';
import { ToolController } from 'wrappers/common/controller/tool.controller';
import AnalysisService from 'wrappers/common/service/analysis.service';
import { ToolService } from 'wrappers/common/interface/tool.service.interface';
import { ConfigModule } from '@nestjs/config';
import MockToolRunConverter from 'wrappers/common/converter/mock.tool.run.converter';
import { ToolRunConverter } from 'wrappers/common/interface/tool.run.converter.interface';
import SarifConverterService from 'wrappers/common/service/sarif.converter.service';

type CommonModuleOptions = {
  toolServiceProviderInfo: Type;
  toolRunConverterProviderInfo?: Type;
  additionalProviders?: Provider[];
  envFilePath?: string;
};

@Module({})
export class CommonModule {
  static register(options: CommonModuleOptions): DynamicModule {
    return {
      module: CommonModule,
      imports: [
        ConfigModule.forRoot({
          envFilePath: options.envFilePath && process.env.NODE_ENV === 'production' ? './.env' : options.envFilePath,
          expandVariables: options.envFilePath && true,
        }),
      ],
      controllers: [ToolController],
      providers: [
        ...(options.additionalProviders || []),
        {
          provide: ToolService,
          useClass: options.toolServiceProviderInfo,
        },
        {
          provide: ToolRunConverter,
          useClass: options.toolRunConverterProviderInfo ?? MockToolRunConverter,
        },
        AnalysisService,
        SarifConverterService,
        ExecutorService,
      ],
    };
  }
}
