import { Language } from 'wrappers/common/types/types';
import { HttpException, HttpStatus } from '@nestjs/common';

export const retrieveCompilerCommandData = (language: Language, compilationTargetDirectory: string) => {
  switch (language) {
    case 'c':
      return 'gcc -fsyntax-only';
    case 'cpp':
      return 'gcc -fsyntax-only';
    case 'java':
      const targetDirectory = compilationTargetDirectory ? `-d ` + compilationTargetDirectory : '';

      return `javac ${targetDirectory}`;
    default:
      throw new HttpException({}, HttpStatus.BAD_REQUEST)
  }
};
