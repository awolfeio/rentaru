export interface Organization {
  id: string;
  name: string;
}

export type UserStatus = "invited" | "active" | "suspended";

export interface User {
  id: string;
  email: string;
  name: string;
  status: UserStatus;
  avatarUrl?: string;
  lastActive?: string;
  invitedAt?: string;
}

export type Permission =
  | "submit_ticket"
  | "view_ticket"
  | "update_ticket_status"
  | "assign_ticket"
  | "view_financials"
  | "manage_leases"
  | "manage_users"
  | "manage_properties"
  | "manage_tenants"
  | "communicate_tenants"
  | "manage_documents"
  | "manage_settings";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
  isSystem?: boolean;
}

export interface Membership {
  userId: string;
  organizationId: string;
  roles: string[]; // Role IDs
  propertyScope: "all" | string[]; // 'all' or list of Property IDs
  unitScope: string[]; // Unit IDs
}

// Composite type for UI display
export interface UserWithRole {
  user: User;
  membership: Membership;
}
