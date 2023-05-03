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
