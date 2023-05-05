import { Injectable } from '@nestjs/common';
import path from 'path';
import { ReapitConnectServerSession } from '@reapit/connect-session';
import { QueryParams, ReapitServerSessionHeaders } from '../types';
import { PropertyModel } from '@reapit/foundations-ts-definitions';
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

  async fetchFromReapit(url: string): Promise<PropertyModel | PropertyModel[]> {
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
    });
    if (res.status === 200) {
      const propertyRes = res.data.id ? res.data : res.data._embedded;
      return propertyRes;
    } else {
      throw new Error('Properties not found');
    }
  }

  async fetchProperty(propertyId: string): Promise<PropertyModel> {
    try {
      const urlPath = path.join('/properties', propertyId);
      const url = this.urlService.buildUrl(
        process.env.PLATFORM_API_URL,
        urlPath,
        {
          embed: 'images',
        },
      );

      const property = (await this.fetchFromReapit(url)) as PropertyModel;
      return property;
    } catch (error) {
      throw error;
    }
  }

  async fetchProperties(queryParams: QueryParams): Promise<PropertyModel[]> {
    try {
      const url = this.urlService.buildUrl(
        process.env.PLATFORM_API_URL,
        '/properties',
        queryParams,
      );
      const property = (await this.fetchFromReapit(url)) as PropertyModel[];
      return property;
    } catch (error) {
      throw error;
    }
  }
}
