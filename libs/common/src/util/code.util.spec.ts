import { PathLike } from 'fs';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import * as path from 'path';
import CodeUtil from 'wrappers/common/util/code.util';

jest.mock('wrappers/common/util/filesystem.util');

jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'test'),
}));

describe('CodeUtil', () => {
  describe('prepareCodeLocation', () => {
    const code = 'console.log("Hi!)';
    const javaLanguageExtension = 'java';
    const javascriptLanguageExtension = 'js';
    const codePath = './test';
    const codeFilePath = path.join(codePath, `test.${javascriptLanguageExtension}`);

    afterEach(() => {
      jest.resetAllMocks();
    });

    it('should prepare code location', async () => {
      const result: PathLike = await CodeUtil.prepareCodeLocation(code, javascriptLanguageExtension, codePath);

      expect(result).toEqual(codeFilePath as PathLike);

      expect(FilesystemUtil.createFolderIfNotExists).toHaveBeenCalledTimes(1);
      expect(FilesystemUtil.createFolderIfNotExists).toHaveBeenCalledWith(codePath);

      expect(FilesystemUtil.createFile).toHaveBeenCalledTimes(1);
      expect(FilesystemUtil.createFile).toHaveBeenCalledWith(codeFilePath, code);
    });

    it('should create a Java class with correct name', async () => {
      const javaCode = 'public class Hello {}';
      await CodeUtil.prepareCodeLocation(javaCode, javaLanguageExtension, codePath);

      expect(FilesystemUtil.createFile).toHaveBeenCalledTimes(1);
      expect(FilesystemUtil.createFile).toHaveBeenCalledWith(path.join(codePath, `Hello.${javaLanguageExtension}`), javaCode);
    });

    it('should throw an error if class name cannot be retrieved for Java code', async () => {
      await expect(CodeUtil.prepareCodeLocation('public class {}', javaLanguageExtension, codePath)).rejects.toThrow('Given java class is not correct!');
    });
  });
});
