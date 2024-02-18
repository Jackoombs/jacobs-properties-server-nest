import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { QueryParams } from '../types';
import { ReapitService } from '../reapit/reapit.service';
import schedule from 'node-schedule';
import { PropertyService } from '../property/property.service';
import { ImageService } from '../image/image.service';
import { CronJob } from 'cron';

@Injectable()
export class AppBootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly reapitService: ReapitService,
    private readonly propertyService: PropertyService,
    private readonly imageService: ImageService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedProperties();

    const dailyReSeed = new CronJob('0 0 * * *', async () => {
      await this.seedProperties();
    });

    const hourlyUpdate = new CronJob('0 7-21 * * *', async () => {
      const currentDate = new Date();
      const oneHourAgo = new Date(currentDate.getTime() - 3600000);
      await this.updateModifiedProperties(oneHourAgo);
      await this.updateModifiedImages(oneHourAgo);
    });

    dailyReSeed.start();
    hourlyUpdate.start();
  }

  async seedProperties() {
    const salesQueryParams: QueryParams = {
      pageSize: 100,
      embed: 'images',
      marketingMode: 'selling',
      sellingStatus: [
        'forSale',
        'underOffer',
        'reserved',
        'exchanged',
        'completed',
        'soldExternally',
      ],
      internetAdvertising: true,
    };

    const lettingsQueryParams: QueryParams = {
      pageSize: 2,
      embed: 'images',
      marketingMode: 'lettings',
      lettingsStatus: [
        'toLet',
        'underOffer',
        'arrangingTenancy',
        'tenancyCurrent',
        'tenancyFinished',
        'sold',
      ],
      internetAdvertising: true,
    };

    const properties = await this.reapitService.fetchProperties(
      salesQueryParams,
      lettingsQueryParams,
    );

    console.log(
      properties.map((p) => ({
        address: p.address.line1,
        id: p.id,
        type: p.marketingMode,
      })),
    );

    const formattedProperties =
      this.propertyService.formatProperties(properties);

    await this.propertyService.writeProperties(formattedProperties);
    await this.reapitService.deployFrontend();
    for (const property of formattedProperties) {
      await this.imageService.processAllImages(property.images);
    }
  }

  async updateModifiedProperties(modifiedFrom: Date) {
    const modifiedFromString = modifiedFrom.toISOString();

    const salesQueryParams: QueryParams = {
      pageSize: 100,
      marketingMode: 'selling',
      sellingStatus: [
        'forSale',
        'underOffer',
        'reserved',
        'exchanged',
        'completed',
        'soldExternally',
      ],
      internetAdvertising: true,
      modifiedFrom: modifiedFromString,
    };

    const lettingsQueryParams: QueryParams = {
      pageSize: 100,
      marketingMode: 'lettings',
      lettingsStatus: [
        'toLet',
        'underOffer',
        'arrangingTenancy',
        'tenancyCurrent',
        'tenancyFinished',
        'tenancyCurrentUnavailable',
        'sold',
      ],
      internetAdvertising: true,
      modifiedFrom: modifiedFromString,
    };

    let properties = this.propertyService.formatProperties(
      await this.reapitService.fetchProperties(
        salesQueryParams,
        lettingsQueryParams,
      ),
    );

    for (const property of properties) {
      properties = this.propertyService.updateProperty(property, properties);
    }

    await this.propertyService.writeProperties(properties);
    await this.reapitService.deployFrontend();
  }

  async updateModifiedImages(modifiedFrom: Date) {
    const propertyIds = await this.propertyService.getPropertyIds();
    const queryParams: QueryParams = {
      pageSize: 100,
      propertyId: propertyIds,
      modifiedFrom: modifiedFrom.toISOString(),
      type: 'photograph',
    };

    const images = await this.reapitService.fetchImages(queryParams);
    await this.imageService.processAllImages(images);
  }
}
