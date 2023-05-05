import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { EmailService } from '../email/email.service';
import {
  BookAViewing,
  EarlyBird,
  EnquiryType,
  ExpertValuation,
  GetInTouch,
  InstantValuation,
  MakeAnOffer,
} from '../types';
import { FormService } from './form.service';

@Controller('form')
export class FormController {
  constructor(
    private readonly formService: FormService,
    private readonly emailService: EmailService,
  ) {}

  @Post('/bookaviewing')
  async bookAViewing(@Body() data: BookAViewing) {
    try {
      await this.emailService.emailToInternetRegistrations(data);
      await this.formService.postToIntegratedMarketing('bookaviewing', data);
    } catch (error) {
      throw new BadRequestException('Something went wrong', {
        cause: new Error(),
        description: error.message,
      });
    }
  }
  @Post('/makeanoffer')
  async makeAnOffer(@Body() data: MakeAnOffer) {
    try {
      await this.emailService.emailToInternetRegistrations(data);
      await this.formService.postToIntegratedMarketing('makeanoffer', data);
    } catch (error) {
      throw new BadRequestException('Something went wrong', {
        cause: new Error(),
        description: error.message,
      });
    }
  }

  @Post('/getintouch')
  async getInTouch(@Body() data: GetInTouch) {
    try {
      await this.emailService.emailToInternetRegistrations(data);
      await this.formService.postToIntegratedMarketing('getintouch', data);
    } catch (error) {
      throw new BadRequestException('Something went wrong', {
        cause: new Error(),
        description: error.message,
      });
    }
  }
  @Post('/expertvaluation')
  async expertValuation(@Body() data: ExpertValuation) {
    try {
      const enquiryType: EnquiryType =
        data.buyOrRent === 'rent' ? 'Sales Valuation' : 'Lettings Valuation';
      await this.emailService.emailToInternetRegistrations(data, enquiryType);
      await this.formService.postToIntegratedMarketing('expertvaluation', data);
    } catch (error) {
      throw new BadRequestException('Something went wrong', {
        cause: new Error(),
        description: error.message,
      });
    }
  }
  @Post('/instantvaluation')
  async instantValuation(@Body() data: InstantValuation) {
    try {
      const type = data.buyOrRent === 'buy' ? 'sales' : 'lettings';
      const enquiryType: EnquiryType =
        data.buyOrRent === 'rent' ? 'Sales Valuation' : 'Lettings Valuation';
      const valuation = await this.formService.getValPalValuation(
        {
          postcode: data.postcode,
          address: data.address,
          houseNumber: data.houseNumber,
          houseName: data.houseName,
          apartment: data.apartment,
          street: data.street,
          dependantStreet: data.dependantStreet,
          bedrooms: data.bedrooms,
          propertyType: data.propertyType,
        },
        type,
      );
      const dataWithValuation = { ...data, price: valuation };
      await this.emailService.emailToInternetRegistrations(data, enquiryType);
      await this.formService.postToIntegratedMarketing(
        'instantvaluation',
        dataWithValuation,
      );
    } catch (error) {
      throw new BadRequestException('Something went wrong', {
        cause: new Error(),
        description: error.message,
      });
    }
  }

  @Post('/earlybird')
  async earlyBird(@Body() data: EarlyBird) {
    try {
      const enquiryType: EnquiryType =
        data.buyOrRent === 'rent' ? 'Sales' : 'Lettings';
      await this.emailService.emailToInternetRegistrations(data, enquiryType);
      await this.formService.postToIntegratedMarketing('earlybird', data);
    } catch (error) {
      throw new BadRequestException('Something went wrong', {
        cause: new Error(),
        description: error.message,
      });
    }
  }
}
