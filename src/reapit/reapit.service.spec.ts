import { Test, TestingModule } from '@nestjs/testing';
import { ReapitService } from './reapit.service';
import MockAdaptor from 'axios-mock-adapter';
import { mockData } from './mockPropertyData';
import axios from 'axios';
import { ReapitConnectServerSession } from '@reapit/connect-session';
import { UrlService } from '../url/url.service';

describe('ReapitService', () => {
  let service: ReapitService;
  const mockUrl = 'https://mockUrl.com/';
  const mockUrlService = { buildUrl: jest.fn().mockReturnValue(mockUrl) };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReapitService,
        { provide: UrlService, useValue: mockUrlService },
      ],
    })
      .useMocker((token) => {
        if (token === 'UrlService') {
          return;
        }
      })
      .compile();

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

      service.fetchFromReapit = mockFetchFromReapit;
      await service.fetchProperty('123');
      expect(mockUrlService.buildUrl).toHaveBeenCalled();
      expect(mockFetchFromReapit).toHaveBeenCalledWith(mockUrl);
    });

    it('should return the property', async () => {
      const mockFetchFromReapit = jest.fn().mockReturnValue(mockData.property);
      service.fetchFromReapit = mockFetchFromReapit;

      expect(await service.fetchProperty('123')).toStrictEqual(
        mockData.property,
      );
    });

    it('should catch an error when fetch fails', async () => {
      const mockFetchFromReapit = jest.fn(() =>
        Promise.reject(new Error('fetch error')),
      );
      service.fetchFromReapit = mockFetchFromReapit;

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
      service.fetchFromReapit = mockFetchFromReapit;

      await service.fetchProperties({ queryParams: true });
      expect(mockFetchFromReapit).toHaveBeenCalledWith(mockUrl);
    });

    it('should return the property', async () => {
      const mockFetchFromReapit = jest
        .fn()
        .mockReturnValue(mockData.properties);
      service.fetchFromReapit = mockFetchFromReapit;

      expect(await service.fetchProperties({ queryParam: true })).toStrictEqual(
        mockData.properties,
      );
    });

    it('should catch an error when fetch fails', async () => {
      const mockFetchFromReapit = jest.fn(() =>
        Promise.reject(new Error('fetch error')),
      );
      service.fetchFromReapit = mockFetchFromReapit;

      expect.assertions(1);
      try {
        await service.fetchProperties({ queryParams: true });
      } catch (error) {
        expect(error.toString()).toContain('Error: fetch error');
      }
    });
  });
});
