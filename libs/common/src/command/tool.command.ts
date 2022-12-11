import { IsNotEmpty } from 'class-validator';
import { Language } from 'wrappers/common/types/types';

export class ToolCommand {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  language: Language;

  @IsNotEmpty()
  encoded: boolean;
}
