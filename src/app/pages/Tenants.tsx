
import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  Mail, 
  AlertTriangle, 
  Clock, 
  DollarSign, 
  Wrench,
  MoreVertical,
  CheckCircle,

  AlertCircle,
  ArrowUpDown,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Imports
import { Tenant, RentStatus, LeaseStatus } from '@/shared/types/tenant';
import { MOCK_TENANTS } from '@/shared/mockData/tenants';
import { TenantFilterDrawer } from '@/shared/components/tenants/TenantFilterDrawer';
import { TenantFilterState, INITIAL_FILTERS } from '@/shared/types/tenantFilters';

// --- Components ---

const RentStatusBadge = ({ status }: { status: RentStatus }) => {
  const styles = {
    paid: 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20',
    partial: 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20',
    overdue: 'bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20',
    credit: 'bg-blue-100/50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/20',
    no_balance: 'bg-slate-100/50 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400 border-slate-200/50 dark:border-slate-500/20'
  };

  const labels: Record<RentStatus, string> = {
    paid: 'Paid',
    partial: 'Partial',
    overdue: 'Overdue',
    credit: 'Credit',
    no_balance: 'Settled'
  };

  return (
    <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide", styles[status])}>
      {labels[status]}
    </span>
  );
};

const TenantRow = ({ tenant }: { tenant: Tenant }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  const daysUntilLeaseEnd = Math.ceil((new Date(tenant.leaseEndDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const isLeaseEndingSoon = daysUntilLeaseEnd <= 60 && daysUntilLeaseEnd > 0;
  const isExpired = daysUntilLeaseEnd <= 0;

  return (
    <div className={cn(
        "group border rounded-xl bg-card transition-all duration-200",
        expanded ? "shadow-md ring-1 ring-primary/5 border-primary/20" : "hover:border-primary/20 hover:shadow-sm"
    )}>
      {/* Primary Row Content */}
      <div 
        className="p-4 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Tenant Identity */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground font-medium text-sm border">
                {tenant.name.split(' ').slice(0, 2).map(n => n[0]).join('')}
             </div>
             <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {tenant.name}
                    {tenant.rentStatus === 'overdue' && <AlertTriangle size={14} className="text-rose-500" />}
                    {tenant.tags.includes('vip') && <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1 rounded-sm border border-indigo-200">VIP</span>}
                </h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Mail size={12} /> {tenant.email}
                </div>
             </div>
          </div>
        </div>

        {/* Property Context */}
        <div className="flex-1 md:max-w-[200px]">
            <div className="text-sm font-medium text-foreground">{tenant.propertyName}</div>
            <div className="text-xs text-muted-foreground">Unit {tenant.unitNumber}</div>
        </div>

        {/* Status Grid */}
        <div className="flex-[2] grid grid-cols-3 gap-4 items-center">
            
            {/* Lease Status */}
            <div>
                <div className="text-xs text-muted-foreground mb-1">Lease</div>
                <div className={cn("text-sm font-medium flex items-center gap-1.5", 
                    isLeaseEndingSoon ? "text-amber-600 dark:text-amber-500" : 
                    isExpired ? "text-rose-600" : "text-foreground"
                )}>
                    {isLeaseEndingSoon ? (
                        <>
                            <Clock size={14} /> Ends in {daysUntilLeaseEnd} days
                        </>
                    ) : isExpired ? (
                        <>Expired</>
                    ) : (
                         <span className="capitalize">{tenant.leaseStatus.replace(/_/g, ' ')}</span>
                    )}
                </div>
            </div>

            {/* Rent Status */}
            <div>
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <RentStatusBadge status={tenant.rentStatus} />
            </div>

            {/* Balance */}
            <div>
                <div className="text-xs text-muted-foreground mb-1">Balance</div>
                <div className={cn("text-sm font-medium", tenant.balance > 0 ? "text-rose-600 dark:text-rose-500" : "text-foreground")}>
                    ${tenant.balance > 0 ? tenant.balance.toLocaleString() : '0.00'}
                </div>
            </div>
        </div>

        {/* Actions & Chevron */}
        <div className="flex items-center gap-3 justify-end min-w-[50px]">
             {tenant.maintenanceRequestCount > 0 && (
                 <div className="p-1.5 rounded-full bg-amber-100/50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500 border border-amber-200/30" title="Open Maintenance Req">
                     <Wrench size={14} />
                 </div>
             )}
            <div className={cn("transition-transform duration-200 text-muted-foreground", expanded && "rotate-180")}>
                <ChevronDown size={20} />
            </div>
        </div>
      </div>

      {/* Expanded Inline Detail */}
      <AnimatePresence>
        {expanded && (
            <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden border-t border-border/50 bg-slate-50/50 dark:bg-slate-900/20"
            >
                <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
                    
                    {/* Lease Snapshot */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Clock size={14} /> Lease Details
                        </h4>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b pb-1 border-border/50">
                                <span className="text-muted-foreground">Ends</span>
                                <span className="font-medium">{tenant.leaseEndDate}</span>
                            </div>
                            <div className="flex justify-between border-b pb-1 border-border/50">
                                <span className="text-muted-foreground">Rent</span>
                                <span className="font-medium">${tenant.rentAmount.toLocaleString()}/mo</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Start</span>
                                <span className="font-medium">{tenant.leaseStartDate}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Snapshot */}
                    <div className="space-y-3">
                         <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <DollarSign size={14} /> Payment
                        </h4>
                         <div className="space-y-2 text-sm">
                            <div className="flex justify-between border-b pb-1 border-border/50">
                                <span className="text-muted-foreground">Last Paid</span>
                                <span className="font-medium">{tenant.lastPaymentDate || '—'}</span>
                            </div>
                            <div className="flex justify-between border-b pb-1 border-border/50">
                                <span className="text-muted-foreground">Method</span>
                                <span className="font-medium capitalize">{tenant.paymentMethod?.replace('_', ' ') || '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Auto-Pay</span>
                                <span className={cn("font-medium", tenant.autopayEnabled ? "text-emerald-600" : "text-muted-foreground")}>
                                    {tenant.autopayEnabled ? "Enabled" : "Off"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Maintenance Snapshot */}
                    <div className="space-y-3">
                         <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Wrench size={14} /> Maintenance
                        </h4>
                        {tenant.maintenanceRequestCount > 0 ? (
                            <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-900/10 border border-amber-200/50 dark:border-amber-800/30">
                                <div className="text-amber-700 dark:text-amber-500 font-medium text-sm flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {tenant.maintenanceRequestCount} Active Request{tenant.maintenanceRequestCount > 1 ? 's' : ''}
                                </div>
                                {tenant.lastMaintenanceRequestDate && (
                                    <div className="text-xs text-muted-foreground mt-1">Last: {tenant.lastMaintenanceRequestDate}</div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 text-sm mt-2">
                                <CheckCircle size={16} /> No active requests
                            </div>
                        )}
                    </div>

                    {/* Quick Actions */}
                    <div className="space-y-3 md:border-l md:pl-6 border-border/50">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</h4>
                        <div className="flex flex-col gap-2">
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-foreground bg-white dark:bg-card border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                                <Mail size={14} className="text-muted-foreground" /> Message Tenant
                            </button>
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-foreground bg-white dark:bg-card border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                                <DollarSign size={14} className="text-muted-foreground" /> Record Payment
                            </button>
                             <button 
                                onClick={() => navigate(`/app/tenants/${tenant.id}`)}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-foreground bg-white dark:bg-card border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
                            >
                                <MoreVertical size={14} className="text-muted-foreground" /> View Profile & Docs
                            </button>
                        </div>
                    </div>

                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function TenantsPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [activeFilters, setActiveFilters] = useState<TenantFilterState>(INITIAL_FILTERS);
  const [sortConfig, setSortConfig] = useState<{ key: keyof Tenant; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof Tenant) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // --- Filtering & Sorting Logic ---
  
  const filteredAndSortedTenants = useMemo(() => {
    // 1. Filter
    let result = MOCK_TENANTS.filter(tenant => {
        // ... (existing filter logic)
        // 1. Search Query
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = 
            tenant.name.toLowerCase().includes(searchLower) ||
            tenant.email.toLowerCase().includes(searchLower) ||
            tenant.unitNumber.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;

        // 2. Filters from Drawer
        if (activeFilters.status.length > 0) {
            if (!activeFilters.status.includes(tenant.leaseStatus)) return false;
        }
        if (activeFilters.leaseStatus.length > 0) {
            if (!activeFilters.leaseStatus.includes(tenant.leaseStatus)) return false;
        }
        if (activeFilters.rentStatus.length > 0) {
            if (!activeFilters.rentStatus.includes(tenant.rentStatus)) return false;
        }
        if (activeFilters.propertyIds.length > 0) {
            if (!activeFilters.propertyIds.includes(tenant.propertyId)) return false;
        }
        if (activeFilters.hasOpenTickets) {
            if (tenant.maintenanceRequestCount === 0) return false;
        }
        if (activeFilters.balanceMin !== undefined && tenant.balance < activeFilters.balanceMin) return false;
        if (activeFilters.balanceMax !== undefined && tenant.balance > activeFilters.balanceMax) return false;
        if (activeFilters.leaseExpiringDays) {
            const daysUntil = Math.ceil((new Date(tenant.leaseEndDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
            if (daysUntil < 0 || daysUntil > activeFilters.leaseExpiringDays) return false;
        }

        return true;
    });

    // 2. Sort
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === bValue) return 0;
        if (aValue === undefined || aValue === null) return 1;
        if (bValue === undefined || bValue === null) return -1;
        
        const comparison = aValue > bValue ? 1 : -1;
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      });
    }

    return result;
  }, [searchQuery, activeFilters, sortConfig]);

  // Count active filters for badge
  const activeCount = 
      activeFilters.status.length + 
      activeFilters.rentStatus.length + 
      activeFilters.leaseStatus.length + 
      activeFilters.propertyIds.length +
      (activeFilters.hasOpenTickets ? 1 : 0) +
      (activeFilters.leaseExpiringDays ? 1 : 0) + 
      (activeFilters.balanceMin || activeFilters.balanceMax ? 1 : 0);



  const SortHeader = ({ label, sortKey, className }: { label: string, sortKey: keyof Tenant, className?: string }) => (
    <div 
        onClick={() => handleSort(sortKey)}
        className={cn(
            "flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors select-none", 
            sortConfig?.key === sortKey ? "text-primary font-bold" : "",
            className
        )}
    >
        {label}
        {sortConfig?.key === sortKey ? (
            sortConfig.direction === 'asc' ? <ArrowUp size={12} /> : <ArrowDown size={12} />
        ) : (
            <ArrowUpDown size={12} className="opacity-0 group-hover:opacity-50 transition-opacity" />
        )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tenants</h1>
          <p className="text-muted-foreground">All active and historical renters.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm">
             <Plus size={16} />
             Add Tenant
           </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm max-w-2xl">
         <Search className="text-muted-foreground ml-2" size={18} />
         <input 
            type="text" 
            placeholder="Search by name, email, or unit..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground outline-none"
         />
         <div className="w-px h-6 bg-border mx-2" />
         <button 
            onClick={() => setIsFilterOpen(true)}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                activeCount > 0 
                    ? "bg-primary/10 text-primary hover:bg-primary/20" 
                    : "text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
         >
            <Filter size={14} />
            Filters
            {activeCount > 0 && (
                <span className="bg-primary text-primary-foreground text-[10px] px-1.5 rounded-full h-4 min-w-[1rem] flex items-center justify-center">
                    {activeCount}
                </span>
            )}
         </button>
      </div>

      {/* Active Filters Summary (Optional but good UX) */}
      {activeCount > 0 && (
          <div className="flex gap-2 flex-wrap">
              {activeFilters.hasOpenTickets && (
                  <div className="text-xs bg-card border rounded-full px-2 py-1 flex items-center gap-1">
                      Checking Maintenance
                  </div>
              )}
              {activeFilters.propertyIds.length > 0 && (
                  <div className="text-xs bg-card border rounded-full px-2 py-1 flex items-center gap-1">
                      {activeFilters.propertyIds.length} Properties
                  </div>
              )}
          </div>
      )}

      {/* Tenant List */}
      <div className="space-y-3">
        {/* Table Header - Aligned with TenantRow flexible layout */}
        <div className="hidden md:flex px-4 py-2 items-center gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider group">
             {/* Identity */}
             <div className="flex-1 min-w-[200px]">
                <SortHeader label="Tenant" sortKey="name" />
             </div>
             {/* Property */}
             <div className="flex-1 max-w-[200px]">
                <SortHeader label="Property" sortKey="propertyName" />
             </div>
             {/* Status Grid */}
             <div className="flex-[2] grid grid-cols-3 gap-4">
                 <SortHeader label="Lease" sortKey="leaseStatus" />
                 <SortHeader label="Status" sortKey="rentStatus" />
                 <SortHeader label="Balance" sortKey="balance" />
             </div>
             {/* Actions Spacer */}
             <div className="min-w-[50px]"></div>
        </div>

        {filteredAndSortedTenants.length > 0 ? (
            filteredAndSortedTenants.map(t => (
                <TenantRow key={t.id} tenant={t} />
            ))
        ) : (
            <div className="text-center py-12 text-muted-foreground bg-card/50 rounded-xl border border-dashed">
                <p>No tenants found matching your criteria.</p>
                <button 
                    onClick={() => { setActiveFilters(INITIAL_FILTERS); setSearchQuery(''); }}
                    className="mt-2 text-primary hover:underline text-sm font-medium"
                >
                    Clear all filters
                </button>
            </div>
        )}
      </div>

      <TenantFilterDrawer 
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        currentFilters={activeFilters}
        onApply={setActiveFilters}
        onReset={() => setActiveFilters(INITIAL_FILTERS)}
      />

    </div>
  );
}
