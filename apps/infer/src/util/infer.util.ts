import { Language } from 'wrappers/common/types/types';

export const retrieveCompilerCommandData = (language: Language, compilationTargetDirectory: string) => {
  if (language == 'java') {
    const targetDirectory = compilationTargetDirectory ? `-d ` + compilationTargetDirectory : '';

    return `javac ${targetDirectory}`;
  } else if (language == 'c') {
    return 'gcc -fsyntax-only';
  }
};
