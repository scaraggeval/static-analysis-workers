import { HttpException, HttpStatus } from '@nestjs/common';
import { LanguageExtension } from 'wrappers/common/types/types';

export const retrieveCompilerCommandData = (language: LanguageExtension, compilationTargetDirectory: string) => {
  switch (language) {
    case 'c':
      return 'gcc -fsyntax-only';
    case 'cpp':
      return 'gcc -fsyntax-only';
    case 'java':
      const targetDirectory = compilationTargetDirectory ? `-d ` + compilationTargetDirectory : '';

      return `javac ${targetDirectory}`;
    default:
      throw new HttpException({}, HttpStatus.BAD_REQUEST);
  }
};
