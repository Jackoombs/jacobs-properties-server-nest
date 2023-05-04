import { Test, TestingModule } from '@nestjs/testing';
import { UrlService } from './url.service';
import { QueryParams } from '../types';

describe('UrlService', () => {
  let service: UrlService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlService],
    }).compile();

    service = module.get<UrlService>(UrlService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('buildUrl', () => {
    it('should build url with given path', () => {
      expect(service.buildUrl('https://test-site-name/', '/testPath')).toEqual(
        'https://test-site-name/testPath',
      );
    });

    it('should build url with simple queryParams', () => {
      const queryParams: QueryParams = {
        maxItems: 4,
        type: 'test',
      };

      expect(
        service.buildUrl('https://test-site-name/', '/testPath', queryParams),
      ).toEqual('https://test-site-name/testPath?maxItems=4&type=test');
    });

    it('should build url with array queryParams', () => {
      const queryParams: QueryParams = {
        maxItems: [1, 2, 3],
        type: ['test1', 'test2', 'test3'],
      };

      expect(
        service.buildUrl('https://test-site-name/', '/testPath', queryParams),
      ).toEqual(
        'https://test-site-name/testPath?maxItems=1&maxItems=2&maxItems=3&type=test1&type=test2&type=test3',
      );
    });
  });
});
