import { Injectable } from '@nestjs/common';
import { QueryParams } from '../types';

@Injectable()
export class UrlService {
  buildUrl(baseUrl: string, path = '/', queryParams?: QueryParams): string {
    const url = new URL(path, baseUrl);

    if (queryParams) {
      for (const [key, value] of Object.entries(queryParams)) {
        if (Array.isArray(value)) {
          for (const v of value) {
            url.searchParams.append(key, v.toString());
          }
        } else {
          url.searchParams.append(key, value.toString());
        }
      }
    }

    return url.toString();
  }
}
