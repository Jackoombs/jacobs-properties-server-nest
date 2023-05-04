import { Controller, Get, Param, BadRequestException } from '@nestjs/common';
import { PropertyService } from './property.service';

@Controller('property')
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Get()
  async FindAll() {
    try {
      return await this.propertyService.readProperties();
    } catch (error) {
      throw new BadRequestException('Something went wrong', {
        cause: new Error(),
        description: error.message,
      });
    }
  }

  @Get(':id')
  async FindOne(@Param() params: any) {
    try {
      const property = (await this.propertyService.readProperties()).find(
        (property) => property.id === params.id,
      );
      if (property) {
        return property;
      } else {
        throw new Error(`Property with id "${params.id}" not found.`);
      }
    } catch (error) {
      throw new BadRequestException('Something went wrong', {
        cause: new Error(),
        description: error.message,
      });
    }
  }
}
