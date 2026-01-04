
import { useState } from 'react';
import { 
  Calculator, 
  Search, 
  Filter, 
  ChevronDown, 
  Calendar,
  Building2,
  Tag,
  FileSpreadsheet,
  ArrowUpRight,
  ArrowDownLeft,
  ChevronRight,
  Link as LinkIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

type TransactionType = 'credit' | 'debit';
type TransactionCategory = 'rental_income' | 'maintenance' | 'utilities' | 'management_fees' | 'insurance' | 'taxes' | 'late_fees' | 'other';

interface LedgerEntry {
  id: string;
  date: string;
  description: string;
  category: TransactionCategory;
  propertyName: string;
  unitNumber?: string;
  amount: number;
  type: TransactionType;
  sourceRef?: string;
}

// --- Mock Data ---

const MOCK_LEDGER: LedgerEntry[] = [
  {
    id: 't1',
    date: '2024-01-05',
    description: 'Rent Payment - Jane Smith',
    category: 'rental_income',
    propertyName: 'Oak Street Apartments',
    unitNumber: '3B',
    amount: 1450,
    type: 'credit',
    sourceRef: 'PMT-8821'
  },
  {
    id: 't2',
    date: '2024-01-04',
    description: 'Emergency HVAC Repair',
    category: 'maintenance',
    propertyName: 'Highland Lofts',
    unitNumber: '102',
    amount: 350,
    type: 'debit',
    sourceRef: 'TKT-991'
  },
  {
    id: 't3',
    date: '2024-01-03',
    description: 'Water Bill - Dec 2023',
    category: 'utilities',
    propertyName: 'Sunset Duplex',
    amount: 185.40,
    type: 'debit'
  },
  {
    id: 't4',
    date: '2024-01-01',
    description: 'Rent Payment - Michael Chen',
    category: 'rental_income',
    propertyName: 'Highland Lofts',
    unitNumber: '102',
    amount: 2300,
    type: 'credit',
    sourceRef: 'PMT-8822'
  },
  {
    id: 't5',
    date: '2024-01-01',
    description: 'Management Fee (5%)',
    category: 'management_fees',
    propertyName: 'The Oakley',
    amount: 420.00,
    type: 'debit'
  }
];

// --- Components ---

const LedgerRow = ({ entry }: { entry: LedgerEntry }) => {
  const [expanded, setExpanded] = useState(false);

  const categoryLabels: Record<TransactionCategory, string> = {
    rental_income: 'Rental Income',
    maintenance: 'Maintenance',
    utilities: 'Utilities',
    management_fees: 'Mgmt Fees',
    insurance: 'Insurance',
    taxes: 'Taxes',
    late_fees: 'Late Fees',
    other: 'Other'
  };

  return (
    <div className={cn(
        "group border-b last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors",
        expanded && "bg-slate-50/80 dark:bg-slate-800/50"
    )}>
      {/* Primary Row Content */}
      <div 
        className="grid grid-cols-12 gap-4 p-4 items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Date */}
        <div className="col-span-2 text-sm text-foreground tabular-nums">
            {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </div>

        {/* Description & Context */}
        <div className="col-span-5 md:col-span-4">
            <div className="text-sm font-medium text-foreground truncate">{entry.description}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                <span>{entry.propertyName}</span>
                {entry.unitNumber && (
                    <>
                        <span className="w-0.5 h-0.5 rounded-full bg-muted-foreground/50" />
                        <span>Unit {entry.unitNumber}</span>
                    </>
                )}
            </div>
        </div>

        {/* Category Badge - Desktop */}
        <div className="hidden md:flex col-span-2">
            <span className="inline-flex items-center text-xs text-muted-foreground border rounded-full px-2 py-0.5 bg-slate-50 dark:bg-slate-900/50">
               <Tag size={10} className="mr-1.5 opacity-70" /> {categoryLabels[entry.category]}
            </span>
        </div>

         {/* Amount */}
         <div className={cn(
             "col-span-4 md:col-span-3 text-right font-medium text-sm tabular-nums",
             entry.type === 'credit' ? "text-emerald-600 dark:text-emerald-500" : "text-foreground"
         )}>
             {entry.type === 'credit' ? '+' : '-'}${entry.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
         </div>
         
         {/* Chevron */}
         <div className="col-span-1 flex justify-end">
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
                <div className="p-4 pl-14 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    
                    {/* Metadata Column */}
                    <div className="space-y-3">
                         <div className="grid grid-cols-3 gap-y-2">
                             <span className="text-muted-foreground text-xs uppercase tracking-wide">Category</span>
                             <div className="col-span-2 font-medium">{categoryLabels[entry.category]}</div>

                             <span className="text-muted-foreground text-xs uppercase tracking-wide">Ref ID</span>
                             <div className="col-span-2 font-mono text-xs">{entry.id.toUpperCase()}</div>

                             {entry.sourceRef && (
                                <>
                                    <span className="text-muted-foreground text-xs uppercase tracking-wide">Source</span>
                                    <div className="col-span-2 flex items-center gap-1 text-primary hover:underline cursor-pointer">
                                        <LinkIcon size={12} /> {entry.sourceRef}
                                    </div>
                                </>
                             )}
                         </div>
                    </div>

                    {/* Actions Column */}
                    <div className="flex items-center justify-end gap-2 md:border-l md:pl-8 border-border/50">
                         <button className="px-3 py-1.5 text-xs font-medium border rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors">
                             Edit Category
                         </button>
                         <button className="px-3 py-1.5 text-xs font-medium border rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors">
                             Add Memo
                         </button>
                         <button className="px-3 py-1.5 text-xs font-medium text-emerald-600 border border-emerald-100 bg-emerald-50 dark:bg-emerald-900/10 dark:border-emerald-900/20 rounded-md hover:bg-emerald-100 transition-colors">
                             View Receipt
                         </button>
                    </div>

                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function AccountingPage() {
  const totalIncome = 124500.00;
  const totalExpenses = 42350.00;
  const netCashFlow = totalIncome - totalExpenses;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Accounting</h1>
          <p className="text-muted-foreground">Income, expenses, and financial records.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium shadow-sm">
             <Calendar size={16} className="text-muted-foreground" />
             This Year
             <ChevronDown size={14} className="text-muted-foreground" />
           </button>
           <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-card border hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium shadow-sm">
             <FileSpreadsheet size={16} className="text-emerald-600" />
             Export CSV
           </button>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total Income</span>
                  <div className="p-1.5 bg-emerald-100/50 text-emerald-600 rounded-lg">
                      <ArrowUpRight size={16} />
                  </div>
              </div>
              <div className="text-2xl font-bold text-foreground">${totalIncome.toLocaleString()}</div>
          </div>

           <div className="p-4 rounded-xl border bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Total Expenses</span>
                  <div className="p-1.5 bg-rose-100/50 text-rose-600 rounded-lg">
                      <ArrowDownLeft size={16} />
                  </div>
              </div>
              <div className="text-2xl font-bold text-foreground">${totalExpenses.toLocaleString()}</div>
          </div>

          <div className="p-4 rounded-xl border bg-card shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Net Cash Flow</span>
                  <div className="p-1.5 bg-blue-100/50 text-blue-600 rounded-lg">
                      <Calculator size={16} />
                  </div>
              </div>
              <div className="text-2xl font-bold text-foreground">${netCashFlow.toLocaleString()}</div>
          </div>
      </div>

       {/* Controls */}
       <div className="flex items-center gap-2 mt-8">
         <div className="relative flex-1 max-w-sm">
             <Search className="absolute left-2.5 top-2.5 text-muted-foreground" size={16} />
             <input 
                type="text" 
                placeholder="Search transactions..." 
                className="w-full pl-9 pr-4 py-2 bg-card border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none"
             />
         </div>
         <button className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Filter size={14} />
            Filters
         </button>
         <button className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors ml-auto">
             <Building2 size={14} /> All Properties <ChevronDown size={14} />
         </button>
      </div>

      {/* Ledger Table */}
      <div className="border rounded-xl bg-card shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-2">Date</div>
            <div className="col-span-5 md:col-span-4">Description</div>
            <div className="hidden md:block col-span-2">Category</div>
            <div className="col-span-4 md:col-span-3 text-right">Amount</div>
            <div className="col-span-1"></div>
        </div>
        <div className="divide-y divide-border/50">
            {MOCK_LEDGER.map(entry => (
                <LedgerRow key={entry.id} entry={entry} />
            ))}
        </div>
      </div>

    </div>
  );
}
