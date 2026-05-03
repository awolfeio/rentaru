export type TenantStatus = 
  | 'active' 
  | 'inactive' 
  | 'pending_move_in' 
  | 'pending_move_out' 
  | 'notice_given' 
  | 'eviction';

export type RentStatus = 'paid' | 'partial' | 'overdue' | 'credit' | 'no_balance';

export type LeaseStatus = 
  | 'active' 
  | 'month_to_month' 
  | 'signed_not_started' 
  | 'pending_move_in'
  | 'renewal_pending' 
  | 'notice_given'
  | 'pending_move_out'
  | 'expired' 
  | 'terminated_early'
  | 'eviction';

export type VehiclePowertrain = 'electric' | 'non_electric';
export type ParkingAssignment =
  | 'unassigned_open_lot_parking'
  | 'covered_carport'
  | 'parking_garage'
  | 'tandem_parking'
  | 'oversized_vehicle'
  | 'motorcycle';

export interface TenantVehicle {
  id: string;
  title: string;
  year: number;
  color: string;
  licensePlate: string;
  powertrain: VehiclePowertrain;
  parkingAssignment: ParkingAssignment;
}

export interface TenantInsurancePolicy {
  id: string;
  policyNumber: string;
  provider: string;
  coverageStartDate: string;
  coverageEndDate: string;
  liabilityNumbers: string[];
}

export interface Tenant {
  id: string;
  // Personal Info
  name: string;
  email: string;
  phone?: string;
  
  // Location
  propertyId: string;
  propertyName: string;
  unitId: string;
  unitNumber: string;
  
  // Lease Details
  leaseId?: string;
  leaseStatus: LeaseStatus;
  leaseStartDate: string;
  leaseEndDate: string;
  moveInDate?: string;
  moveOutDate?: string;
  
  // Financials
  rentAmount: number;
  rentStatus: RentStatus;
  balance: number;
  lastPaymentDate?: string;
  paymentMethod?: 'ach' | 'credit_card' | 'check' | 'cash' | 'other';
  autopayEnabled: boolean;
  
  // Maintenance
  maintenanceRequestCount: number; // Open requests
  lastMaintenanceRequestDate?: string;
  
  // Meta / Risk
  communicationStatus: 'responsive' | 'unresponsive' | 'unread' | 'never_contacted';
  portalStatus: 'invited' | 'accepted' | 'never_logged_in' | 'disabled';
  documentStatus: 'complete' | 'missing_docs' | 'lease_signed';
  tags: string[]; // e.g., 'vip', 'high_risk'
  vehicles?: TenantVehicle[];
  insurancePolicies?: TenantInsurancePolicy[];
  
  createdAt: string;
}
