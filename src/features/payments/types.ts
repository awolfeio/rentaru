export type PaymentOrigin = 'processor' | 'manual';

export type ProcessorPaymentMethod = 'ach' | 'card';

export type ManualPaymentMethod =
  | 'cash'
  | 'check'
  | 'money_order'
  | 'external_bank_transfer'
  | 'external_digital_wallet'
  | 'third_party';

export type PaymentMethod = ProcessorPaymentMethod | ManualPaymentMethod;

export type PaymentStatus = 'paid' | 'pending' | 'failed' | 'late' | 'tentative' | 'voided';
export type PaymentType = 'rent' | 'fee' | 'adjustment';

export interface Payment {
  id: string;
  date: string;
  tenantName: string;
  tenantId?: string;
  propertyName: string;
  propertyId?: string;
  unitNumber: string;
  unitId?: string;
  leaseId?: string;
  type: PaymentType;
  amount: number;
  method: PaymentMethod;
  origin: PaymentOrigin;
  status: PaymentStatus;

  last4?: string;
  processorRef?: string;

  manualRef?: string;
  manualSourceLabel?: string;
  payerName?: string;
  payerType?: 'tenant' | 'employer' | 'housing_assistance' | 'family' | 'other';
  notes?: string;
  attachmentCount?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  editable?: boolean;

  failureReason?: string;
  nextRetryDate?: string;
}
