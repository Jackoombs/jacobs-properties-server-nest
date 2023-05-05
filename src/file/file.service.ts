import { Injectable } from '@nestjs/common';
import path from 'path';
import fs from 'fs';

@Injectable()
export class FileService {
  private readonly baseDir: string = path.join(__dirname, '../data/data');

  getFilePath(fileName: string): string {
    return path.join(this.baseDir, fileName);
  }

  getDirPath(): string {
    return this.baseDir;
  }

  async createDir(dirPath: string) {
    try {
      fs.mkdirSync(dirPath, { recursive: true });
    } catch (error) {
      throw error;
    }
  }

  removeExtension(fileName: string): string {
    const index = fileName.lastIndexOf('.');
    if (index !== -1) {
      return fileName.slice(0, index);
    } else {
      return fileName;
    }
  }
}
