import { Property } from '@/shared/types/property';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: 'p1',
    name: 'Oak Street Apartments',
    address: '123 Oak St, Seattle, WA',
    features: {
      amenities: true,
      vehicles: true,
      rentersInsurance: true,
      guestParking: true,
    },
    amenities: [
      {
        id: 'p1-a1',
        name: 'Clubroom',
        description: 'Private event space for gatherings and celebrations.',
        pricingLabel: '$25/hr',
        bookingType: 'hourly',
        approvalRequired: false,
        availabilityLabel: 'Open today'
      },
      {
        id: 'p1-a2',
        name: 'Guest Suite',
        description: 'Overnight stay option for approved house guests.',
        pricingLabel: '$85/night',
        bookingType: 'overnight',
        approvalRequired: true,
        availabilityLabel: '3 available this month'
      },
      {
        id: 'p1-a3',
        name: 'Guest Parking',
        description: 'Reserve a temporary visitor parking space.',
        pricingLabel: '$12/day',
        bookingType: 'resource',
        approvalRequired: true,
        availabilityLabel: 'Requires permit'
      },
    ],
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
    features: {
      amenities: true,
      vehicles: true,
      rentersInsurance: true,
      guestParking: false,
    },
    amenities: [
      {
        id: 'p2-a1',
        name: 'Conference Room',
        description: 'Bookable meeting room with display and whiteboard.',
        pricingLabel: 'Free',
        bookingType: 'hourly',
        approvalRequired: false,
        availabilityLabel: 'Instant booking'
      },
      {
        id: 'p2-a2',
        name: 'Rooftop Deck',
        description: 'Shared outdoor deck for daytime gatherings.',
        pricingLabel: '$15/hr',
        bookingType: 'hourly',
        approvalRequired: true,
        availabilityLabel: 'Seasonal hours'
      },
    ],
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
    features: {
      amenities: false,
      vehicles: true,
      rentersInsurance: true,
      guestParking: false,
    },
    amenities: [],
    units: [
      { id: 'u11', number: 'A', status: 'occupied' },
      { id: 'u12', number: 'B', status: 'occupied' },
    ]
  }
];
