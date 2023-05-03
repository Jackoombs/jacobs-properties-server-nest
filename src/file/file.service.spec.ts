import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from './file.service';
import * as path from 'path';
import * as fs from 'fs';

describe('FileService', () => {
  let service: FileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileService],
    }).compile();

    service = module.get<FileService>(FileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFilePath', () => {
    it('should return the base plus the file path of the input', () => {
      const fileName = 'fileName.txt';

      expect(service.getFilePath('fileName.txt')).toEqual(
        path.join(__dirname, '../data/data', fileName),
      );
    });
  });

  describe('getDirPath', () => {
    it('should return the data/data folder', () => {
      expect(service.getDirPath()).toEqual(
        path.join(__dirname, '../data/data'),
      );
    });
  });

  describe('createDir', () => {
    it('should create a directory in the specified folder', async () => {
      const dir = path.join(__dirname, '../data/data/mockDir');
      await service.createDir(dir);

      expect(fs.existsSync(dir)).toBeTruthy();

      fs.rmdirSync(dir);
    });

    it('should work recursively with nested folders', async () => {
      const dir = path.join(__dirname, '../data/data/mockDir');
      const nestedDir = path.join(dir, 'nestedDir');

      await service.createDir(nestedDir);

      expect(fs.existsSync(dir)).toBeTruthy();
      expect(fs.existsSync(nestedDir)).toBeTruthy();

      fs.rmdirSync(nestedDir);
      fs.rmdirSync(dir);
    });
  });
});
