import { Test, TestingModule } from '@nestjs/testing';
import {
  addExpectedList,
  removeExpectedList,
  updateExpectedList,
  newProperty,
  updatedProperty,
  propertyList,
} from './mockFormattedPropertyData';
import { PropertyService } from './property.service';

describe('PropertyService', () => {
  let service: PropertyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PropertyService],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateProperty', () => {
    it('should return the property list with an updated property matching the id', () => {
      expect(
        service.updateProperty(updatedProperty, propertyList),
      ).toStrictEqual(updateExpectedList);
    });
  });

  describe('removeProperty', () => {
    it('should return the property list without the property with matching id', () => {
      expect(
        service.removeProperty(updatedProperty, propertyList),
      ).toStrictEqual(removeExpectedList);
    });
  });

  describe('addProperty', () => {
    it('should return the property list with additional property with matching id', () => {
      expect(service.addProperty(newProperty, propertyList)).toStrictEqual(
        addExpectedList,
      );
    });
  });
});
