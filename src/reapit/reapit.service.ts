import { Injectable } from '@nestjs/common';
import path from 'path';
import { ReapitConnectServerSession } from '@reapit/connect-session';
import { QueryParams, ReapitServerSessionHeaders } from '../types';
import {
  PropertyImageModel,
  PropertyModel,
} from '@reapit/foundations-ts-definitions';
import { UrlService } from '../url/url.service';
import axios from 'axios';

@Injectable()
export class ReapitService {
  constructor(private readonly urlService: UrlService) {}

  private async getToken() {
    const reapitConnectSession: ReapitConnectServerSession =
      new ReapitConnectServerSession({
        connectClientId: process.env.CONNECT_CLIENT_ID,
        connectClientSecret: process.env.CONNECT_CLIENT_SECRET,
        connectOAuthUrl: process.env.CONNECT_OAUTH_URL,
      });
    const accessToken = await reapitConnectSession.connectAccessToken();
    return accessToken;
  }

  async fetchFromReapit(
    url: string,
    params = {},
  ): Promise<PropertyModel | PropertyModel[] | PropertyImageModel[]> {
    const defaultHeaders: ReapitServerSessionHeaders = {
      ['api-version']: '2020-01-31',
      ['Content-Type']: 'application/json',
      ['reapit-customer']: process.env.REAPIT_CUSTOMER,
    };
    const accessToken = await this.getToken();
    const res = await axios.get(url, {
      headers: {
        ...defaultHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
      params,
    });
    if (res.status === 200) {
      const data = res.data.id ? res.data : res.data._embedded;
      return data;
    } else {
      throw new Error('Data not found');
    }
  }

  async fetchProperty(propertyId: string): Promise<PropertyModel> {
    try {
      const urlPath = path.join('/properties', propertyId);
      const url = this.urlService.buildUrl(
        process.env.PLATFORM_API_URL,
        urlPath,
      );

      const property = (await this.fetchFromReapit(url, {
        embed: 'images',
      })) as PropertyModel;
      return property;
    } catch (error) {
      throw error;
    }
  }

  async fetchProperties(
    salesQueryParams: QueryParams,
    lettingsQueryParams: QueryParams,
  ): Promise<PropertyModel[]> {
    try {
      const salesUrl = this.urlService.buildUrl(
        process.env.PLATFORM_API_URL,
        '/properties',
      );

      const lettingsUrl = this.urlService.buildUrl(
        process.env.PLATFORM_API_URL,
        '/properties',
      );

      const salesProperties = (await this.fetchFromReapit(
        salesUrl,
        salesQueryParams,
      )) as PropertyModel[];
      const lettingsProperties = (await this.fetchFromReapit(
        lettingsUrl,
        lettingsQueryParams,
      )) as PropertyModel[];

      return [...salesProperties, ...lettingsProperties];
    } catch (error) {
      throw error;
    }
  }

  async deployFrontend() {
    await axios.get(
      'https://api.vercel.com/v1/integrations/deploy/prj_F0D98BtQnlDu3fu29cpc5Oox0ATX/YP9aF7lBJE',
    );
  }

  async fetchImages(queryParams: QueryParams): Promise<PropertyImageModel[]> {
    try {
      const url = this.urlService.buildUrl(
        process.env.PLATFORM_API_URL,
        '/propertyImages',
      );
      const images = (await this.fetchFromReapit(
        url,
        queryParams,
      )) as PropertyImageModel[];
      return images;
    } catch (error) {
      throw error;
    }
  }
}
