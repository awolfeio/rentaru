
import { useState } from 'react';
import {
  CreditCard,
  Search,
  Filter,
  Plus,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
  Banknote,
  Wallet,
  Building,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

type PaymentStatus = 'paid' | 'pending' | 'failed' | 'late';
type PaymentType = 'rent' | 'fee' | 'adjustment';
type PaymentMethod = 'ach' | 'card' | 'cash' | 'check';

interface Payment {
  id: string;
  date: string;
  tenantName: string;
  propertyName: string;
  unitNumber: string;
  type: PaymentType;
  amount: number;
  method: PaymentMethod;
  last4?: string;
  status: PaymentStatus;
  processorRef?: string;
  failureReason?: string;
  nextRetryDate?: string;
}

// --- Mock Data ---

const MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    date: '2024-01-05',
    tenantName: 'Jane Smith',
    propertyName: 'Oak Street Apartments',
    unitNumber: '3B',
    type: 'rent',
    amount: 1450.00,
    method: 'ach',
    last4: '4492',
    status: 'paid',
    processorRef: 'ch_1Ok...'
  },
  {
    id: 'pay_2',
    date: '2024-01-04',
    tenantName: 'David Wilson',
    propertyName: 'Sunset Duplex',
    unitNumber: 'A',
    type: 'rent',
    amount: 1950.00,
    method: 'card',
    last4: '1092',
    status: 'failed',
    processorRef: 'ch_1Oj...',
    failureReason: 'Insufficient funds',
    nextRetryDate: '2024-01-06'
  },
  {
    id: 'pay_3',
    date: '2024-01-01',
    tenantName: 'Michael Chen',
    propertyName: 'Highland Lofts',
    unitNumber: '102',
    type: 'rent',
    amount: 2300.00,
    method: 'ach',
    last4: '8821',
    status: 'pending',
    processorRef: 'py_1Oh...'
  },
  {
    id: 'pay_4',
    date: '2023-12-28',
    tenantName: 'Sarah Jones',
    propertyName: 'Downtown Lofts',
    unitNumber: '404',
    type: 'fee',
    amount: 50.00,
    method: 'card',
    last4: '5543',
    status: 'late',
    processorRef: 'ch_1Og...'
  }
];

// --- Components ---

const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const styles = {
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    failed: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
    late: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  };

  const icons = {
    paid: <CheckCircle size={12} className="mr-1.5" />,
    pending: <Clock size={12} className="mr-1.5" />,
    failed: <AlertCircle size={12} className="mr-1.5" />,
    late: <AlertCircle size={12} className="mr-1.5" />,
  };

  return (
    <span className={cn("inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full border border-transparent uppercase tracking-wider", styles[status])}>
      {icons[status]} {status}
    </span>
  );
};

