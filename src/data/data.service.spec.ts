import { Test, TestingModule } from '@nestjs/testing';
import { FileService } from '../file/file.service';
import { DataService } from './data.service';
import * as path from 'path';
import * as fs from 'fs';

describe('DataService', () => {
  let service: DataService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DataService, FileService],
    }).compile();

    service = module.get<DataService>(DataService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('readJsonFile', () => {
    it('should read a json file in the data folder', async () => {
      expect(await service.readJsonFile('mockRead.json')).toStrictEqual({
        test: {
          test1: 'This is mock data.',
        },
      });
    });

    it("should throw an error when file doesn't exist", async () => {
      expect.assertions(1);
      try {
        await service.readJsonFile('nonExistantFile.json');
      } catch (e) {
        expect(e.toString()).toContain(
          'Error: ENOENT: no such file or directory',
        );
      }
    });

    it('should throw an error when the data is not in JSON format', async () => {
      expect.assertions(1);
      try {
        await service.readJsonFile('mockRead.txt');
      } catch (error) {
        expect(error.toString()).toContain('SyntaxError: Unexpected token');
      }
    });
  });

  describe('writeJsonFile', () => {
    it('should write a new json file', async () => {
      const fileName = 'mockWrite.json';
      const mockFilePath = path.join(__dirname, 'data', fileName);
      const mockObject = {
        test: 'This is test data',
      };

      await service.writeJsonFile(fileName, mockObject);
      const fileContents = await fs.promises.readFile(mockFilePath, 'utf8');
      const resultObject = JSON.parse(fileContents);

      expect(resultObject).toStrictEqual(mockObject);

      await fs.promises.unlink(mockFilePath);
    });
  });
});
