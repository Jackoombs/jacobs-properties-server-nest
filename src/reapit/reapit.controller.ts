import { Controller, Post, Body, Get } from '@nestjs/common';
import { ReapitService } from './reapit.service';
import { FormattedProperty, ReapitWebhook, AllowedStatus } from '../types';
import { PropertyService } from '../property/property.service';
import { DataService } from '../data/data.service';
import { ImageService } from 'src/image/image.service';

@Controller('reapit')
export class ReapitController {
  constructor(
    private readonly reapitService: ReapitService,
    private readonly propertyService: PropertyService,
    private readonly dataService: DataService,
    private readonly imageService: ImageService,
  ) {}

  @Get()
  getHello(): string {
    return 'Hello World!';
  }

  @Post()
  async updateProperty(@Body() payload: ReapitWebhook) {
    const properties = await this.dataService.readJsonFile<FormattedProperty[]>(
      'properties.json',
    );
    const property = await this.reapitService.fetchProperty(payload.entityId);
    const formattedProperty = this.propertyService.formatProperty(property);
    let updatedProperties: FormattedProperty[];

    const allowedStatus: AllowedStatus[] = [
      'forSale',
      'underOffer',
      'exchanged',
      'reserved',
      'completed',
      'soldExternally',
      'toLet',
      'underOffer',
      'arrangingTenancy',
      'tenancyCurrent',
      'tenancyFinished',
      'sold',
    ];

    if (allowedStatus.includes(formattedProperty.status as AllowedStatus)) {
      if (payload.topicId === 'properties.modified') {
        updatedProperties = this.propertyService.updateProperty(
          formattedProperty,
          properties,
        );
      } else if (payload.topicId === 'properties.created') {
        updatedProperties = this.propertyService.addProperty(
          formattedProperty,
          properties,
        );
      }
      await this.imageService.processAllImages(formattedProperty.images);
    } else {
      updatedProperties = this.propertyService.removeProperty(
        formattedProperty,
        properties,
      );
    }

    await this.dataService.writeJsonFile('properties.json', updatedProperties);
  }
}
