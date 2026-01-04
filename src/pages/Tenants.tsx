
import { useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

type RentStatus = 'paid' | 'late' | 'partial';

interface Tenant {
  id: string;
  name: string;
  email: string;
  phone?: string;
  propertyName: string;
  unitNumber: string;
  leaseEndDate: string;
  rentAmount: number;
  rentStatus: RentStatus;
  balance: number;
  flags: string[]; // e.g., 'overdue', 'ending_soon', 'maintenance'
  lastPaymentDate?: string;
  paymentMethod?: string;
  maintenanceRequestCount: number;
}

// --- Mock Data ---

const MOCK_TENANTS: Tenant[] = [
  {
    id: 't1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '555-0123',
    propertyName: 'Oak Street Apartments',
    unitNumber: '3B',
    leaseEndDate: '2024-02-15',
    rentAmount: 1450,
    rentStatus: 'late',
    balance: 1450,
    flags: ['overdue', 'ending_soon'],
    lastPaymentDate: '2023-12-01',
    paymentMethod: 'Bank Transfer (**4567)',
    maintenanceRequestCount: 0
  },
  {
    id: 't2',
    name: 'Michael Chen',
    email: 'm.chen@example.com',
    propertyName: 'Highland Lofts',
    unitNumber: '102',
    leaseEndDate: '2024-08-01',
    rentAmount: 2300,
    rentStatus: 'paid',
    balance: 0,
    flags: [],
    lastPaymentDate: '2024-01-01',
    paymentMethod: 'Credit Card (**8899)',
    maintenanceRequestCount: 2
  },
  {
    id: 't3',
    name: 'Sarah Johnson',
    email: 's.johnson@example.com',
    propertyName: 'Highland Lofts',
    unitNumber: '205',
    leaseEndDate: '2024-06-30',
    rentAmount: 2100,
    rentStatus: 'partial',
    balance: 450,
    flags: ['partial_payment'],
    lastPaymentDate: '2024-01-03',
    paymentMethod: 'Auto-Pay',
    maintenanceRequestCount: 0
  },
  {
    id: 't4',
    name: 'David Wilson',
    email: 'dwilson@example.com',
    propertyName: 'Sunset Duplex',
    unitNumber: 'A',
    leaseEndDate: '2024-11-15',
    rentAmount: 1850,
    rentStatus: 'paid',
    balance: 0,
    flags: ['maintenance_high'],
    lastPaymentDate: '2024-01-01',
    paymentMethod: 'Check',
    maintenanceRequestCount: 4
  },
  {
    id: 't5',
    name: 'Emily Davis',
    email: 'emily.d@example.com',
    propertyName: 'The Oakley',
    unitNumber: '4A',
    leaseEndDate: '2024-03-01',
    rentAmount: 1200,
    rentStatus: 'paid',
    balance: 0,
    flags: [],
    lastPaymentDate: '2024-01-02',
    paymentMethod: 'Stripe',
    maintenanceRequestCount: 0
  }
];

// --- Components ---

const StatusBadge = ({ status }: { status: RentStatus }) => {
  const styles = {
    paid: 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20',
    late: 'bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20',
    partial: 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20'
  };

  const labels = {
    paid: 'Paid',
    late: 'Late',
    partial: 'Partial'
  };

  return (
    <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide", styles[status])}>
      {labels[status]}
    </span>
  );
};

const TenantRow = ({ tenant }: { tenant: Tenant }) => {
  const [expanded, setExpanded] = useState(false);

  const daysUntilLeaseEnd = Math.ceil((new Date(tenant.leaseEndDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const isLeaseEndingSoon = daysUntilLeaseEnd <= 60;

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
             <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-muted-foreground font-medium text-sm">
                {tenant.name.split(' ').map(n => n[0]).join('')}
             </div>
             <div>
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                    {tenant.name}
                    {tenant.flags.includes('overdue') && <AlertTriangle size={14} className="text-rose-500" />}
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
                <div className={cn("text-sm font-medium flex items-center gap-1.5", isLeaseEndingSoon && "text-amber-600 dark:text-amber-500")}>
                    {isLeaseEndingSoon ? (
                        <>
                            <Clock size={14} /> Ends in {daysUntilLeaseEnd} days
                        </>
                    ) : (
                        <span className="text-foreground">Active</span>
                    )}
                </div>
            </div>

            {/* Rent Status */}
            <div>
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <StatusBadge status={tenant.rentStatus} />
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
                 <div className="p-1.5 rounded-full bg-amber-100/50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500" title="Open Maintenance Req">
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
                                <span className="font-medium">${tenant.rentAmount}/mo</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Term</span>
                                <span className="font-medium">12 Months</span>
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
                                <span className="font-medium">{tenant.paymentMethod || '—'}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">History</span>
                                <a href="#" className="text-primary hover:underline text-xs">View Ledger</a>
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
                                <div className="text-xs text-muted-foreground mt-1">Last request: Leaking faucet (2 days ago)</div>
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
                             <button className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-foreground bg-white dark:bg-card border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
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
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground outline-none"
         />
         <div className="w-px h-6 bg-border mx-2" />
         <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Filter size={14} />
            Filters
         </button>
      </div>

      {/* Tenant List */}
      <div className="space-y-3">
        {MOCK_TENANTS.map(t => (
            <TenantRow key={t.id} tenant={t} />
        ))}
      </div>

    </div>
  );
}
