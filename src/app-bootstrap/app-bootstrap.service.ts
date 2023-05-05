import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { QueryParams } from '../types';
import { ReapitService } from '../reapit/reapit.service';
import schedule from 'node-schedule';
import { PropertyService } from '../property/property.service';
import { ImageService } from '../image/image.service';

@Injectable()
export class AppBootstrapService implements OnApplicationBootstrap {
  constructor(
    private readonly reapitService: ReapitService,
    private readonly propertyService: PropertyService,
    private readonly imageService: ImageService,
  ) {}

  async onApplicationBootstrap() {
    await this.seedProperties();

    // eslint-disable-next-line
    const job = schedule.scheduleJob('0 0 * * *', async function () {
      await this.seedProperties();
    });
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

    const salesProperties = await this.reapitService.fetchProperties(
      salesQueryParams,
    );
    const lettingsProperties = await this.reapitService.fetchProperties(
      lettingsQueryParams,
    );

    const allProperties = this.propertyService.formatProperties([
      ...salesProperties,
      ...lettingsProperties,
    ]);
    console.log(allProperties);
    await this.propertyService.writeProperties(allProperties);
    for (const property of allProperties) {
      await this.imageService.processAllImages(property.images);
    }
  }
}
