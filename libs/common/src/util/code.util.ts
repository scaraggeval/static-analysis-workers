import { Language } from 'wrappers/common/types/types';
import { PathLike } from 'fs';
import FilesystemUtil from 'wrappers/common/util/filesystem.util';
import * as path from 'path';
import { randomUUID } from 'crypto';
import { LANGUAGE_EXTENSION_MAP } from 'wrappers/common/constants/common';

export default class CodeUtil {
  static optionalDecode(code: string, encoded: boolean) {
    return encoded ? Buffer.from(code, 'base64').toString() : code;
  }

  static async prepareCodeLocation(code: string, language: Language, codePath: string, decode?: boolean): Promise<PathLike> {
    let preparedCode = code;

    if (decode) {
      preparedCode = this.optionalDecode(code, decode);
    }

    await FilesystemUtil.createFolderIfNotExists(codePath);

    const codeFilePath = path.join(codePath, `${randomUUID()}.${LANGUAGE_EXTENSION_MAP[language]}`);
    await FilesystemUtil.createFile(codeFilePath, preparedCode);

    return codeFilePath as PathLike;
  }
}
