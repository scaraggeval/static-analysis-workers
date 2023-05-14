import { PathLike } from 'fs';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import * as path from 'path';
import { randomUUID } from 'crypto';

export default class CodeUtil {
  private static classNameRegex = /^.*(?:public\s+)?(?:class|interface|enum)\s+(?<className>[^\n\s{]*)/m;

  private static retrieveJavaClassName(code: string) {
    const matches = code.match(this.classNameRegex);

    if (!matches?.groups?.className) {
      throw new Error('Given java class is not correct!');
    }

    return matches.groups.className;
  }

  static optionalDecode(code: string, encoded: boolean) {
    return encoded ? Buffer.from(code, 'base64').toString() : code;
  }

  static async prepareCodeLocation(code: string, languageExtension: string, codePath: string, decode?: boolean): Promise<PathLike> {
    let preparedCode = code;

    if (decode) {
      preparedCode = this.optionalDecode(code, decode);
    }

    await FilesystemUtil.createFolderIfNotExists(codePath);

    const fileName = languageExtension === 'java' ? this.retrieveJavaClassName(preparedCode) : randomUUID();

    const codeFilePath = path.join(codePath, `${fileName}.${languageExtension}`);
    await FilesystemUtil.createFile(codeFilePath, preparedCode);

    return codeFilePath as PathLike;
  }
}
