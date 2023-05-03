import { Test, TestingModule } from '@nestjs/testing';
import { QueryParams } from 'src/types';
import { ReapitService } from './reapit.service';
import MockAdaptor from 'axios-mock-adapter';
import { mockData } from './mockPropertyData';
import axios from 'axios';
import { ReapitConnectServerSession } from '@reapit/connect-session';

describe('ReapitService', () => {
  let service: ReapitService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReapitService],
    }).compile();

    service = module.get<ReapitService>(ReapitService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fetchFromReapit', () => {
    const mockAccessToken = 'mock_access_token';
    const connectAccessTokenSpy = jest
      .spyOn(ReapitConnectServerSession.prototype, 'connectAccessToken')
      .mockResolvedValue(mockAccessToken);

    it('should get access token and call axios request function once', async () => {
      const mock = new MockAdaptor(axios);
      const url = 'https://mockUrl.com/fakeEndpoint';
      mock.onGet(url).reply(200, mockData.property);
      const spy = jest.spyOn(axios, 'get');

      await service.fetchFromReapit(url);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(connectAccessTokenSpy).toHaveBeenCalledTimes(1);
    });

    it('should return single property for single property request', async () => {
      const mock = new MockAdaptor(axios);
      const url = 'https://mockUrl.com/properties/id';
      mock.onGet(url).reply(200, mockData.property);

      expect(await service.fetchFromReapit(url)).toEqual(mockData.property);
    });

    it('should return array of properties for multiple property request', async () => {
      const mock = new MockAdaptor(axios);
      const url = 'https://mockUrl.com/properties';
      mock.onGet(url).reply(200, mockData.properties);

      expect(await service.fetchFromReapit(url)).toStrictEqual(
        mockData.properties._embedded,
      );
    });
  });

  describe('fetchProperty', () => {
    it('should call the dependant functions once', async () => {
      const mockFetchFromReapit = jest.fn();
      const mockBuildUrl = jest
        .fn()
        .mockReturnValue('https://test123/properties/123');

      service.fetchFromReapit = mockFetchFromReapit;
      service.buildUrl = mockBuildUrl;
      await service.fetchProperty('123');
      expect(mockBuildUrl).toHaveBeenCalledWith(undefined, '/properties/123');
      expect(mockFetchFromReapit).toHaveBeenCalledWith(
        'https://test123/properties/123',
      );
    });

    it('should return the property', async () => {
      const mockFetchFromReapit = jest.fn().mockReturnValue(mockData.property);
      const mockBuildUrl = jest.fn();

      service.fetchFromReapit = mockFetchFromReapit;
      service.buildUrl = mockBuildUrl;

      expect(await service.fetchProperty('123')).toStrictEqual(
        mockData.property,
      );
    });

    it('should catch an error when fetch fails', async () => {
      const mockFetchFromReapit = jest.fn(() =>
        Promise.reject(new Error('fetch error')),
      );
      const mockBuildUrl = jest.fn();

      service.fetchFromReapit = mockFetchFromReapit;
      service.buildUrl = mockBuildUrl;

      expect.assertions(1);
      try {
        await service.fetchProperty('123');
      } catch (error) {
        expect(error.toString()).toContain('Error: fetch error');
      }
    });
  });

  describe('fetchProperties', () => {
    it('should call the dependant functions once', async () => {
      const mockFetchFromReapit = jest.fn();
      const mockBuildUrl = jest
        .fn()
        .mockReturnValue('https://test123/properties');

      service.fetchFromReapit = mockFetchFromReapit;
      service.buildUrl = mockBuildUrl;

      await service.fetchProperties({ queryParams: true });
      expect(mockBuildUrl).toHaveBeenCalledWith(undefined, '/properties', {
        queryParams: true,
      });
      expect(mockFetchFromReapit).toHaveBeenCalledWith(
        'https://test123/properties',
      );
    });

    it('should return the property', async () => {
      const mockFetchFromReapit = jest
        .fn()
        .mockReturnValue(mockData.properties);
      const mockBuildUrl = jest.fn();

      service.fetchFromReapit = mockFetchFromReapit;
      service.buildUrl = mockBuildUrl;

      expect(await service.fetchProperties({ queryParam: true })).toStrictEqual(
        mockData.properties,
      );
    });

    it('should catch an error when fetch fails', async () => {
      const mockFetchFromReapit = jest.fn(() =>
        Promise.reject(new Error('fetch error')),
      );
      const mockBuildUrl = jest.fn();

      service.fetchFromReapit = mockFetchFromReapit;
      service.buildUrl = mockBuildUrl;

      expect.assertions(1);
      try {
        await service.fetchProperties({ queryParams: true });
      } catch (error) {
        expect(error.toString()).toContain('Error: fetch error');
      }
    });
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
