import {
  PropertyModel,
  PropertyImageModel,
  Properties,
} from '@reapit/foundations-ts-definitions';

export interface ReapitServerSessionHeaders {
  'api-version': string;
  'Content-Type': string;
  'reapit-customer': string;
}

export type Status =
  | Properties['lettingStatus'][0]
  | [Properties['sellingStatus'][0]]
  | AllowedStatus;

export type AllowedStatus =
  | 'forSale'
  | 'underOffer'
  | 'exchanged'
  | 'reserved'
  | 'completed'
  | 'soldExternally'
  | 'toLet'
  | 'underOffer'
  | 'arrangingTenancy'
  | 'tenancyCurrent'
  | 'tenancyFinished'
  | 'sold';

export interface FormattedProperty {
  id: string;
  type: string;
  propertyType: string[];
  status?: Status;
  description?: string;
  address1?: string;
  address2?: string;
  postcode?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  receptions?: number;
  rooms: PropertyModel['rooms'];
  images: PropertyImageModel[];
  floorplan: PropertyImageModel[];
  epc: PropertyImageModel[];
  created: string;
  virtualTour?: string;
  brochure?: string;
  location: {
    longitude?: number;
    latitude?: number;
  };
}

export type QueryParams = {
  [key: string]: string | string[] | number | number[] | boolean;
};

export interface ReapitWebhook {
  entityId: string;
  topicId: string;
}

export interface FormBase {
  fullName: string;
  email: string;
  telephone: string;
}

export interface FormDates {
  dates: [
    {
      date: '2023-02-28T00:00:00.000Z';
      morning: true;
      afternoon: true;
      evening: false;
    }[],
  ];
}

export interface FormAddress {
  postcode: string;
  address: string;
  houseNumber: string;
  houseName: string;
  apartment: string;
  street: string;
  dependantStreet: string;
  bedrooms: string;
  propertyType: string;
}

export interface MakeAnOffer extends FormBase {
  offer: string;
  message: string;
}

export interface GetInTouch extends FormBase {
  message: string;
}

export interface ExpertValuation extends FormBase, FormAddress, FormDates {
  buyOrRent: 'buy' | 'rent';
}

export interface InstantValuation extends FormBase, FormAddress {
  buyOrRent: 'buy' | 'rent';
}

export interface EarlyBird extends FormBase {
  buyOrRent: 'buy' | 'rent';
  minPrice: string;
  maxPrice: string;
  minBedrooms: string;
  radius: string;
  propertyType: string;
  location: string;
}

export interface BrochureForm {
  fullName: string;
  email: string;
  buyOrRent: 'buy' | 'rent';
}

export interface BookAViewing extends FormBase, FormDates {
  address: string;
}

export interface FormData
  extends MakeAnOffer,
    GetInTouch,
    ExpertValuation,
    InstantValuation,
    ExpertValuation,
    EarlyBird {}

export type EnquiryType =
  | 'Sales'
  | 'Lettings'
  | 'Sales Valuation'
  | 'Lettings Valuation';
