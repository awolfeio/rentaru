export interface TenantFilterState {
    // 1. Status
    status: string[]; // 'active', 'inactive', etc.
    
    // 2. Financial
    rentStatus: string[]; // 'paid', 'late', etc.
    balanceMin?: number;
    balanceMax?: number;
    
    // 3. Lease
    leaseStatus: string[];
    leaseExpiringDays?: number; // 30, 60, 90
    
    // 4. Property
    propertyIds: string[];
    
    // 5. Maintenance
    hasOpenTickets?: boolean;
    
    // 6. Payment
    paymentMethod: string[];
    autopay?: boolean;
    
    // Search is handled separately usually, but could be here
}

export const INITIAL_FILTERS: TenantFilterState = {
    status: [],
    rentStatus: [],
    leaseStatus: [],
    propertyIds: [],
    paymentMethod: [],
};
