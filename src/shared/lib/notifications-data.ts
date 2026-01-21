
// Mock data and types for notifications settings
export type NotificationChannel = 'app' | 'email' | 'sms' | 'push';
export type NotificationSeverity = 'info' | 'action' | 'urgent';

export interface NotificationCategory {
    id: string;
    label: string;
    description: string;
    group: 'payments' | 'maintenance' | 'leases' | 'tenants' | 'properties' | 'messages' | 'system';
}

export interface NotificationPreference {
    categoryId: string;
    enabled: boolean;
    channels: {
        [key in NotificationChannel]?: boolean;
    };
    severity?: NotificationSeverity;
}

export const NOTIFICATION_CATEGORIES: NotificationCategory[] = [
    // Payments
    { id: 'payment_received', label: 'Rent Received', description: 'When a tenant payment is confirmed', group: 'payments' },
    { id: 'payment_failed', label: 'Payment Failed', description: 'When a payment transaction fails', group: 'payments' },
    { id: 'late_fee', label: 'Late Fee Applied', description: 'System automatically applies a late fee', group: 'payments' },
    
    // Maintenance
    { id: 'maint_new', label: 'New Request', description: 'Tenant submits a new work order', group: 'maintenance' },
    { id: 'maint_update', label: 'Status Update', description: 'Vendor or staff updates a ticket', group: 'maintenance' },
    { id: 'maint_urgent', label: 'Emergency Flag', description: 'Request marked as urgent/emergency', group: 'maintenance' },
    
    // Leases
    { id: 'lease_expire', label: 'Lease Expiring', description: 'Lease ending within 30/60/90 days', group: 'leases' },
    { id: 'lease_signed', label: 'Document Signed', description: 'Tenant signs a lease or addendum', group: 'leases' },
    
    // Tenants
    { id: 'tenant_app', label: 'New Application', description: 'Incoming rental application', group: 'tenants' },
    { id: 'tenant_msg', label: 'Tenant Message', description: 'Direct message from a tenant', group: 'messages' },
    
    // System
    { id: 'system_alert', label: 'System Alert', description: 'Platform updates or security alerts', group: 'system' },
];

export const MOCK_NOTIFICATION_PREFERENCES: NotificationPreference[] = NOTIFICATION_CATEGORIES.map(cat => ({
    categoryId: cat.id,
    enabled: true,
    channels: {
        app: true,
        email: true,
        sms: cat.group === 'maintenance' || cat.group === 'payments' ? false : undefined, // SMS optional for some
    }
}));