const PaymentRow = ({ payment }: { payment: Payment }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "group border-b last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors",
      expanded && "bg-slate-50/80 dark:bg-slate-800/50"
    )}>
      {/* Primary Row Content */}
      <div
        className="flex items-center gap-6 p-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Date */}
        <div className="w-32 flex-shrink-0 text-sm text-muted-foreground tabular-nums">
          {new Date(payment.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>

        {/* Tenant/Context */}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm text-foreground truncate">{payment.tenantName}</div>
          <div className="text-xs text-muted-foreground truncate">{payment.propertyName} · {payment.unitNumber}</div>
        </div>

        {/* Type & Method - Desktop */}
        <div className="hidden lg:flex w-56 flex-shrink-0 items-center gap-3">
          <span className="text-xs uppercase font-semibold text-muted-foreground">{payment.type}</span>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center text-xs text-muted-foreground">
            {payment.method === 'ach' ? <Banknote size={14} className="mr-1" /> : <CreditCard size={14} className="mr-1" />}
            {payment.method.toUpperCase()} •••• {payment.last4}
          </div>
        </div>

        {/* Status */}
        <div className="w-32 flex-shrink-0">
          <StatusBadge status={payment.status} />
        </div>

        {/* Amount */}
        <div className="w-32 flex-shrink-0 text-right font-medium text-sm tabular-nums">
          ${payment.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>

        {/* Expand Chevron */}
        <div className="w-6 flex-shrink-0 flex justify-end">
          <ChevronRight size={16} className={cn("text-muted-foreground transition-transform duration-200", expanded && "rotate-90")} />
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
            className="overflow-hidden bg-slate-50 dark:bg-slate-900/40 border-t border-border/50"
          >
            <div className="p-4 pl-8 lg:pl-[4.5rem] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">

              {/* Column 1: Metadata */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Transaction Info</div>
                <div className="grid grid-cols-2 gap-y-1 gap-x-2">
                  <span className="text-muted-foreground">ID</span>
                  <span className="font-mono text-xs text-foreground">{payment.id}</span>

                  <span className="text-muted-foreground">Processor</span>
                  <span className="font-mono text-xs text-foreground">{payment.processorRef}</span>

                  <span className="text-muted-foreground">Processed</span>
                  <span className="text-foreground">{payment.date}</span>
                </div>
              </div>

              {/* Column 2: Context */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Context</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Building size={14} className="text-muted-foreground" />
                    <span>{payment.propertyName}, Unit {payment.unitNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet size={14} className="text-muted-foreground" />
                    <span>Sent via {payment.method.toUpperCase()} ending in {payment.last4}</span>
                  </div>
                </div>
              </div>

              {/* Column 3: Status Details (Conditional) */}
              <div className="space-y-3">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Status Details</div>
                {payment.status === 'failed' ? (
                  <div className="bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded p-2 text-xs">
                    <div className="font-medium text-rose-700 dark:text-rose-400 mb-0.5">Payment Failed</div>
                    <div className="text-rose-600 dark:text-rose-300">Reason: {payment.failureReason}</div>
                    {payment.nextRetryDate && (
                      <div className="mt-1 text-rose-600 dark:text-rose-300 flex items-center gap-1">
                        <RefreshCw size={10} /> Auto-retry on {payment.nextRetryDate}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-muted-foreground text-xs italic">
                    No exceptions or warnings.
                  </div>
                )}
              </div>

              {/* Column 4: Actions */}
              <div className="flex flex-col justify-end gap-2 border-l border-border/50 pl-6">
                {payment.status === 'failed' && (
                  <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors shadow-sm w-full">
                    <RefreshCw size={14} /> Retry Payment
                  </button>
                )}
                {payment.status === 'late' && (
                  <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-white dark:bg-card border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm w-full">
                    <Clock size={14} /> Send Reminder
                  </button>
                )}
                <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-white dark:bg-card border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm w-full text-muted-foreground hover:text-foreground">
                  View Tenant Profile <ArrowRight size={14} />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function PaymentsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Rent and fee transactions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm shadow-sm">
            <Plus size={16} />
            Record Payment
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm w-full">
        <Search className="text-muted-foreground ml-2" size={18} />
        <input
          type="text"
          placeholder="Search by tenant, unit, or ref ID..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground outline-none"
        />
        <div className="w-px h-6 bg-border mx-2" />
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <Filter size={14} />
          Filters
        </button>
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          This Month <ChevronDown size={14} />
        </button>
      </div>

      {/* Payment List */}
      <div className="border rounded-xl bg-card shadow-sm overflow-hidden min-h-[400px]">
        <div className="flex items-center gap-6 px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="w-32 flex-shrink-0">Date</div>
          <div className="flex-1 min-w-0">Tenant & Context</div>
          <div className="hidden lg:block w-56 flex-shrink-0">Method</div>
          <div className="w-32 flex-shrink-0">Status</div>
          <div className="w-32 flex-shrink-0 text-right">Amount</div>
          <div className="w-6 flex-shrink-0"></div>
        </div>
        <div className="divide-y divide-border/50">
          {MOCK_PAYMENTS.map(p => (
            <PaymentRow key={p.id} payment={p} />
          ))}
        </div>
      </div>

    </div>
  );
}
