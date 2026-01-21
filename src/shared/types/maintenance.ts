
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

// --- NEW TENANT TYPES (Plan implementation) ---

export type MaintenanceCategory = 
  | "plumbing" 
  | "electrical" 
  | "hvac" 
  | "appliance" 
  | "structural" 
  | "pest" 
  | "safety"
  | "other";

export type MaintenancePriority = "emergency" | "high" | "normal";

export type MaintenanceStatus = 
  | "submitted" 
  | "reviewing" 
  | "scheduled" 
  | "in_progress" 
  | "completed" 
  | "closed";

export type MediaType = "image" | "video";
export type UploaderType = "tenant" | "manager" | "vendor";
export type SenderType = "tenant" | "manager" | "vendor" | "system";

export interface Media {
  id: string;
  type: MediaType;
  url: string;
  uploadedBy: UploaderType;
  uploadedAt: string; // ISODate
}

export interface MaintenanceMessage {
  id: string;
  requestId: string;
  senderType: SenderType;
  message: string;
  attachments?: Media[];
  createdAt: string; // ISODate
}

export interface MaintenanceRequest {
  id: string;
  unitId: string;
  tenantId: string;
  propertyId: string;
  title: string;
  description: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  allowEntryWithoutTenant: boolean;
  preferredAccessTimes?: string;
  petsPresent: boolean;
  attachments: Media[];
  messages: MaintenanceMessage[];
  createdAt: string; // ISODate
  updatedAt: string; // ISODate
  completedAt?: string; // ISODate
  
  // Enhanced Wizard Fields
  locationContext?: string;
  issueType?: string;
  subIssueDetail?: string; // For "Other" or specific details
  applianceProvidedByProperty?: boolean;
}
