
import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Calculator, Search, Filter, ChevronDown, Calendar, Building2, Tag,
  FileSpreadsheet, ArrowUpRight, ArrowDownRight, ChevronRight, Link as LinkIcon,
  LayoutDashboard, BarChart3, Receipt, BookOpen, TrendingUp, TrendingDown,
  AlertTriangle, CheckCircle2, Clock, Square, CheckSquare, Lightbulb,
  ChevronUp, ChevronsUpDown, Minus, Check, X
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MOCK_PROPERTIES } from '@/shared/mockData/properties';

// --- Types ---

type TransactionType = 'income' | 'expense';
type TransactionStatus = 'posted' | 'pending' | 'failed' | 'refunded' | 'voided';
type PaymentMethod = 'ach' | 'card' | 'cash' | 'check' | 'manual' | 'other';
type TransactionCategory = 'rental_income' | 'late_fees' | 'maintenance' | 'repairs' | 'utilities' | 'management_fees' | 'insurance' | 'taxes' | 'hoa' | 'mortgage_interest' | 'capex' | 'other';
type ReviewStatus = 'needs_review' | 'reviewed' | 'ignored';
type AccountingTab = 'overview' | 'transactions' | 'performance' | 'tax' | 'reports';

type ExportScope = 'all_transactions' | 'current_filters' | 'selected_transactions' | 'custom_query';
type ExportReportType = 'transaction_detail' | 'property_summary' | 'category_summary' | 'tax_summary';

interface ExportFilters {
  scope: ExportScope;
  reportType: ExportReportType;
  propertyIds: string[];
  transactionTypes: TransactionType[];
  statuses: TransactionStatus[];
  categories: TransactionCategory[];
  taxCategories: string[];
  reviewStatuses: ReviewStatus[];
  deductibleOnly: boolean;
  missingReceiptsOnly: boolean;
  searchQuery: string;
}

interface LedgerEntry {
  id: string;
  date: string;
  postedAt?: string;
  description: string;
  category: TransactionCategory;
  propertyId: string;
  propertyName: string;
  unitNumber?: string;
  tenantName?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  vendorName?: string;
  sourceType?: 'payment' | 'maintenance_ticket' | 'manual_entry' | 'import' | 'system_fee';
  sourceRef?: string;
  memo?: string;
  receiptUrl?: string;
  createdAt: string;
  updatedAt: string;
  // Phase 2
  reviewStatus?: ReviewStatus;
  tags?: string[];
  deductible?: boolean;
  taxCategory?: string;
  suggestedCategory?: TransactionCategory;
}

interface ExpectedRent {
  propertyId: string;
  propertyName: string;
  unitNumber: string;
  tenantName: string;
  expectedAmount: number;
  dueDate: string;
}

const CATEGORY_LABELS: Record<TransactionCategory, string> = {
  rental_income: 'Rental Income', late_fees: 'Late Fees', maintenance: 'Maintenance',
  repairs: 'Repairs', utilities: 'Utilities', management_fees: 'Mgmt Fees',
  insurance: 'Insurance', taxes: 'Taxes', hoa: 'HOA',
  mortgage_interest: 'Mortgage Interest', capex: 'CapEx', other: 'Other',
};

const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  ach: 'ACH', card: 'Card', cash: 'Cash', check: 'Check', manual: 'Manual', other: 'Other',
};

const SOURCE_TYPE_LABELS: Record<string, string> = {
  payment: 'Payment', maintenance_ticket: 'Maintenance Ticket',
  manual_entry: 'Manual Entry', import: 'Import', system_fee: 'System Fee',
};

// IRS Schedule E-aligned tax category map
const TAX_CATEGORY_MAP: Partial<Record<TransactionCategory, string>> = {
  rental_income: 'Rental Income', late_fees: 'Rental Income',
  maintenance: 'Cleaning & Maintenance', repairs: 'Repairs',
  utilities: 'Utilities', management_fees: 'Management Fees',
  insurance: 'Insurance', taxes: 'Taxes', hoa: 'HOA Dues',
  mortgage_interest: 'Mortgage Interest', capex: 'Depreciation / CapEx Review',
  other: 'Other',
};

const DEDUCTIBLE_CATEGORIES: TransactionCategory[] = [
  'maintenance','repairs','utilities','management_fees','insurance','taxes','hoa','mortgage_interest','capex',
];

// Mock expected rent schedule
const MOCK_EXPECTED_RENT: ExpectedRent[] = [
  { propertyId: 'p1', propertyName: 'Oak Street Apartments', unitNumber: '3B', tenantName: 'Jane Smith', expectedAmount: 1450, dueDate: '2024-01-01' },
  { propertyId: 'p2', propertyName: 'Highland Lofts', unitNumber: '101', tenantName: 'Michael Chen', expectedAmount: 2300, dueDate: '2024-01-01' },
  { propertyId: 'p2', propertyName: 'Highland Lofts', unitNumber: '102', tenantName: 'Sara Kim', expectedAmount: 1950, dueDate: '2024-01-01' },
  { propertyId: 'p3', propertyName: 'Sunset Duplex', unitNumber: 'A', tenantName: 'Tom Rivera', expectedAmount: 1200, dueDate: '2024-01-01' },
];

// --- Mock Data ---

