import { IsNotEmpty } from 'class-validator';
import { FORMATS, LANGUAGES } from 'wrappers/common/constants/types';

export class ToolCommand {
  @IsNotEmpty()
  code: string;

  @IsNotEmpty()
  format: FORMATS;

  @IsNotEmpty()
  language: LANGUAGES;

  @IsNotEmpty()
  encoded: boolean;
}
