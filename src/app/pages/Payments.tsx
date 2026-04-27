
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
  ArrowRight,
  X
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Payment, PaymentStatus } from '../../features/payments/types';
import { getPaymentMethodLabel } from '../../features/payments/utils/paymentMethodLabels';
import { RecordManualPaymentDrawer } from '../../features/payments/components/RecordManualPaymentDrawer';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';

// --- Constants ---
const ORIGIN_OPTIONS = [
  { value: 'processor', label: 'Processor' },
  { value: 'manual', label: 'Manual' }
];

const STATUS_OPTIONS = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
  { value: 'late', label: 'Late' }
];

const METHOD_OPTIONS = [
  { value: 'ach', label: 'ACH' },
  { value: 'card', label: 'Card' },
  { value: 'check', label: 'Check' },
  { value: 'cash', label: 'Cash' }
];

// --- Mock Data ---

const INITIAL_MOCK_PAYMENTS: Payment[] = [
  {
    id: 'pay_1',
    date: '2024-01-05',
    tenantName: 'Jane Smith',
    propertyName: 'Oak Street Apartments',
    unitNumber: '3B',
    type: 'rent',
    amount: 1450.00,
    method: 'ach',
    origin: 'processor',
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
    origin: 'processor',
    last4: '1092',
    status: 'failed',
    processorRef: 'ch_1Oj...',
    failureReason: 'Insufficient funds',
    nextRetryDate: '2024-01-06'
  },
  {
    id: 'pay_manual_1',
    date: '2024-01-02',
    tenantName: 'Alice Green',
    propertyName: 'Highland Lofts',
    unitNumber: '204',
    type: 'rent',
    amount: 1200.00,
    method: 'check',
    origin: 'manual',
    status: 'paid',
    manualRef: '1042',
    notes: 'Dropped off at office.',
    editable: true
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
    origin: 'processor',
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
    origin: 'processor',
    last4: '5543',
    status: 'late',
    processorRef: 'ch_1Og...'
  }
];

// --- Components ---

const StatusBadge = ({ status }: { status: PaymentStatus }) => {
  const styles: Record<PaymentStatus, string> = {
    paid: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
    pending: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
    failed: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400',
    late: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
    tentative: 'bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400',
    voided: 'bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400',
  };

  const icons: Record<PaymentStatus, JSX.Element> = {
    paid: <CheckCircle size={12} className="mr-1.5" />,
    pending: <Clock size={12} className="mr-1.5" />,
    failed: <AlertCircle size={12} className="mr-1.5" />,
    late: <AlertCircle size={12} className="mr-1.5" />,
    tentative: <Clock size={12} className="mr-1.5" />,
    voided: <AlertCircle size={12} className="mr-1.5" />,
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
            {payment.origin === 'manual' ? (
              <Wallet size={14} className="mr-1.5 text-blue-500" />
            ) : payment.method === 'ach' ? (
              <Banknote size={14} className="mr-1.5" />
            ) : (
              <CreditCard size={14} className="mr-1.5" />
            )}
            {payment.origin === 'manual' ? (
              <span className="font-medium text-blue-600 dark:text-blue-400 mr-1.5">MANUAL</span>
            ) : null}
            {payment.origin === 'manual' ? <span className="mr-1.5">·</span> : null}
            <span className={cn(payment.origin === 'manual' && "uppercase")}>{getPaymentMethodLabel(payment)}</span>
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

                  <span className="text-muted-foreground">{payment.origin === 'manual' ? 'Manual Ref' : 'Processor'}</span>
                  <span className="font-mono text-xs text-foreground">{payment.origin === 'manual' ? payment.manualRef || '-' : payment.processorRef}</span>

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
                    <span>Sent via {getPaymentMethodLabel(payment)}</span>
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
                {payment.origin === 'manual' && payment.editable && (
                  <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-white dark:bg-card border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm w-full">
                    Edit Manual Payment
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
  const [payments, setPayments] = useState<Payment[]>(INITIAL_MOCK_PAYMENTS);
  const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [originFilter, setOriginFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [methodFilter, setMethodFilter] = useState<string[]>([]);

  const filteredPayments = payments.filter(p => {
    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const match = 
        p.tenantName.toLowerCase().includes(q) || 
        p.unitNumber.toLowerCase().includes(q) ||
        (p.manualRef && p.manualRef.toLowerCase().includes(q)) ||
        (p.processorRef && p.processorRef.toLowerCase().includes(q));
      if (!match) return false;
    }
    
    // Filters
    if (originFilter.length && !originFilter.includes(p.origin)) return false;
    if (statusFilter.length && !statusFilter.includes(p.status)) return false;
    if (methodFilter.length && !methodFilter.includes(p.method)) return false;

    return true;
  });

  const handleRecordManualPayment = (paymentData: Partial<Payment>) => {
    setPayments(prev => [paymentData as Payment, ...prev]);
    setRecordPaymentOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      <RecordManualPaymentDrawer 
        isOpen={recordPaymentOpen}
        onClose={() => setRecordPaymentOpen(false)}
        onSubmit={handleRecordManualPayment}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">Rent and fee transactions.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setRecordPaymentOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm shadow-sm"
          >
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
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by tenant, unit, or ref ID..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground outline-none"
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium mr-1">Filter by:</span>
        <FilterDropdown
          label="Origin"
          options={ORIGIN_OPTIONS}
          selected={originFilter}
          onChange={setOriginFilter}
        />
        <FilterDropdown
          label="Status"
          options={STATUS_OPTIONS}
          selected={statusFilter}
          onChange={setStatusFilter}
        />
        <FilterDropdown
          label="Method"
          options={METHOD_OPTIONS}
          selected={methodFilter}
          onChange={setMethodFilter}
        />
        <span className="ml-auto text-xs text-muted-foreground">{filteredPayments.length} payment{filteredPayments.length !== 1 ? 's' : ''}</span>
        {(originFilter.length + statusFilter.length + methodFilter.length) > 0 && (
          <button
            onClick={() => { setOriginFilter([]); setStatusFilter([]); setMethodFilter([]); }}
            className="ml-2 text-xs text-muted-foreground hover:text-rose-500 flex items-center gap-1 transition-colors"
          >
            <X size={11} /> Clear all
          </button>
        )}
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
          {filteredPayments.length > 0 ? (
            filteredPayments.map(p => (
              <PaymentRow key={p.id} payment={p} />
            ))
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              No payments match your search or filter criteria.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
