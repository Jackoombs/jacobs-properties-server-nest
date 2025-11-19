import { Injectable } from '@nestjs/common';
import axios from 'axios';
import type { FormAddress } from '../types';
import FormData from 'form-data';

@Injectable()
export class FormService {
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
      return results;
    } else {
      throw new Error(errors.errors.message);
    }
  }
}
