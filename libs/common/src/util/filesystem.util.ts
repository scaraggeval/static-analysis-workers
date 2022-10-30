import { Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export default class FilesystemUtil {
  private static readonly logger = new Logger(FilesystemUtil.name);

  static async checkFileOrFolder(targetPath: string): Promise<boolean> {
    try {
      await fs.promises.access(targetPath, fs.constants.F_OK);

      return true;
    } catch {
      this.logger.debug(`Target path ${targetPath} doesn't exists.`);

      return false;
    }
  }

  static async isFile(targetPath: string) {
    const fileStatus = await fs.promises.lstat(targetPath);

    return fileStatus.isFile();
  }

  static async createFile(filePath: string, content: string) {
    const contentBuffer = Buffer.from(content, 'utf-8');
    await fs.promises.writeFile(filePath, contentBuffer);

    this.logger.debug(`Created file ${filePath}`);
  }

  static async createFolder(folderPath: string): Promise<void> {
    await fs.promises.mkdir(folderPath, { recursive: true });

    this.logger.debug(`Created folder ${folderPath}`);
  }

  static async createFolderIfNotExists(folderPath: string): Promise<void> {
    if (!(await this.checkFileOrFolder(folderPath))) {
      await this.createFolder(folderPath);
    }
  }

  static async removeFile(filePath: string) {
    await fs.promises.unlink(filePath);

    this.logger.debug(`Removed file ${filePath}`);
  }

  static async removeFolder(folderPath: string) {
    await fs.promises.rm(folderPath, { recursive: true, force: true });

    this.logger.debug(`Removed folder ${folderPath}`);
  }

  static getDirectory(directory: string) {
    return path.join(process.cwd(), directory);
  }

  static async makeExecutable(targetPath: string) {
    try {
      await this.chmodr(targetPath);
    } catch (e) {
      this.logger.error(`Failed to change permission for: ${targetPath}. Exception: ${e}`);
    }
  }

  private static async chmodr(currentPath: string) {
    if (await FilesystemUtil.isFile(currentPath)) {
      await fs.promises.chmod(currentPath, 0o777);

      return;
    }

    const files = await fs.promises.readdir(currentPath);
    files.forEach((value) => this.chmodr(path.join(currentPath, value)));
  }
}
