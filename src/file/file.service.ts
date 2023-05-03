import { Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

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
}
