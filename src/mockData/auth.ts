import { Organization, User, Role, Membership, Permission, UserWithRole } from '../types/auth';

export const PERMISSIONS: Record<string, Permission> = {
  SUBMIT_TICKET: 'submit_ticket',
  VIEW_TICKET: 'view_ticket',
  UPDATE_TICKET_STATUS: 'update_ticket_status',
  ASSIGN_TICKET: 'assign_ticket',
  VIEW_FINANCIALS: 'view_financials',
  MANAGE_LEASES: 'manage_leases',
  MANAGE_USERS: 'manage_users',
  MANAGE_PROPERTIES: 'manage_properties',
  MANAGE_SETTINGS: 'manage_settings',
  MANAGE_TENANTS: 'manage_tenants',
  COMMUNICATE_TENANTS: 'communicate_tenants',
  MANAGE_DOCUMENTS: 'manage_documents',
};

export const STANDARD_ROLES: Role[] = [
  {
    id: 'role_admin',
    name: 'Admin',
    description: 'Full access to all organization resources.',
    permissions: [
      'submit_ticket', 'view_ticket', 'update_ticket_status', 'assign_ticket',
      'view_financials', 'manage_leases', 'manage_users', 'manage_properties', 'manage_settings'
    ],
    isSystem: true,
  },
  {
    id: 'role_owner',
    name: 'Owner',
    description: 'View access to financials and reports.',
    permissions: ['view_financials', 'view_ticket'],
    isSystem: true,
  },
  {
    id: 'role_maintenance',
    name: 'Maintenance',
    description: 'Manage assigned maintenance tickets.',
    permissions: ['view_ticket', 'update_ticket_status'],
    isSystem: true,
  },
  {
    id: 'role_property_manager',
    name: 'Property Manager',
    description: 'Manage tenants, leases, and maintenance for assigned properties.',
    permissions: [
      'manage_tenants',
      'manage_leases',
      'view_financials',
      'communicate_tenants',
      'submit_ticket',
      'view_ticket',
      'update_ticket_status',
      'assign_ticket',
      'manage_documents',
    ],
    isSystem: true,
  },
];

export const MOCK_ORGANIZATION: Organization = {
  id: 'org_1',
  name: 'Acme Property Management',
};

export const MOCK_USERS: User[] = [
  {
    id: 'user_1',
    name: 'Alice Admin',
    email: 'alice@example.com',
    status: 'active',
    lastActive: '2023-10-27T10:00:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=user_1',
  },
  {
    id: 'user_2',
    name: 'Bob Owner',
    email: 'bob@example.com',
    status: 'active',
    lastActive: '2023-10-26T14:30:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=user_2',
  },
  {
    id: 'user_3',
    name: 'Charlie Fixit',
    email: 'charlie@example.com',
    status: 'active',
    lastActive: '2023-10-27T08:15:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=user_3',
  },
  {
    id: 'user_4',
    name: 'David Manager',
    email: 'david@example.com',
    status: 'active',
    lastActive: '2023-10-27T11:00:00Z',
    avatarUrl: 'https://i.pravatar.cc/150?u=user_4',
  },
  {
    id: 'user_5',
    name: 'Eve Invited',
    email: 'eve@example.com',
    status: 'invited',
    invitedAt: '2023-10-27T09:00:00Z',
  },
];

export const MOCK_MEMBERSHIPS: Membership[] = [
  {
    userId: 'user_1',
    organizationId: 'org_1',
    roles: ['role_admin'],
    propertyScope: 'all',
    unitScope: [],
  },
  {
    userId: 'user_2',
    organizationId: 'org_1',
    roles: ['role_owner'],
    propertyScope: 'all',
    unitScope: [],
  },
  {
    userId: 'user_3',
    organizationId: 'org_1',
    roles: ['role_maintenance'],
    propertyScope: ['prop_1', 'prop_2'], // Example property IDs
    unitScope: [],
  },
  {
    userId: 'user_4',
    organizationId: 'org_1',
    roles: ['role_property_manager'],
    propertyScope: ['p2'], // Assigned to Highland Lofts (p2)
    unitScope: [],
  },
  {
    userId: 'user_5',
    organizationId: 'org_1',
    roles: ['role_maintenance'],
    propertyScope: 'all',
    unitScope: [],
  },
];

export const getMockUsersWithRoles = (): UserWithRole[] => {
  return MOCK_USERS.map(user => {
    const membership = MOCK_MEMBERSHIPS.find(m => m.userId === user.id);
    if (!membership) throw new Error(`Membership not found for user ${user.id}`);
    return { user, membership };
  });
};
