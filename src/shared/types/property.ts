export interface Property {
  id: string;
  name: string;
  address: string;
  units: Unit[];
  features?: PropertyFeatures;
  amenities?: PropertyAmenity[];
}

export interface Unit {
  id: string;
  number: string;
  tenantId?: string;
  status: 'occupied' | 'vacant';
}

export interface PropertyFeatures {
  amenities: boolean;
  vehicles: boolean;
  rentersInsurance: boolean;
  guestParking: boolean;
}

export interface PropertyAmenity {
  id: string;
  name: string;
  description: string;
  pricingLabel: string;
  bookingType: 'hourly' | 'overnight' | 'resource';
  approvalRequired: boolean;
  availabilityLabel?: string;
}
