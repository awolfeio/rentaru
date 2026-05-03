export type TenantReservationStatus = 'pending_approval' | 'confirmed' | 'completed' | 'canceled';

export interface TenantReservation {
  id: string;
  tenantId: string;
  propertyId: string;
  amenityId: string;
  amenityName: string;
  scheduleLabel: string;
  dateLabel: string;
  feeLabel: string;
  status: TenantReservationStatus;
  requiresApproval: boolean;
}

export const MOCK_TENANT_RESERVATIONS: TenantReservation[] = [
  {
    id: 'res-1',
    tenantId: 't1',
    propertyId: 'p1',
    amenityId: 'p1-a1',
    amenityName: 'Clubroom',
    scheduleLabel: 'Friday, Jan 19 · 6:00 PM - 10:00 PM',
    dateLabel: 'Jan 19',
    feeLabel: '$100 total',
    status: 'confirmed',
    requiresApproval: false,
  },
  {
    id: 'res-2',
    tenantId: 't1',
    propertyId: 'p1',
    amenityId: 'p1-a3',
    amenityName: 'Guest Parking',
    scheduleLabel: 'Sat, Jan 27 · 8:00 AM - 8:00 PM',
    dateLabel: 'Jan 27',
    feeLabel: '$12',
    status: 'pending_approval',
    requiresApproval: true,
  },
  {
    id: 'res-3',
    tenantId: 't2',
    propertyId: 'p2',
    amenityId: 'p2-a1',
    amenityName: 'Conference Room',
    scheduleLabel: 'Tue, Feb 6 · 1:00 PM - 3:00 PM',
    dateLabel: 'Feb 6',
    feeLabel: 'Free',
    status: 'confirmed',
    requiresApproval: false,
  },
];
