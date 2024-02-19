import { Injectable } from '@nestjs/common';
import { FormattedProperty, Status } from '../types';
import {
  PropertyModel,
  PropertyImageModel,
} from '@reapit/foundations-ts-definitions';
import { DataService } from '../data/data.service';

@Injectable()
export class PropertyService {
  private readonly propertyFile = 'properties.json';
  constructor(private readonly dataService: DataService) {}

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
      images:
        (property._embedded.images.filter((i: PropertyImageModel) => {
          return i.type.includes('photograph');
        }) as PropertyImageModel[]) ?? [],
      floorplan:
        (property._embedded.images.filter((i: PropertyImageModel) => {
          return i.type.includes('floorPlan');
        }) as PropertyImageModel[]) ?? [],
      epc:
        (property._embedded.images.filter((i: PropertyImageModel) => {
          return i.type.includes('epc');
        }) as PropertyImageModel[]) ?? [],
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

  async writeProperties(properties: FormattedProperty[]) {
    await this.dataService.writeJsonFile(this.propertyFile, properties);
  }

  async readProperties() {
    return await this.dataService.readJsonFile<FormattedProperty[]>(
      'properties.json',
    );
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

  async getPropertyIds(): Promise<string[]> {
    const properties = await this.readProperties();
    return properties.map((property) => property.id);
  }
}
