import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';
import { EnquiryType, FormData } from '../types';

@Injectable()
export class EmailService {
  async sendMail(emailTo: string, subject: string, body: string) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: process.env.USERNAME,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = await transporter.sendMail({
      from: `"Jacobs Properties" <${process.env.USERNAME}>`,
      to: emailTo,
      subject: subject,
      html: body,
    });

    console.log('Message sent: %s', mailOptions.messageId);
  }

  async emailToInternetRegistrations(
    data: Partial<FormData>,
    enquiryType: EnquiryType = 'Sales',
  ) {
    const { fullName, email, telephone, address } = data;
    const body = this.formatInternetRegistrationsBody(
      enquiryType,
      data,
      fullName,
      email,
      telephone,
      address,
    );

    await this.sendMail(
      'sales@jacobs.properties',
      'Website Registration',
      body,
    );
  }

  formatInternetRegistrationsBody(
    enquiryType: EnquiryType,
    data: Partial<FormData>,
    fullName?: string,
    email?: string,
    telephone?: string,
    address?: string,
  ) {
    return `
  Name: ${fullName ?? 'N/A'}<br>
  Address: ${address ?? 'N/A'}<br>
  E-mail: ${email ?? 'N/A'}<br>
  Mobile: ${telephone ?? 'N/A'}<br>
  Source: Website<br>
  Enquiry Type: ${enquiryType}<br>
  Message: ${this.stringifyObject(data)}<br>
  Marketing Consent Given: true<br>
    `;
  }

  stringifyObject(data: object, depth = 0) {
    let result = '';
    const indent = '  '.repeat(depth);

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'object') {
        result += `${indent}${key}:\n${this.stringifyObject(value, depth + 1)}`;
      } else {
        result += `${indent}${key}: ${value}\n`;
      }
    }
    console.log(result);
    return result;
  }
}
