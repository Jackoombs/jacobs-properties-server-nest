import { Test, TestingModule } from '@nestjs/testing';
import { AppBootstrapService } from './app-bootstrap.service';
import { PropertyService } from '../property/property.service';
import { ReapitService } from '../reapit/reapit.service';
import { ImageService } from '../image/image.service';
import { createMock } from '@golevelup/ts-jest';

describe('AppBootstrapService', () => {
  let appBootstrapService: AppBootstrapService;
  let reapitService: ReapitService;
  let propertyService: PropertyService;
  let imageService: ImageService;

  const mockProperties = [{ id: ' 1' }, { id: '2' }];
  const mockFormattedProperties = [
    {
      id: '1',
      type: 'sales',
      propertyType: ['house'],
      price: 1234,
      rooms: [],
      images: [],
      floorplan: [],
      epc: [],
      created: '123',
      location: {},
    },
    {
      id: '2',
      type: 'sales',
      propertyType: ['house'],
      price: 1236,
      rooms: [],
      images: [],
      floorplan: [],
      epc: [],
      created: '234',
      location: {},
    },
  ];
  const propertyIds = ['1', '2', '3'];
  const images = [
    { id: '1', propertyId: '1', url: 'http://example.com/image.jpg' },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppBootstrapService,
        {
          provide: PropertyService,
          useValue: createMock<PropertyService>({
            formatProperties: () => mockFormattedProperties,
            getPropertyIds: async () => propertyIds,
          }),
        },
        {
          provide: ReapitService,
          useValue: createMock<ReapitService>({
            fetchProperties: async () => mockProperties,
            fetchImages: async () => images,
          }),
        },
        {
          provide: ImageService,
          useValue: createMock<ImageService>(),
        },
      ],
    }).compile();

    appBootstrapService = module.get<AppBootstrapService>(AppBootstrapService);
    reapitService = module.get<ReapitService>(ReapitService);
    propertyService = module.get<PropertyService>(PropertyService);
    imageService = module.get<ImageService>(ImageService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(appBootstrapService).toBeDefined();
  });

  describe('updateModifiedProperties', () => {
    it('should fetch properties from ReapitService and update them in PropertyService', async () => {
      // Arrange
      const modifiedFrom = new Date();
      const salesQueryParams = {
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
        modifiedFrom: modifiedFrom.toISOString(),
      };
      const lettingsQueryParams = {
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
        modifiedFrom: modifiedFrom.toISOString(),
      };

      // Act
      await appBootstrapService.updateModifiedProperties(modifiedFrom);

      // Assert
      expect(reapitService.fetchProperties).toHaveBeenCalledWith(
        salesQueryParams,
        lettingsQueryParams,
      );

      expect(propertyService.formatProperties).toHaveBeenCalledWith(
        mockProperties,
      );

      expect(propertyService.updateProperty).toHaveBeenCalledTimes(2);
      expect(propertyService.updateProperty).toHaveBeenCalledWith(
        mockFormattedProperties[0],
        mockFormattedProperties,
      );
      expect(propertyService.updateProperty).toHaveBeenCalledWith(
        mockFormattedProperties[1],
        mockFormattedProperties,
      );

      expect(propertyService.writeProperties).toHaveBeenCalledTimes(1);
      expect(propertyService.writeProperties).toHaveBeenCalledWith(
        mockFormattedProperties,
      );
    });
  });

  describe('updateModifiedImages', () => {
    it('should fetch and process images for all properties modified since the given date', async () => {
      // Arrange

      // Call the updateModifiedImages method
      const modifiedFrom = new Date();
      await appBootstrapService.updateModifiedImages(modifiedFrom);

      expect(propertyService.getPropertyIds).toHaveBeenCalledTimes(1);

      expect(reapitService.fetchImages).toHaveBeenCalledTimes(1);
      expect(reapitService.fetchImages).toHaveBeenCalledWith({
        pageSize: 100,
        propertyId: propertyIds,
        modifiedFrom: modifiedFrom.toISOString(),
        type: 'photograph',
      });

      expect(imageService.processAllImages).toHaveBeenCalledTimes(1);
      expect(imageService.processAllImages).toHaveBeenCalledWith(images);
    });
  });
});
