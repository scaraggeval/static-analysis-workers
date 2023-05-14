import { IsNotEmpty } from 'class-validator';
import { LanguageExtension } from 'wrappers/common/types/types';

export class ToolCommand {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  languageExtension: LanguageExtension;

  @IsNotEmpty()
  encoded: boolean;
}
