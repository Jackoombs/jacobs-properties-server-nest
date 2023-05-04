import { Injectable } from '@nestjs/common';
import { UrlService } from '../url/url.service';
import axios from 'axios';
import * as path from 'path';
import type { FormAddress } from '../types';
import * as FormData from 'form-data';
import { FormData as FormDataType } from '../types';

@Injectable()
export class FormService {
  constructor(private readonly urlService: UrlService) {}

  async postToIntegratedMarketing(
    service: string,
    data: Partial<FormDataType>,
  ) {
    const baseUrl = 'https://jacobsproperties.api.integratedinterest.com';
    const endpoint = path.join('/form', service);
    const urlWithEndPoint = this.urlService.buildUrl(baseUrl, endpoint);

    return await axios.post(urlWithEndPoint, data, {
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.INTEGRATEDMARKETING_KEY,
      },
    });
  }

  async getValPalValuation(address: FormAddress, type: 'lettings' | 'sales') {
    const formData = new FormData();
    formData.append('username', process.env.VALPAL_USERNAME);
    formData.append('pass', process.env.VALPAL_PASSWORD);
    formData.append('bedrooms', address.bedrooms);
    formData.append('propertytype', address.propertyType);
    formData.append('number', address.houseNumber);
    formData.append('street', address.street);
    formData.append('postcode', address.postcode);
    formData.append('reference', '');
    formData.append('buildname', address.houseName);
    formData.append('subBname', address.apartment);
    formData.append('deptstreet', address.dependantStreet);
    formData.append('type', type);

    const valpalRes = await axios.post(
      'https://www.valpal.co.uk/apiforvaluation',
      formData,
      {
        headers: formData.getHeaders(),
      },
    );
    const [status, errors, results] = valpalRes.data;

    if (status.status === 'success') {
      return results.results.valuation.replace('&pound;', '£') as string;
    } else {
      throw new Error(errors.errors.message);
    }
  }
}
