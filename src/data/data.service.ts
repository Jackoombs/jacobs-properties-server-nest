import { Injectable } from '@nestjs/common';
import { FileService } from '../file/file.service';
import fs from 'fs';

@Injectable()
export class DataService {
  constructor(private readonly fileService: FileService) {}

  async readJsonFile<T>(fileName: string): Promise<T> {
    try {
      const filePath = this.fileService.getFilePath(fileName);
      const fileData = fs.readFileSync(filePath, 'utf8');
      const jsonData: T = JSON.parse(fileData);
      return jsonData;
    } catch (error) {
      throw error;
    }
  }

  async writeJsonFile(filename: string, jsonData: object) {
    try {
      const filePath = this.fileService.getFilePath(filename);
      const dirPath = this.fileService.getDirPath();
      await this.fileService.createDir(dirPath);

      const fileData = JSON.stringify(jsonData, null, 2);
      await fs.promises.writeFile(filePath, fileData, 'utf8');
    } catch (error) {
      throw error;
    }
  }
}
