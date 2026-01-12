export type UrgencyLevel = 'routine' | 'urgent' | 'emergency';
export type TicketStatus = 'open' | 'in_progress' | 'waiting' | 'resolved' | 'closed';
export type TicketCategory = 'plumbing' | 'hvac' | 'electrical' | 'appliance' | 'general';

export interface MaintenanceTicket {
  id: string;
  title: string;
  description: string;
  propertyId: string;
  propertyName: string;
  unitId?: string; // Optional if common area
  unitNumber: string;
  categoryId: TicketCategory;
  reportedBy: string; // User ID or Name
  reporterType: 'tenant' | 'manager' | 'system';
  urgency: UrgencyLevel;
  status: TicketStatus;
  
  // Assignment
  assignedToUser?: string;
  vendorId?: string;
  vendorName?: string;
  
  // Logistics
  accessPermission: boolean; // Permission to enter
  preferredTime?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  
  // Financial
  estimatedCost?: number;
  actualCost?: number;
  
  images?: string[]; // URLs
  
  createdAt: string;
  updatedAt: string;
}
