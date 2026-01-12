export interface Property {
  id: string;
  name: string;
  address: string;
  units: Unit[];
}

export interface Unit {
  id: string;
  number: string;
  tenantId?: string;
  status: 'occupied' | 'vacant';
}