const MOCK_LEDGER: LedgerEntry[] = [
  { id: 't1', date: '2024-01-05', postedAt: '2024-01-05', description: 'Rent Payment - Jane Smith', category: 'rental_income', propertyId: 'p1', propertyName: 'Oak Street Apartments', unitNumber: '3B', tenantName: 'Jane Smith', amount: 1450, type: 'income', status: 'posted', paymentMethod: 'ach', sourceType: 'payment', sourceRef: 'PMT-8821', memo: '', reviewStatus: 'reviewed', deductible: false, taxCategory: 'Rental Income', createdAt: '2024-01-05T09:00:00Z', updatedAt: '2024-01-05T09:00:00Z' },
  { id: 't2', date: '2024-01-04', postedAt: '2024-01-04', description: 'Emergency HVAC Repair', category: 'maintenance', propertyId: 'p2', propertyName: 'Highland Lofts', unitNumber: '102', vendorName: 'Arctic Air HVAC', amount: 350, type: 'expense', status: 'posted', paymentMethod: 'check', sourceType: 'maintenance_ticket', sourceRef: 'TKT-991', reviewStatus: 'reviewed', deductible: true, taxCategory: 'Cleaning & Maintenance', tags: ['deductible'], createdAt: '2024-01-04T11:00:00Z', updatedAt: '2024-01-04T11:00:00Z' },
  { id: 't3', date: '2024-01-03', description: 'Water Bill - Dec 2023', category: 'utilities', propertyId: 'p3', propertyName: 'Sunset Duplex', amount: 185.40, type: 'expense', status: 'pending', paymentMethod: 'ach', sourceType: 'manual_entry', memo: 'Covers both units', reviewStatus: 'needs_review', deductible: true, suggestedCategory: 'utilities', createdAt: '2024-01-03T08:00:00Z', updatedAt: '2024-01-03T08:00:00Z' },
  { id: 't4', date: '2024-01-01', postedAt: '2024-01-01', description: 'Rent Payment - Michael Chen', category: 'rental_income', propertyId: 'p2', propertyName: 'Highland Lofts', unitNumber: '102', tenantName: 'Michael Chen', amount: 2300, type: 'income', status: 'posted', paymentMethod: 'card', sourceType: 'payment', sourceRef: 'PMT-8822', receiptUrl: '#', reviewStatus: 'reviewed', deductible: false, taxCategory: 'Rental Income', createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 't5', date: '2024-01-01', postedAt: '2024-01-01', description: 'Management Fee (5%)', category: 'management_fees', propertyId: 'p1', propertyName: 'Oak Street Apartments', amount: 420, type: 'expense', status: 'posted', paymentMethod: 'ach', sourceType: 'system_fee', reviewStatus: 'reviewed', deductible: true, taxCategory: 'Management Fees', tags: ['deductible'], createdAt: '2024-01-01T00:00:00Z', updatedAt: '2024-01-01T00:00:00Z' },
  { id: 't6', date: '2023-12-28', postedAt: '2023-12-28', description: 'Late Fee - Unit 3B', category: 'late_fees', propertyId: 'p1', propertyName: 'Oak Street Apartments', unitNumber: '3B', tenantName: 'Jane Smith', amount: 75, type: 'income', status: 'posted', paymentMethod: 'manual', sourceType: 'manual_entry', reviewStatus: 'reviewed', deductible: false, taxCategory: 'Rental Income', createdAt: '2023-12-28T00:00:00Z', updatedAt: '2023-12-28T00:00:00Z' },
  { id: 't7', date: '2023-12-20', description: 'Property Insurance - Q1', category: 'insurance', propertyId: 'p2', propertyName: 'Highland Lofts', amount: 1100, type: 'expense', status: 'pending', paymentMethod: 'check', sourceType: 'manual_entry', memo: 'Annual policy Q1 installment', reviewStatus: 'needs_review', deductible: true, suggestedCategory: 'insurance', tags: ['needs receipt'], createdAt: '2023-12-20T00:00:00Z', updatedAt: '2023-12-20T00:00:00Z' },
  { id: 't8', date: '2023-12-15', postedAt: '2023-12-15', description: 'Plumbing Repair - Unit A', category: 'repairs', propertyId: 'p3', propertyName: 'Sunset Duplex', unitNumber: 'A', vendorName: 'Rapid Plumbers', amount: 280, type: 'expense', status: 'posted', paymentMethod: 'card', sourceType: 'maintenance_ticket', sourceRef: 'TKT-882', receiptUrl: '#', reviewStatus: 'reviewed', deductible: true, taxCategory: 'Repairs', tags: ['deductible'], createdAt: '2023-12-15T00:00:00Z', updatedAt: '2023-12-15T00:00:00Z' },
];

