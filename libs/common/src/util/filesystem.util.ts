import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import { PathLike } from 'fs';
import * as path from 'path';

export default class FilesystemUtil {
  private static readonly logger = new Logger(FilesystemUtil.name);

  static async checkFileOrFolder(targetPath: PathLike): Promise<boolean> {
    try {
      await fs.promises.access(targetPath, fs.constants.F_OK);

      return true;
    } catch {
      this.logger.verbose(`Target path ${targetPath} doesn't exists.`);

      return false;
    }
  }

  static async isFile(targetPath: PathLike) {
    const fileStatus = await fs.promises.lstat(targetPath);

    return fileStatus.isFile();
  }

  static async isSymbolicLink(targetPath: PathLike) {
    const fileStatus = await fs.promises.lstat(targetPath);

    return fileStatus.isSymbolicLink();
  }

  static async createFile(filePath: PathLike, content: string | Buffer) {
    let contentBuffer = content;

    if (typeof content === 'string') {
      contentBuffer = Buffer.from(content, 'utf-8');
    }

    await fs.promises.writeFile(filePath, contentBuffer);

    this.logger.verbose(`Created file ${filePath}`);
  }

  static async createFolder(folderPath: PathLike): Promise<void> {
    await fs.promises.mkdir(folderPath, { recursive: true });

    this.logger.verbose(`Created folder ${folderPath}`);
  }

  static async createFolderIfNotExists(folderPath: PathLike): Promise<void> {
    if (!(await this.checkFileOrFolder(folderPath))) {
      await this.createFolder(folderPath);
    }
  }

  static async removeFile(filePath: PathLike) {
    await fs.promises.unlink(filePath);

    this.logger.verbose(`Removed file ${filePath}`);
  }

  static async removeFolder(folderPath: PathLike) {
    await fs.promises.rm(folderPath, { recursive: true, force: true });

    this.logger.verbose(`Removed folder ${folderPath}`);
  }

  static async makeExecutable(targetPath: PathLike) {
    try {
      await this.chmodr(targetPath.toString());
    } catch (e) {
      this.logger.error(`Failed to change permission for: ${targetPath}. Exception: ${e}`);
    }
  }

  static async findFileWithExtensionInDirectory(targetDirectory: PathLike, extension: string): Promise<PathLike[]> {
    const files = await fs.promises.readdir(targetDirectory);

    return files.filter((value) => value.endsWith(extension));
  }

  private static async chmodr(currentPath: PathLike) {
    if (await FilesystemUtil.isSymbolicLink(currentPath)) {
      return;
    }

    if (await FilesystemUtil.isFile(currentPath)) {
      await fs.promises.chmod(currentPath, 0o777);

      return;
    }

    const files = await fs.promises.readdir(currentPath);
    files.forEach((value) => this.chmodr(path.join(currentPath.toString(), value)));
  }
}
