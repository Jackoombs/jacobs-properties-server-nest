import { FormattedProperty } from '../types';

export const propertyList: FormattedProperty[] = [
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

export const updatedProperty: FormattedProperty = {
  id: '1',
  type: 'lettings',
  propertyType: ['house'],
  price: 12345,
  rooms: [],
  images: [],
  floorplan: [],
  epc: [],
  created: '123',
  location: {},
};

export const newProperty: FormattedProperty = {
  id: '3',
  type: 'lettings',
  propertyType: ['house'],
  price: 12345,
  rooms: [],
  images: [],
  floorplan: [],
  epc: [],
  created: '123',
  location: {},
};

export const updateExpectedList = [
  {
    id: '1',
    type: 'lettings',
    propertyType: ['house'],
    price: 12345,
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

export const addExpectedList = [
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
  {
    id: '3',
    type: 'lettings',
    propertyType: ['house'],
    price: 12345,
    rooms: [],
    images: [],
    floorplan: [],
    epc: [],
    created: '123',
    location: {},
  },
];

export const removeExpectedList = [
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
