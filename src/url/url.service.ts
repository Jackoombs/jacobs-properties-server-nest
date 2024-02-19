import { Injectable } from '@nestjs/common';

@Injectable()
export class UrlService {
  buildUrl(baseUrl: string, path = '/'): string {
    const url = new URL(path, baseUrl);
    return url.toString();
  }
}
