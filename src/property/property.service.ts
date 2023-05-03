import { Injectable } from '@nestjs/common';
import { FormattedProperty, Status } from 'src/types';
import {
  PropertyModel,
  PropertyImageModel,
} from '@reapit/foundations-ts-definitions';

@Injectable()
export class PropertyService {
  formatProperties(properties: PropertyModel[]): FormattedProperty[] {
    const formattedProperties = properties.map((property) => {
      return this.formatProperty(property);
    });
    return formattedProperties;
  }

  formatProperty(property: PropertyModel): FormattedProperty {
    const formattedProperty: FormattedProperty = {
      id: property.id,
      type: property.marketingMode,
      propertyType: property.type,
      status: property.selling
        ? (property.selling.status as Status)
        : (property.letting.status as Status),
      description: property.description,
      address1: property.address.line1,
      address2: property.address.line2,
      postcode: property.address.postcode,
      price: property.selling ? property.selling.price : property.letting.rent,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      receptions: property.receptions,
      rooms: property.rooms,
      images: property._embedded.images
        ? (property._embedded.images.filter((i: PropertyImageModel) => {
            return i.type.includes('photograph');
          }) as PropertyImageModel[])
        : [],
      floorplan: property._embedded.images
        ? (property._embedded.images.filter((i: PropertyImageModel) => {
            return i.type.includes('floorPlan');
          }) as PropertyImageModel[])
        : [],
      epc: property._embedded.images
        ? (property._embedded.images.filter((i: PropertyImageModel) => {
            return i.type.includes('epc');
          }) as PropertyImageModel[])
        : [],
      created: property.created,
      virtualTour: property.videoUrl,
      brochure: property.selling
        ? property.selling.brochureId
        : property.letting.brochureId,
      location: property.address.geolocation,
    };

    formattedProperty.images.sort((a, b) => a.order - b.order);
    formattedProperty.floorplan.sort((a, b) => a.order - b.order);
    formattedProperty.epc.sort((a, b) => a.order - b.order);

    return formattedProperty;
  }

  updateProperty(
    newProperty: FormattedProperty,
    propertyList: FormattedProperty[],
  ): FormattedProperty[] {
    return propertyList.map((property) => {
      if (property.id === newProperty.id) {
        return { ...property, ...newProperty };
      }
      return property;
    });
  }

  addProperty(
    newProperty: FormattedProperty,
    propertyList: FormattedProperty[],
  ): FormattedProperty[] {
    return [...propertyList, newProperty];
  }

  removeProperty(
    removedProperty: FormattedProperty,
    propertyList: FormattedProperty[],
  ): FormattedProperty[] {
    return propertyList.filter(
      (property) => property.id !== removedProperty.id,
    );
  }
}
