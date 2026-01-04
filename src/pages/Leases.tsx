
import { useState } from 'react';
import { 
  FileText, 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  Clock, 
  Calendar, 
  FileCheck,
  AlertTriangle,
  MoreVertical,
  Download,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

type LeaseStatus = 'active' | 'ending' | 'expired' | 'draft';
type RenewalStatus = 'pending' | 'offered' | 'renewed' | 'not_offered';

interface Lease {
  id: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  startDate: string;
  endDate: string;
  rentAmount: number;
  securityDeposit: number;
  status: LeaseStatus;
  renewalStatus: RenewalStatus;
  documentUrl?: string;
}

// --- Mock Data ---

const MOCK_LEASES: Lease[] = [
  {
    id: 'l1',
    tenantName: 'Jane Smith',
    propertyName: 'Oak Street Apartments',
    unitNumber: '3B',
    startDate: '2023-01-01',
    endDate: '2024-03-01', // Ending soon
    rentAmount: 1450,
    securityDeposit: 1450,
    status: 'ending',
    renewalStatus: 'pending',
    documentUrl: '#'
  },
  {
    id: 'l2',
    tenantName: 'Michael Chen',
    propertyName: 'Highland Lofts',
    unitNumber: '102',
    startDate: '2023-08-01',
    endDate: '2024-08-01',
    rentAmount: 2300,
    securityDeposit: 2300,
    status: 'active',
    renewalStatus: 'not_offered',
    documentUrl: '#'
  },
  {
    id: 'l3',
    tenantName: 'David Wilson',
    propertyName: 'Sunset Duplex',
    unitNumber: 'A',
    startDate: '2022-11-15',
    endDate: '2023-11-15',
    rentAmount: 1850,
    securityDeposit: 1850,
    status: 'expired',
    renewalStatus: 'not_offered',
    documentUrl: '#'
  },
  {
    id: 'l4',
    tenantName: 'Sarah Johnson',
    propertyName: 'Highland Lofts',
    unitNumber: '205',
    startDate: '2023-06-30',
    endDate: '2024-06-30',
    rentAmount: 2100,
    securityDeposit: 2100,
    status: 'active',
    renewalStatus: 'not_offered',
    documentUrl: '#'
  }
];

// --- Components ---

const StatusBadge = ({ status }: { status: LeaseStatus }) => {
  const styles = {
    active: 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20',
    ending: 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20',
    expired: 'bg-slate-100/50 text-slate-700 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50',
    draft: 'bg-blue-100/50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/20'
  };

  const labels = {
    active: 'Active',
    ending: 'Ending Soon',
    expired: 'Expired',
    draft: 'Draft'
  };

  return (
    <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide", styles[status])}>
      {labels[status]}
    </span>
  );
};

const LeaseTimeline = ({ start, end }: { start: string, end: string }) => {
    const totalDuration = new Date(end).getTime() - new Date(start).getTime();
    const elapsed = new Date().getTime() - new Date(start).getTime();
    const progress = Math.min(Math.max((elapsed / totalDuration) * 100, 0), 100);

    return (
        <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mt-1">
            <div 
                className={cn("h-full rounded-full", progress > 90 ? "bg-amber-500" : "bg-primary")} 
                style={{ width: `${progress}%` }} 
            />
        </div>
    )
}

const LeaseRow = ({ lease }: { lease: Lease }) => {
  const [expanded, setExpanded] = useState(false);

  const daysRemaining = Math.ceil((new Date(lease.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
  const isEndingSoon = daysRemaining > 0 && daysRemaining <= 60;

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
        {/* Tenant/Lease Identity */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <FileText size={20} />
             </div>
             <div>
                <h3 className="font-semibold text-foreground">{lease.tenantName}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                   {lease.propertyName} · Unit {lease.unitNumber}
                </div>
             </div>
          </div>
        </div>

        {/* Timeline Context */}
        <div className="flex-1 md:max-w-[300px]">
             <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>{new Date(lease.startDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                <span className={cn(isEndingSoon && "text-amber-600 dark:text-amber-500 font-medium")}>
                    {new Date(lease.endDate).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                </span>
             </div>
             <LeaseTimeline start={lease.startDate} end={lease.endDate} />
             {isEndingSoon && (
                 <div className="text-[10px] text-amber-600 dark:text-amber-500 mt-1 font-medium flex items-center gap-1">
                     <AlertTriangle size={10} /> Expires in {daysRemaining} days
                 </div>
             )}
        </div>

        {/* Status Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4 items-center pl-4 border-l border-border/50 ml-4">
            
            {/* Status */}
            <div>
                <div className="text-xs text-muted-foreground mb-1">Status</div>
                <StatusBadge status={lease.status} />
            </div>

            {/* Rent */}
            <div>
                <div className="text-xs text-muted-foreground mb-1">Rent</div>
                <div className="text-sm font-medium">
                    ${lease.rentAmount.toLocaleString()}<span className="text-muted-foreground font-normal text-xs">/mo</span>
                </div>
            </div>
        </div>

        {/* Actions & Chevron */}
        <div className="flex items-center gap-3 justify-end min-w-[50px]">
             {lease.renewalStatus === 'pending' && (
                 <div className="hidden md:flex items-center text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded">
                    Renewal Pending
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
                <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                    
                    {/* Terms Snapshot */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Calendar size={14} /> Terms
                        </h4>
                        <div className="space-y-2 text-sm bg-card border rounded-md p-3">
                            <div className="flex justify-between border-b pb-2 border-border/50">
                                <span className="text-muted-foreground">Term Start</span>
                                <span className="font-medium">{lease.startDate}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2 border-border/50">
                                <span className="text-muted-foreground">Term End</span>
                                <span className="font-medium">{lease.endDate}</span>
                            </div>
                            <div className="flex justify-between border-b pb-2 border-border/50">
                                <span className="text-muted-foreground">Monthly Rent</span>
                                <span className="font-medium">${lease.rentAmount.toLocaleString()}</span>
                            </div>
                             <div className="flex justify-between">
                                <span className="text-muted-foreground">Security Deposit</span>
                                <span className="font-medium">${lease.securityDeposit.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Renewal & Docs */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <FileCheck size={14} /> Status & Docs
                        </h4>
                        <div className="grid gap-3">
                            <div className="flex items-center justify-between p-3 bg-card border rounded-md">
                                <div>
                                    <div className="text-sm font-medium">Original Lease.pdf</div>
                                    <div className="text-xs text-muted-foreground">Signed Jan 1, 2023</div>
                                </div>
                                <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors text-muted-foreground">
                                    <Download size={16} />
                                </button>
                            </div>
                             
                             <div className="p-3 bg-card border rounded-md">
                                 <div className="text-xs text-muted-foreground mb-1">Renewal Status</div>
                                 <div className="flex items-center gap-2">
                                     {lease.renewalStatus === 'pending' ? (
                                         <span className="flex items-center gap-1.5 text-sm font-medium text-amber-600">
                                             <Clock size={14} /> Decision Pending
                                         </span>
                                     ) : (
                                          <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                                             Checking availability...
                                         </span>
                                     )}
                                 </div>
                             </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</h4>
                        <div className="flex flex-col gap-2">
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md hover:bg-primary/90 transition-colors shadow-sm justify-center">
                                <Send size={14} /> Send Renewal Offer
                            </button>
                             <button className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-foreground bg-white dark:bg-card border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm justify-center">
                                <Download size={14} className="text-muted-foreground" /> Download PDF
                            </button>
                            <button className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-foreground bg-white dark:bg-card border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm justify-center">
                                <MoreVertical size={14} className="text-muted-foreground" /> View Details
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

export default function LeasesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Leases</h1>
          <p className="text-muted-foreground">Active, upcoming, and historical lease agreements.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm">
             <Plus size={16} />
             Create Lease
           </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm max-w-2xl">
         <Search className="text-muted-foreground ml-2" size={18} />
         <input 
            type="text" 
            placeholder="Search by tenant, unit, or property..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground outline-none"
         />
         <div className="w-px h-6 bg-border mx-2" />
         <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Filter size={14} />
            Filters
         </button>
      </div>

      {/* Leases List */}
      <div className="space-y-3">
        {MOCK_LEASES.map(lease => (
            <LeaseRow key={lease.id} lease={lease} />
        ))}
      </div>

    </div>
  );
}