// --- Filter Dropdown (matches Maintenance page pattern) ---
interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
}
const FilterDropdown = ({ label, options, selected, onChange }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const toggle = (val: string) =>
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);
  const hasActive = selected.length > 0;
  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(o => !o)}
        className={cn('inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors',
          hasActive ? 'bg-primary text-primary-foreground border-primary shadow-sm' : 'bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground')}>
        <Filter size={13} />
        {label}
        {hasActive && <span className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[10px] font-bold">{selected.length}</span>}
        <ChevronDown size={13} className={cn('transition-transform duration-150', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -4, scale: 0.97 }} transition={{ duration: 0.12 }}
            className="absolute left-0 top-full mt-1.5 z-30 w-max bg-card border rounded-xl shadow-lg py-1.5 overflow-hidden">
            {options.map(opt => {
              const checked = selected.includes(opt.value);
              return (
                <button key={opt.value} onClick={() => toggle(opt.value)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left">
                  <span className={cn('flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-colors', checked ? 'bg-primary border-primary text-primary-foreground' : 'border-border bg-background')}>
                    {checked && <Check size={10} strokeWidth={3} />}
                  </span>
                  <span className={cn('font-medium whitespace-nowrap', checked ? 'text-foreground' : 'text-muted-foreground')}>{opt.label}</span>
                </button>
              );
            })}
            {selected.length > 0 && (
              <>
                <div className="h-px bg-border mx-3 my-1" />
                <button onClick={() => onChange([])} className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-muted-foreground hover:text-rose-500 transition-colors">
                  <X size={11} /> Clear
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Status Badge ---
function StatusBadge({ status }: { status: TransactionStatus }) {
  const styles: Record<TransactionStatus, string> = {
    posted:   'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800',
    pending:  'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800',
    failed:   'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800',
    refunded: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700',
    voided:   'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500 dark:border-slate-700',
  };
  const labels: Record<TransactionStatus, string> = { posted: 'Posted', pending: 'Pending', failed: 'Failed', refunded: 'Refunded', voided: 'Voided' };
  return <span className={cn('inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border', styles[status])}>{labels[status]}</span>;
}

const LedgerRow = ({ entry, onUpdate, selected = false, onSelect }: { entry: LedgerEntry; onUpdate: (id: string, patch: Partial<LedgerEntry>) => void; selected?: boolean; onSelect?: () => void }) => {
  const [expanded, setExpanded] = useState(false);
  const [editingCategory, setEditingCategory] = useState(false);
  const [editingMemo, setEditingMemo] = useState(false);
  const [draftCategory, setDraftCategory] = useState<TransactionCategory>(entry.category);
  const [draftMemo, setDraftMemo] = useState(entry.memo ?? '');

  const reviewBadge: Record<ReviewStatus, { label: string; cls: string }> = {
    needs_review: { label: 'Needs Review', cls: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800' },
    reviewed: { label: 'Reviewed', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800' },
    ignored: { label: 'Ignored', cls: 'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-500' },
  };

  const saveCategory = () => {
    onUpdate(entry.id, { category: draftCategory });
    setEditingCategory(false);
  };
  const saveMemo = () => {
    onUpdate(entry.id, { memo: draftMemo });
    setEditingMemo(false);
  };

  return (
    <div className={cn('group border-b last:border-0 transition-colors', selected ? 'bg-blue-50/60 dark:bg-blue-900/10' : 'hover:bg-slate-50/50 dark:hover:bg-slate-800/30', expanded && !selected && 'bg-slate-50/80 dark:bg-slate-800/50')}>
      <div className="grid grid-cols-12 gap-2 px-4 py-3 items-center">
        {/* Checkbox */}
        <div className="col-span-1 flex items-center" onClick={e => { e.stopPropagation(); onSelect?.(); }}>
          <button className="text-muted-foreground hover:text-primary transition-colors">
            {selected ? <CheckSquare size={14} className="text-primary" /> : <Square size={14} />}
          </button>
        </div>
        {/* Date — clicking expands */}
        <div className="col-span-2 text-sm tabular-nums text-foreground cursor-pointer" onClick={() => setExpanded(!expanded)}>
          {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>
        {/* Description — clicking expands */}
        <div className="col-span-4 md:col-span-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className={cn('text-sm font-medium truncate', entry.status === 'pending' && 'opacity-60')}>{entry.description}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
            <span>{entry.propertyName}</span>
            {entry.unitNumber && <><span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/50" /><span>Unit {entry.unitNumber}</span></>}
          </div>
        </div>
        {/* Category */}
        <div className="hidden md:flex col-span-2 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <span className="inline-flex items-center text-xs text-muted-foreground border rounded-full px-2 py-0.5 bg-slate-50 dark:bg-slate-900/50">
            <Tag size={10} className="mr-1.5 opacity-70" />{CATEGORY_LABELS[entry.category]}
          </span>
        </div>
        {/* Status */}
        <div className="hidden md:block col-span-1 cursor-pointer" onClick={() => setExpanded(!expanded)}><StatusBadge status={entry.status} /></div>
        {/* Amount */}
        <div className={cn('col-span-3 md:col-span-2 text-right font-semibold text-sm tabular-nums cursor-pointer', entry.type === 'income' ? 'text-emerald-600 dark:text-emerald-500' : 'text-foreground', entry.status === 'pending' && 'opacity-60')} onClick={() => setExpanded(!expanded)}>
          {entry.type === 'income' ? '+' : '-'}${entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <div className="col-span-1 flex justify-end cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <ChevronRight size={16} className={cn('text-muted-foreground transition-transform duration-200', expanded && 'rotate-90')} />
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden bg-slate-50 dark:bg-slate-900/40 border-t border-border/50">
            <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">

              {/* Metadata */}
              <div className="md:col-span-2 space-y-3">
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div><span className="text-xs uppercase tracking-wide text-muted-foreground block mb-0.5">Ref ID</span><span className="font-mono text-xs">{entry.id.toUpperCase()}</span></div>
                  <div><span className="text-xs uppercase tracking-wide text-muted-foreground block mb-0.5">Status</span><StatusBadge status={entry.status} /></div>
                  {entry.reviewStatus && <div><span className="text-xs uppercase tracking-wide text-muted-foreground block mb-0.5">Review</span><span className={cn('inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border', reviewBadge[entry.reviewStatus].cls)}>{reviewBadge[entry.reviewStatus].label}</span></div>}
                  {entry.deductible !== undefined && <div><span className="text-xs uppercase tracking-wide text-muted-foreground block mb-0.5">Deductible</span><span className={entry.deductible ? 'text-emerald-600 text-xs font-medium' : 'text-muted-foreground text-xs'}>{entry.deductible ? 'Yes' : 'No'}</span></div>}
                  {entry.sourceRef && <div><span className="text-xs uppercase tracking-wide text-muted-foreground block mb-0.5">Source Ref</span><span className="text-primary flex items-center gap-1 cursor-pointer hover:underline"><LinkIcon size={11} />{entry.sourceRef}</span></div>}
                  {entry.sourceType && <div><span className="text-xs uppercase tracking-wide text-muted-foreground block mb-0.5">Source Type</span><span>{SOURCE_TYPE_LABELS[entry.sourceType]}</span></div>}
                  {entry.paymentMethod && <div><span className="text-xs uppercase tracking-wide text-muted-foreground block mb-0.5">Payment Method</span><span>{PAYMENT_METHOD_LABELS[entry.paymentMethod]}</span></div>}
                  {entry.tenantName && <div><span className="text-xs uppercase tracking-wide text-muted-foreground block mb-0.5">Tenant</span><span>{entry.tenantName}</span></div>}
                  {entry.vendorName && <div><span className="text-xs uppercase tracking-wide text-muted-foreground block mb-0.5">Vendor</span><span>{entry.vendorName}</span></div>}
                  <div><span className="text-xs uppercase tracking-wide text-muted-foreground block mb-0.5">Created</span><span className="text-xs">{new Date(entry.createdAt).toLocaleDateString()}</span></div>
                </div>

                {/* Category editor */}
                <div className="pt-2 border-t border-border/50">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground block mb-1.5">Category</span>
                  {editingCategory ? (
                    <div className="flex items-center gap-2">
                      <select className="text-sm border rounded-lg px-2 py-1.5 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none" value={draftCategory} onChange={e => setDraftCategory(e.target.value as TransactionCategory)}>
                        {(Object.keys(CATEGORY_LABELS) as TransactionCategory[]).map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                      </select>
                      <button onClick={saveCategory} className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Save</button>
                      <button onClick={() => setEditingCategory(false)} className="px-3 py-1.5 text-xs font-medium border rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center text-xs border rounded-full px-2 py-0.5 bg-slate-100 dark:bg-slate-800"><Tag size={10} className="mr-1.5 opacity-70" />{CATEGORY_LABELS[entry.category]}</span>
                      <button onClick={() => setEditingCategory(true)} className="text-xs text-primary hover:underline">Edit</button>
                    </div>
                  )}
                </div>

                {/* Memo editor */}
                <div className="pt-2 border-t border-border/50">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground block mb-1.5">Memo</span>
                  {editingMemo ? (
                    <div className="space-y-2">
                      <textarea rows={2} className="w-full text-sm border rounded-lg px-3 py-2 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none resize-none" placeholder="Add a note for your records..." value={draftMemo} onChange={e => setDraftMemo(e.target.value)} />
                      <div className="flex gap-2">
                        <button onClick={saveMemo} className="px-3 py-1.5 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Save</button>
                        <button onClick={() => setEditingMemo(false)} className="px-3 py-1.5 text-xs font-medium border rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground text-xs italic flex-1">{entry.memo || 'No memo added.'}</span>
                      <button onClick={() => setEditingMemo(true)} className="text-xs text-primary hover:underline shrink-0">{entry.memo ? 'Edit' : 'Add Memo'}</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 md:border-l md:pl-6 border-border/50 justify-start pt-1">
                {entry.receiptUrl ? (
                  <a href={entry.receiptUrl} className="px-3 py-2 text-xs font-medium text-center border border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/10 dark:border-emerald-900/30 dark:text-emerald-400 rounded-lg hover:bg-emerald-100 transition-colors">View Receipt</a>
                ) : (
                  <button className="px-3 py-2 text-xs font-medium border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Attach Receipt</button>
                )}
                {entry.sourceRef && (
                  <button className="px-3 py-2 text-xs font-medium border rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-1.5"><LinkIcon size={11} />View Source</button>
                )}
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Phase 2: Overview Tab ────────────────────────────────────────────────────
function OverviewTab({ ledger }: { ledger: LedgerEntry[] }) {
  const posted = ledger.filter(e => e.status === 'posted');
  const income = posted.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const expenses = posted.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
  const needsReview = ledger.filter(e => e.reviewStatus === 'needs_review').length;
  const missingReceipt = ledger.filter(e => e.type === 'expense' && e.status === 'posted' && !e.receiptUrl).length;

  const expectedTotal = MOCK_EXPECTED_RENT.reduce((s, r) => s + r.expectedAmount, 0);
  const receivedRent = posted.filter(e => e.category === 'rental_income').reduce((s, e) => s + e.amount, 0);
  const outstanding = Math.max(0, expectedTotal - receivedRent);
  const collectionRate = expectedTotal > 0 ? Math.round((receivedRent / expectedTotal) * 100) : 100;

  const insights = [
    ledger.filter(e => e.category === 'maintenance' && e.type === 'expense').reduce((s, e) => s + e.amount, 0) > 300 && {
      icon: <AlertTriangle size={16} className="text-amber-500" />, bg: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
      title: 'Maintenance costs elevated at Highland Lofts', detail: '$350 this period — review HVAC work order TKT-991.', action: 'View transactions',
    },
    outstanding > 0 && {
      icon: <Clock size={16} className="text-rose-500" />, bg: 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800',
      title: `$${outstanding.toLocaleString()} expected rent outstanding`, detail: `${MOCK_EXPECTED_RENT.filter(r => !posted.find(e => e.category === 'rental_income' && e.unitNumber === r.unitNumber)).length} unit(s) have not yet paid this period.`, action: 'View rent roll',
    },
    needsReview > 0 && {
      icon: <Lightbulb size={16} className="text-blue-500" />, bg: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
      title: `${needsReview} transaction${needsReview > 1 ? 's' : ''} need review`, detail: 'Categorize or confirm these before exporting tax reports.', action: 'Review now',
    },
  ].filter(Boolean) as { icon: React.ReactNode; bg: string; title: string; detail: string; action: string }[];

  return (
    <div className="space-y-6">
      {/* Rent Collection */}
      <div className="p-4 rounded-xl border bg-card shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">Rent Collection</span>
          <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full border', collectionRate >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200')}>{collectionRate}% collected</span>
        </div>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div><div className="text-xs text-muted-foreground mb-0.5">Expected</div><div className="font-semibold">${expectedTotal.toLocaleString()}</div></div>
          <div><div className="text-xs text-muted-foreground mb-0.5">Received</div><div className="font-semibold text-emerald-600">${receivedRent.toLocaleString()}</div></div>
          <div><div className="text-xs text-muted-foreground mb-0.5">Outstanding</div><div className={cn('font-semibold', outstanding > 0 ? 'text-rose-600' : 'text-muted-foreground')}>${outstanding.toLocaleString()}</div></div>
        </div>
        {outstanding > 0 && (
          <div className="mt-3 pt-3 border-t border-border/50 space-y-1.5">
            {MOCK_EXPECTED_RENT.filter(r => !posted.find(e => e.category === 'rental_income' && e.unitNumber === r.unitNumber)).map(r => (
              <div key={r.unitNumber} className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{r.propertyName} · Unit {r.unitNumber} · {r.tenantName}</span>
                <span className="text-rose-600 font-medium">${r.expectedAmount.toLocaleString()} outstanding</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Insights</div>
          {insights.map((ins, i) => (
            <div key={i} className={cn('flex items-start gap-3 p-4 rounded-xl border', ins.bg)}>
              <div className="mt-0.5 shrink-0">{ins.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{ins.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{ins.detail}</div>
              </div>
              <button className="text-xs text-primary hover:underline shrink-0">{ins.action}</button>
            </div>
          ))}
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="p-3 rounded-lg border bg-card flex items-center gap-3">
          <div className="p-2 rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-900/20"><AlertTriangle size={14} /></div>
          <div><div className="font-medium">{needsReview}</div><div className="text-xs text-muted-foreground">Needs Review</div></div>
        </div>
        <div className="p-3 rounded-lg border bg-card flex items-center gap-3">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600 dark:bg-rose-900/20"><Receipt size={14} /></div>
          <div><div className="font-medium">{missingReceipt}</div><div className="text-xs text-muted-foreground">Missing Receipts</div></div>
        </div>
      </div>
    </div>
  );
}

// ─── Phase 2: Performance Tab ─────────────────────────────────────────────────
function PerformanceTab({ ledger }: { ledger: LedgerEntry[] }) {
  const [sortKey, setSortKey] = useState<'net' | 'income' | 'expenses' | 'maintenance'>('net');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const posted = ledger.filter(e => e.status === 'posted');
  const propertyIds = [...new Set(posted.map(e => e.propertyId))];

  const rows = propertyIds.map(pid => {
    const entries = posted.filter(e => e.propertyId === pid);
    const name = entries[0]?.propertyName ?? pid;
    const income = entries.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
    const expenses = entries.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);
    const maintenance = entries.filter(e => ['maintenance', 'repairs'].includes(e.category)).reduce((s, e) => s + e.amount, 0);
    const net = income - expenses;
    const expenseRatio = income > 0 ? (expenses / income) * 100 : 0;
    const outstanding = MOCK_EXPECTED_RENT.filter(r => r.propertyId === pid && !posted.find(e => e.category === 'rental_income' && e.unitNumber === r.unitNumber)).reduce((s, r) => s + r.expectedAmount, 0);
    return { pid, name, income, expenses, maintenance, net, expenseRatio, outstanding };
  });

  const sorted = [...rows].sort((a, b) => {
    const v = sortKey === 'net' ? a.net - b.net : sortKey === 'income' ? a.income - b.income : sortKey === 'expenses' ? a.expenses - b.expenses : a.maintenance - b.maintenance;
    return sortDir === 'desc' ? -v : v;
  });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortKey(key); setSortDir('desc'); }
  };

  const SortIcon = ({ k }: { k: typeof sortKey }) => sortKey === k
    ? (sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />)
    : <ChevronsUpDown size={12} className="opacity-30" />;

  const fmt = (n: number) => `$${Math.abs(n).toLocaleString(undefined, { minimumFractionDigits: 0 })}`;

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted-foreground">Click column headers to sort. Based on posted transactions.</div>
      <div className="border rounded-xl bg-card shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <th className="px-4 py-3 text-left">Property</th>
              {([['income','Income'],['expenses','Expenses'],['maintenance','Maintenance'],['net','Net']] as const).map(([k, label]) => (
                <th key={k} onClick={() => toggleSort(k)} className="px-4 py-3 text-right cursor-pointer hover:text-foreground transition-colors select-none">
                  <span className="flex items-center justify-end gap-1">{label} <SortIcon k={k} /></span>
                </th>
              ))}
              <th className="px-4 py-3 text-right">Exp. Ratio</th>
              <th className="px-4 py-3 text-right">Outstanding</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {sorted.map(row => (
              <tr key={row.pid} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-4 py-3 font-medium">{row.name}</td>
                <td className="px-4 py-3 text-right text-emerald-600 font-medium">{fmt(row.income)}</td>
                <td className="px-4 py-3 text-right">{fmt(row.expenses)}</td>
                <td className="px-4 py-3 text-right text-amber-600">{row.maintenance > 0 ? fmt(row.maintenance) : <Minus size={12} className="ml-auto opacity-30" />}</td>
                <td className={cn('px-4 py-3 text-right font-semibold', row.net >= 0 ? 'text-emerald-600' : 'text-rose-600')}>{row.net >= 0 ? '+' : '-'}{fmt(row.net)}</td>
                <td className={cn('px-4 py-3 text-right text-xs', row.expenseRatio > 40 ? 'text-rose-600 font-medium' : 'text-muted-foreground')}>{row.expenseRatio.toFixed(1)}%</td>
                <td className={cn('px-4 py-3 text-right text-xs', row.outstanding > 0 ? 'text-rose-600 font-medium' : 'text-muted-foreground')}>{row.outstanding > 0 ? fmt(row.outstanding) : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-muted-foreground">Expense ratios above 40% are highlighted. Outstanding rent is derived from expected rent schedule.</p>
    </div>
  );
}

// ─── Phase 2: Tax View Tab ────────────────────────────────────────────────────
function TaxViewTab({ ledger }: { ledger: LedgerEntry[] }) {
  const posted = ledger.filter(e => e.status === 'posted');
  const needsCategory = ledger.filter(e => e.category === 'other').length;
  const missingReceipt = posted.filter(e => e.type === 'expense' && !e.receiptUrl).length;

  const byTaxCat = Object.entries(
    posted.reduce<Record<string, { income: number; expense: number; count: number }>>((acc, e) => {
      const tc = TAX_CATEGORY_MAP[e.category] ?? 'Other';
      if (!acc[tc]) acc[tc] = { income: 0, expense: 0, count: 0 };
      if (e.type === 'income') acc[tc].income += e.amount;
      else acc[tc].expense += e.amount;
      acc[tc].count++;
      return acc;
    }, {})
  ).sort(([a], [b]) => a.localeCompare(b));

  const exportTaxCSV = () => {
    const rows = byTaxCat.map(([cat, v]) => [cat, v.income.toFixed(2), v.expense.toFixed(2), (v.income - v.expense).toFixed(2), String(v.count)]);
    const csv = [['Tax Category','Income','Expenses','Net','Transactions'], ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    Object.assign(document.createElement('a'), { href: 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv), download: 'tax-summary.csv' }).click();
  };

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Organize tax-year income and expenses for review with your accountant.</p>
        </div>
        <button onClick={exportTaxCSV} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 shadow-sm shrink-0">
          <FileSpreadsheet size={14} className="text-emerald-600" /> Tax Summary CSV
        </button>
      </div>

      {(needsCategory > 0 || missingReceipt > 0) && (
        <div className="flex flex-col sm:flex-row gap-2">
          {needsCategory > 0 && <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-amber-50 dark:bg-amber-900/20 border-amber-200 text-amber-700 text-xs font-medium"><AlertTriangle size={13} />{needsCategory} uncategorized transaction{needsCategory > 1 ? 's' : ''}</div>}
          {missingReceipt > 0 && <div className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-rose-50 dark:bg-rose-900/20 border-rose-200 text-rose-700 text-xs font-medium"><Receipt size={13} />{missingReceipt} expense{missingReceipt > 1 ? 's' : ''} missing receipts</div>}
        </div>
      )}

      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          <div className="col-span-5">Tax Category</div>
          <div className="col-span-2 text-right">Income</div>
          <div className="col-span-2 text-right">Expenses</div>
          <div className="col-span-2 text-right">Net</div>
          <div className="col-span-1 text-right">#</div>
        </div>
        <div className="divide-y divide-border/50">
          {byTaxCat.map(([cat, v]) => {
            const net = v.income - v.expense;
            return (
              <div key={cat} className="grid grid-cols-12 gap-2 px-4 py-3 text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <div className="col-span-5 font-medium">{cat}</div>
                <div className="col-span-2 text-right text-emerald-600">{v.income > 0 ? `$${v.income.toLocaleString()}` : '—'}</div>
                <div className="col-span-2 text-right">{v.expense > 0 ? `$${v.expense.toLocaleString()}` : '—'}</div>
                <div className={cn('col-span-2 text-right font-medium', net >= 0 ? 'text-emerald-600' : 'text-rose-600')}>{net !== 0 ? `${net >= 0 ? '+' : '-'}$${Math.abs(net).toLocaleString()}` : '—'}</div>
                <div className="col-span-1 text-right text-muted-foreground">{v.count}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ─── Phase 2: Reports Tab ────────────────────────────────────────────────────
function ReportsTab({ ledger, onOpenExport }: { ledger: LedgerEntry[]; onOpenExport: (preset: Partial<ExportFilters>) => void }) {
  const posted = ledger.filter(e => e.status === 'posted');
  const reports = [
    { title: 'Transaction Export', desc: 'All filtered transactions with full metadata.', action: () => onOpenExport({ reportType: 'transaction_detail' }), icon: <FileSpreadsheet size={16} className="text-emerald-600" /> },
    { title: 'Property Summary', desc: 'Income, expenses, and net per property.', action: () => onOpenExport({ reportType: 'property_summary' }), icon: <Building2 size={16} className="text-blue-600" /> },
    { title: 'Uncategorized Transactions', desc: `${ledger.filter(e => e.category === 'other').length} transactions need a category assigned.`, action: () => onOpenExport({ reportType: 'transaction_detail', categories: ['other'] }), icon: <AlertTriangle size={16} className="text-amber-600" /> },
    { title: 'Missing Receipts', desc: `${posted.filter(e => e.type === 'expense' && !e.receiptUrl).length} posted expenses are missing receipt documentation.`, action: () => onOpenExport({ reportType: 'transaction_detail', transactionTypes: ['expense'], statuses: ['posted'], missingReceiptsOnly: true }), icon: <Receipt size={16} className="text-rose-600" /> },
  ];
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {reports.map(r => (
        <div key={r.title} className="p-4 border rounded-xl bg-card shadow-sm space-y-2 hover:border-primary/30 transition-colors">
          <div className="flex items-center gap-2">{r.icon}<span className="font-medium text-sm">{r.title}</span></div>
          <p className="text-xs text-muted-foreground">{r.desc}</p>
          <button onClick={r.action} className="text-xs text-primary hover:underline">Export →</button>
        </div>
      ))}
    </div>
  );
}

// ─── Export Utilities & Drawer ───────────────────────────────────────────────

function csvEscape(value: unknown) {
  const str = value == null ? '' : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

function downloadCSV(filename: string, headers: string[], rows: unknown[][]) {
  const csv = [headers, ...rows]
    .map(row => row.map(csvEscape).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

interface AccountingExportDrawerProps {
  open: boolean;
  onClose: () => void;
  ledger: LedgerEntry[];
  filteredLedger: LedgerEntry[];
  selectedIds: Set<string>;
  activeSearch: string;
  activeFilters: { type: TransactionType | ''; status: TransactionStatus[]; category: TransactionCategory[]; property: string[] };
  preset: Partial<ExportFilters> | null;
}

function AccountingExportDrawer({ open, onClose, ledger, filteredLedger, selectedIds, activeSearch, activeFilters, preset }: AccountingExportDrawerProps) {
  const [scope, setScope] = useState<ExportScope>('current_filters');
  const [reportType, setReportType] = useState<ExportReportType>('transaction_detail');
  const [propertyIds, setPropertyIds] = useState<string[]>([]);
  const [categories, setCategories] = useState<TransactionCategory[]>([]);
  const [statuses, setStatuses] = useState<TransactionStatus[]>([]);
  const [deductibleOnly, setDeductibleOnly] = useState(false);
  const [missingReceiptsOnly, setMissingReceiptsOnly] = useState(false);

  useEffect(() => {
    if (open) {
      setScope(preset?.scope ?? (selectedIds.size > 0 ? 'selected_transactions' : 'current_filters'));
      setReportType(preset?.reportType ?? 'transaction_detail');
      setPropertyIds(preset?.propertyIds ?? activeFilters.property);
      setCategories(preset?.categories ?? activeFilters.category);
      setStatuses(preset?.statuses ?? activeFilters.status);
      setDeductibleOnly(preset?.deductibleOnly ?? false);
      setMissingReceiptsOnly(preset?.missingReceiptsOnly ?? false);
    }
  }, [open, preset, activeFilters, selectedIds]);

  const applyPreset = (p: Partial<ExportFilters>) => {
    setScope(p.scope ?? 'all_transactions');
    setReportType(p.reportType ?? 'transaction_detail');
    setPropertyIds(p.propertyIds ?? []);
    setCategories(p.categories ?? []);
    setStatuses(p.statuses ?? []);
    setDeductibleOnly(p.deductibleOnly ?? false);
    setMissingReceiptsOnly(p.missingReceiptsOnly ?? false);
  };

  const getExportRows = () => {
    let rows = scope === 'selected_transactions'
      ? ledger.filter(e => selectedIds.has(e.id))
      : scope === 'current_filters'
        ? filteredLedger
        : [...ledger];

    return rows.filter(e => {
      if (propertyIds.length && !propertyIds.includes(e.propertyId)) return false;
      if (statuses.length && !statuses.includes(e.status)) return false;
      if (categories.length && !categories.includes(e.category)) return false;
      if (deductibleOnly && !e.deductible) return false;
      if (missingReceiptsOnly && !!e.receiptUrl) return false;
      // In a real implementation, we'd also filter by reportType-specific logic if needed
      return true;
    });
  };

  const rows = getExportRows();
  const totalIncome = rows.filter(e => e.type === 'income').reduce((s, e) => s + e.amount, 0);
  const totalExpenses = rows.filter(e => e.type === 'expense').reduce((s, e) => s + e.amount, 0);

  const handleExport = () => {
    if (rows.length === 0) return;
    
    // For now, regardless of reportType, we just export the transaction detail rows. 
    // In Phase 2, we would format differently based on reportType.
    const headers = ['Date', 'Posted Date', 'Description', 'Type', 'Category', 'Tax Category', 'Amount', 'Status', 'Property', 'Unit', 'Tenant', 'Vendor', 'Payment Method', 'Source Type', 'Source Ref', 'Memo', 'Review Status', 'Deductible', 'Receipt URL', 'Tags'];
    const csvRows = rows.map(e => [
      e.date, e.postedAt ?? '', e.description, e.type, CATEGORY_LABELS[e.category], e.taxCategory ?? TAX_CATEGORY_MAP[e.category] ?? '',
      (e.type === 'income' ? '' : '-') + e.amount.toFixed(2), e.status, e.propertyName, e.unitNumber ?? '',
      e.tenantName ?? '', e.vendorName ?? '', e.paymentMethod ? PAYMENT_METHOD_LABELS[e.paymentMethod] : '',
      e.sourceType ? SOURCE_TYPE_LABELS[e.sourceType] : '', e.sourceRef ?? '', e.memo ?? '',
      e.reviewStatus ?? '', e.deductible ? 'Yes' : 'No', e.receiptUrl ?? '', (e.tags ?? []).join(';')
    ]);

    const filename = `rentaru-accounting-${reportType.replace(/_/g, '-')}-${new Date().toISOString().slice(0, 10)}.csv`;
    downloadCSV(filename, headers, csvRows);
    onClose();
  };

  const toggleArr = <T,>(arr: T[], val: T): T[] => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex justify-end">
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-card border-l shadow-2xl h-full flex flex-col">
            <div className="p-4 border-b flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/20">
              <div>
                <h2 className="font-semibold text-lg flex items-center gap-2"><FileSpreadsheet size={18} className="text-emerald-600" /> Export Accounting Data</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Configure your financial export</p>
              </div>
              <button onClick={onClose} className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"><X size={18} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-5 space-y-8">
          
          {/* Quick Presets */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Quick Presets</h3>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => applyPreset({ reportType: 'tax_summary', statuses: ['posted'], deductibleOnly: false })} className="px-3 py-1.5 text-xs font-medium border rounded-full hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 transition-colors">Tax Prep Export</button>
              <button onClick={() => applyPreset({ reportType: 'transaction_detail', transactionTypes: ['expense'], categories: ['maintenance', 'repairs', 'capex'], statuses: ['posted', 'pending'] })} className="px-3 py-1.5 text-xs font-medium border rounded-full hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 transition-colors">Maintenance Review</button>
              <button onClick={() => applyPreset({ reportType: 'transaction_detail', transactionTypes: ['expense'], statuses: ['posted'], missingReceiptsOnly: true })} className="px-3 py-1.5 text-xs font-medium border rounded-full hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 transition-colors">Missing Receipts</button>
            </div>
          </div>

          <div className="h-px bg-border/50" />

          {/* Scope & Type */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Data Scope</h3>
            <div className="grid grid-cols-2 gap-3">
              {(['all_transactions', 'current_filters', 'selected_transactions', 'custom_query'] as ExportScope[]).map(s => (
                <label key={s} className={cn("flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors", scope === s ? "border-primary bg-primary/5" : "hover:bg-slate-50 dark:hover:bg-slate-800")}>
                  <input type="radio" name="exportScope" checked={scope === s} onChange={() => setScope(s)} className="accent-primary" />
                  <span className="text-sm capitalize">{s.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Detailed Filters (Enabled if Custom) */}
          <div className={cn("space-y-5 transition-opacity", scope !== 'custom_query' && "opacity-50 pointer-events-none")}>
            <h3 className="text-sm font-medium">Custom Filters</h3>
            
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Properties</label>
              <div className="flex flex-wrap gap-2">
                {MOCK_PROPERTIES.map(p => (
                  <button key={p.id} onClick={() => setPropertyIds(toggleArr(propertyIds, p.id))} className={cn("px-2.5 py-1 text-xs border rounded-md transition-colors", propertyIds.includes(p.id) ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:bg-slate-50")}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Status</label>
              <div className="flex flex-wrap gap-2">
                {(['posted', 'pending', 'failed', 'refunded', 'voided'] as TransactionStatus[]).map(s => (
                  <button key={s} onClick={() => setStatuses(toggleArr(statuses, s))} className={cn("px-2.5 py-1 text-xs border rounded-md transition-colors capitalize", statuses.includes(s) ? "bg-primary text-primary-foreground border-primary" : "bg-card text-muted-foreground hover:bg-slate-50")}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Flags</label>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={deductibleOnly} onChange={e => setDeductibleOnly(e.target.checked)} className="accent-primary" />
                  <span className="text-sm">Tax Deductible Only</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={missingReceiptsOnly} onChange={e => setMissingReceiptsOnly(e.target.checked)} className="accent-primary" />
                  <span className="text-sm">Missing Receipts Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Preview Footer */}
        <div className="p-4 border-t bg-slate-50 dark:bg-slate-900/30">
          <div className="mb-4 text-sm bg-white dark:bg-slate-800 p-3 rounded-lg border shadow-sm">
            <div className="font-medium mb-2">Export Preview</div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-muted-foreground">Transactions:</div><div className="font-medium text-right">{rows.length}</div>
              <div className="text-muted-foreground">Total Income:</div><div className="font-medium text-emerald-600 text-right">+${totalIncome.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
              <div className="text-muted-foreground">Total Expenses:</div><div className="font-medium text-rose-600 text-right">-${totalExpenses.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 px-4 py-2 text-sm font-medium border rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
            <button onClick={handleExport} disabled={rows.length === 0} className="flex-1 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2">
              <FileSpreadsheet size={16} /> Download CSV
            </button>
          </div>
          </div>
        </motion.div>
      </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default function AccountingPage() {
  const [ledger, setLedger] = useState<LedgerEntry[]>(MOCK_LEDGER);
  const [activeTab, setActiveTab] = useState<AccountingTab>('overview');
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | ''>('');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus[]>([]);
  const [filterCategory, setFilterCategory] = useState<TransactionCategory[]>([]);
  const [filterProperty, setFilterProperty] = useState<string[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const [exportOpen, setExportOpen] = useState(false);
  const [exportPreset, setExportPreset] = useState<Partial<ExportFilters> | null>(null);

  const updateEntry = (id: string, patch: Partial<LedgerEntry>) =>
    setLedger(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));

  const q = search.toLowerCase().trim();
  const filtered = ledger.filter(e => {
    if (q && ![ e.description, e.propertyName, e.unitNumber, e.tenantName, e.vendorName, e.sourceRef, e.memo, CATEGORY_LABELS[e.category] ].some(v => v?.toLowerCase().includes(q))) return false;
    if (filterType && e.type !== filterType) return false;
    if (filterStatus.length && !filterStatus.includes(e.status)) return false;
    if (filterCategory.length && !filterCategory.includes(e.category)) return false;
    if (filterProperty.length && !filterProperty.includes(e.propertyId)) return false;
    return true;
  });

  const totalIncome   = filtered.filter(e => e.type === 'income'  && e.status === 'posted').reduce((s, e) => s + e.amount, 0);
  const totalExpenses = filtered.filter(e => e.type === 'expense' && e.status === 'posted').reduce((s, e) => s + e.amount, 0);
  const netCashFlow   = totalIncome - totalExpenses;
  const activeFilterCount = (filterType ? 1 : 0) + filterStatus.length + filterCategory.length + filterProperty.length;

  const handleOpenExport = (preset: Partial<ExportFilters> | null = null) => {
    setExportPreset(preset);
    setExportOpen(true);
  };

  const toggleArr = <T,>(arr: T[], val: T): T[] => arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val];
  const toggleSelect = (id: string) => setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s; });
  const toggleAll = () => setSelected(prev => prev.size === filtered.length ? new Set() : new Set(filtered.map(e => e.id)));

  const bulkMarkReviewed = () => {
    setLedger(prev => prev.map(e => selected.has(e.id) ? { ...e, reviewStatus: 'reviewed' as ReviewStatus } : e));
    setSelected(new Set());
  };
  const bulkCategorize = (cat: TransactionCategory) => {
    setLedger(prev => prev.map(e => selected.has(e.id) ? { ...e, category: cat } : e));
    setSelected(new Set());
  };

  const exportCSV = () => {
    const src = selected.size > 0 ? filtered.filter(e => selected.has(e.id)) : filtered;
    const headers = ['Date','Description','Type','Category','Amount','Status','Property','Unit','Tenant','Vendor','Payment Method','Source Type','Source Ref','Memo','Review Status','Deductible'];
    const rows = src.map(e => [ e.date, e.description, e.type, CATEGORY_LABELS[e.category], (e.type === 'income' ? '' : '-') + e.amount.toFixed(2), e.status, e.propertyName, e.unitNumber ?? '', e.tenantName ?? '', e.vendorName ?? '', e.paymentMethod ?? '', e.sourceType ?? '', e.sourceRef ?? '', e.memo ?? '', e.reviewStatus ?? '', e.deductible ? 'Yes' : 'No' ]);
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
    Object.assign(document.createElement('a'), { href: 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv), download: 'transactions.csv' }).click();
  };

  const TABS: { id: AccountingTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview',     label: 'Overview',     icon: <LayoutDashboard size={14} /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt size={14} /> },
    { id: 'performance', label: 'Performance',  icon: <BarChart3 size={14} /> },
    { id: 'tax',         label: 'Tax View',     icon: <BookOpen size={14} /> },
    { id: 'reports',     label: 'Reports',      icon: <FileSpreadsheet size={14} /> },
  ];

  const needsReviewCount = ledger.filter(e => e.reviewStatus === 'needs_review').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <BookOpen size={18} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Accounting</h1>
              <p className="text-sm text-muted-foreground">Manage ledgers, taxes, and financial performance</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium shadow-sm">
            <Calendar size={16} className="text-muted-foreground" /> This Year <ChevronDown size={14} className="text-muted-foreground" />
          </button>
          <button onClick={() => handleOpenExport()} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium shadow-sm">
            <FileSpreadsheet size={16} className="text-emerald-600" /> Export
          </button>
        </div>
      </div>

      {/* Summary Cards — always visible */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Income',   value: totalIncome,   icon: <ArrowUpRight size={16} />,   iconBg: 'bg-emerald-100/50 text-emerald-600', color: 'text-emerald-600' },
          { label: 'Total Expenses', value: totalExpenses, icon: <ArrowDownRight size={16} />, iconBg: 'bg-rose-100/50 text-rose-600',       color: 'text-foreground' },
          { label: 'Net Cash Flow',  value: netCashFlow,   icon: <Calculator size={16} />,     iconBg: 'bg-blue-100/50 text-blue-600',       color: netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600' },
        ].map(card => (
          <div key={card.label} className="p-4 rounded-xl border bg-card shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
              <div className={`p-1.5 rounded-lg ${card.iconBg}`}>{card.icon}</div>
            </div>
            <div className={`text-2xl font-bold ${card.color}`}>
              {card.value < 0 ? '-' : ''}${Math.abs(card.value).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </div>
            <div className="text-xs text-muted-foreground">Based on {ledger.filter(e => e.status === 'posted').length} posted transactions</div>
          </div>
        ))}
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex items-center gap-1 border-b border-border/70 overflow-x-auto pb-px">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={cn('relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px',
              activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border')}>
            {tab.icon}{tab.label}
            {tab.id === 'transactions' && needsReviewCount > 0 && (
              <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{needsReviewCount}</span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && <OverviewTab ledger={ledger} />}
      {activeTab === 'performance' && <PerformanceTab ledger={ledger} />}
      {activeTab === 'tax' && <TaxViewTab ledger={ledger} />}
      {activeTab === 'reports' && <ReportsTab ledger={ledger} onOpenExport={handleOpenExport} />}

      {activeTab === 'transactions' && (
        <div className="space-y-3">
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[180px] max-w-sm">
              <Search className="absolute left-2.5 top-2.5 text-muted-foreground" size={16} />
              <input type="text" placeholder="Search transactions..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-card border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none" />
            </div>

            {/* Inline filter dropdowns */}
            <FilterDropdown
              label="Type"
              options={[{ value: 'income', label: 'Income' }, { value: 'expense', label: 'Expense' }]}
              selected={filterType ? [filterType] : []}
              onChange={vals => setFilterType((vals[vals.length - 1] as TransactionType) ?? '')}
            />
            <FilterDropdown
              label="Status"
              options={(['posted', 'pending', 'failed', 'refunded'] as TransactionStatus[]).map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
              selected={filterStatus}
              onChange={setFilterStatus as (v: string[]) => void}
            />
            <FilterDropdown
              label="Category"
              options={(Object.keys(CATEGORY_LABELS) as TransactionCategory[]).map(c => ({ value: c, label: CATEGORY_LABELS[c] }))}
              selected={filterCategory}
              onChange={setFilterCategory as (v: string[]) => void}
            />

            <FilterDropdown
              label="Property"
              options={MOCK_PROPERTIES.map(p => ({ value: p.id, label: p.name }))}
              selected={filterProperty}
              onChange={setFilterProperty}
            />
            <span className="ml-auto text-xs text-muted-foreground">{filtered.length} transaction{filtered.length !== 1 ? 's' : ''}</span>
            {activeFilterCount > 0 && (
              <button onClick={() => { setFilterType(''); setFilterStatus([]); setFilterCategory([]); setFilterProperty([]); }}
                className="ml-2 text-xs text-muted-foreground hover:text-rose-500 flex items-center gap-1 transition-colors">
                <X size={11} /> Clear all
              </button>
            )}
          </div>

          {/* Bulk Action Bar */}
          <AnimatePresence>
            {selected.size > 0 && (
              <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 16, opacity: 0 }} transition={{ duration: 0.15 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary text-primary-foreground shadow-lg">
                <CheckSquare size={15} />
                <span className="text-sm font-medium">{selected.size} selected</span>
                <div className="flex items-center gap-2 ml-2">
                  <button onClick={bulkMarkReviewed} className="px-3 py-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 rounded-md transition-colors flex items-center gap-1.5"><CheckCircle2 size={12} />Mark Reviewed</button>
                  <select onChange={e => { if (e.target.value) { bulkCategorize(e.target.value as TransactionCategory); e.target.value = ''; } }} defaultValue="" className="px-2 py-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 rounded-md transition-colors outline-none cursor-pointer">
                    <option value="" disabled>Categorize…</option>
                    {(Object.keys(CATEGORY_LABELS) as TransactionCategory[]).map(c => <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>)}
                  </select>
                  <button onClick={() => handleOpenExport({ scope: 'selected_transactions' })} className="px-3 py-1.5 text-xs font-medium bg-white/20 hover:bg-white/30 rounded-md transition-colors flex items-center gap-1.5"><FileSpreadsheet size={12} />Export</button>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <button onClick={() => setSelected(new Set())} className="text-xs hover:underline text-white/80 hover:text-white">Deselect all</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Ledger Table */}
          <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="grid grid-cols-12 gap-2 px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              <div className="col-span-1 flex items-center">
                <button onClick={toggleAll} className="text-muted-foreground hover:text-foreground transition-colors">
                  {selected.size === filtered.length && filtered.length > 0 ? <CheckSquare size={14} /> : <Square size={14} />}
                </button>
              </div>
              <div className="col-span-2">Date</div>
              <div className="col-span-3 md:col-span-3">Description</div>
              <div className="hidden md:block col-span-2">Category</div>
              <div className="hidden md:block col-span-1">Status</div>
              <div className="col-span-4 md:col-span-2 text-right">Amount</div>
              <div className="col-span-1" />
            </div>
            <div className="divide-y divide-border/50">
              {filtered.length > 0 ? filtered.map(e => (
                <LedgerRow key={e.id} entry={e} onUpdate={updateEntry} selected={selected.has(e.id)} onSelect={() => toggleSelect(e.id)} />
              )) : (
                <div className="py-16 text-center text-muted-foreground">
                  <div className="text-sm font-medium mb-1">{q || activeFilterCount ? 'No matching transactions' : 'No transactions yet'}</div>
                  <div className="text-xs">{q || activeFilterCount ? 'Try adjusting your filters or clearing your search.' : 'Payments, expenses, and entries will appear here.'}</div>
                  {activeFilterCount > 0 && <button onClick={() => { setFilterType(''); setFilterStatus([]); setFilterCategory([]); setSearch(''); }} className="mt-3 text-xs text-primary hover:underline">Clear filters</button>}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    {/* Advanced Export Drawer */}
      <AccountingExportDrawer
        open={exportOpen}
        onClose={() => setExportOpen(false)}
        ledger={ledger}
        filteredLedger={filtered}
        selectedIds={selected}
        activeSearch={search}
        activeFilters={{ type: filterType, status: filterStatus, category: filterCategory, property: filterProperty }}
        preset={exportPreset}
      />
    </div>
  );
}
