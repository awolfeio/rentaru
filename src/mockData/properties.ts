import { Property } from '@/types/property';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    name: 'Oak Street Apartments',
    address: '123 Oak St, Seattle, WA',
    units: [
      { id: 'u1', number: '1A', status: 'occupied' },
      { id: 'u2', number: '1B', status: 'occupied' },
      { id: 'u3', number: '2A', status: 'vacant' },
      { id: 'u4', number: '2B', status: 'occupied' },
      { id: 'u5', number: '3A', status: 'occupied' },
      { id: 'u6', number: '3B', status: 'occupied' },
    ]
  },
  {
    id: 'p2',
    name: 'Highland Lofts',
    address: '459 Highland Ave, Seattle, WA',
    units: [
      { id: 'u7', number: '101', status: 'occupied' },
      { id: 'u8', number: '102', status: 'occupied' },
      { id: 'u9', number: '103', status: 'vacant' },
      { id: 'u10', number: '201', status: 'occupied' },
    ]
  },
  {
    id: 'p3',
    name: 'Sunset Duplex',
    address: '88 Sunset Blvd, Los Angeles, CA',
    units: [
      { id: 'u11', number: 'A', status: 'occupied' },
      { id: 'u12', number: 'B', status: 'occupied' },
    ]
  }
];
