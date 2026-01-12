
import { useState } from 'react';
import { 
  BarChart3, 
  Search, 
  FileSpreadsheet,
  PieChart,
  ArrowRight,
  Download,
  Calendar,
  Building2,
  ChevronLeft
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

type ReportCategory = 'financial' | 'tenancy' | 'maintenance' | 'portfolio';

interface ReportDefinition {
  id: string;
  name: string;
  description: string;
  category: ReportCategory;
  lastGenerated?: string;
}

// --- Mock Data ---

const REPORT_CATALOG: ReportDefinition[] = [
  // Financial
  {
    id: 'r-income',
    name: 'Income Statement',
    description: 'Detailed breakdown of revenue and expenses over a specific period.',
    category: 'financial',
    lastGenerated: 'Today'
  },
  {
    id: 'r-expenses',
    name: 'Expense Summary',
    description: 'Categorized view of all operating expenses and capital expenditures.',
    category: 'financial'
  },
  {
    id: 'r-noi',
    name: 'Net Operating Income (NOI)',
    description: 'Analysis of profitability excluding financing and tax costs.',
    category: 'financial'
  },

  // Tenancy
  {
    id: 'r-rentroll',
    name: 'Rent Roll',
    description: 'Current status of all units, tenants, lease terms, and rental rates.',
    category: 'tenancy',
    lastGenerated: 'Yesterday'
  },
  {
    id: 'r-delinquency',
    name: 'Delinquency Report',
    description: 'List of tenants with outstanding balances aged by 30/60/90 days.',
    category: 'tenancy'
  },

  // Maintenance
  {
    id: 'r-maint-cost',
    name: 'Maintenance Costs',
    description: 'Repair and maintenance expenses grouped by property and category.',
    category: 'maintenance'
  }
];

// --- Sub-Components ---

const CategoryBadge = ({ category }: { category: ReportCategory }) => {
    const styles = {
        financial: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
        tenancy: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
        maintenance: 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
        portfolio: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
    };

    return (
        <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full tracking-wide", styles[category])}>
            {category}
        </span>
    );
};

const ReportCard = ({ report, onClick }: { report: ReportDefinition, onClick: () => void }) => {
  return (
    <div 
        onClick={onClick}
        className="group border rounded-xl bg-card p-5 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer flex flex-col h-full"
    >
        <div className="flex justify-between items-start mb-3">
            <div className={`p-2 rounded-lg ${report.category === 'financial' ? 'bg-emerald-50 text-emerald-600' : report.category === 'tenancy' ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'}`}>
                {report.category === 'financial' ? <FileSpreadsheet size={20} /> : report.category === 'tenancy' ? <PieChart size={20} /> : <BarChart3 size={20} />}
            </div>
            <CategoryBadge category={report.category} />
        </div>
        
        <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{report.name}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">{report.description}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-border/50 mt-auto">
             <span className="text-xs text-muted-foreground font-medium">
                 {report.lastGenerated ? `Last run: ${report.lastGenerated}` : 'Never generated'}
             </span>
             <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-[-5px] group-hover:translate-x-0">
                 Run Report <ArrowRight size={14} />
             </div>
        </div>
    </div>
  );
};

const ReportViewer = ({ report, onBack }: { report: ReportDefinition, onBack: () => void }) => {
    // Mock Content for the Viewer
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 space-y-6">
            
            {/* Viewer Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-xl border shadow-sm">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-muted-foreground hover:text-foreground">
                        <ChevronLeft size={20} />
                    </button>
                    <div>
                        <h2 className="font-bold text-lg leading-tight">{report.name}</h2>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <Calendar size={12} />
                            <span>Jan 1, 2024 - Jan 31, 2024</span>
                            <span className="w-1 h-1 rounded-full bg-border" />
                            <Building2 size={12} />
                            <span>All Properties</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-slate-900 text-white dark:bg-slate-50 dark:text-slate-900 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity">
                        <Download size={16} /> Export CSV
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 border bg-white dark:bg-black rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors">
                        PDF
                    </button>
                </div>
            </div>

            {/* Mock Summary Data (Conditional based on report type would go here) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-card border rounded-xl space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Revenue</div>
                    <div className="text-2xl font-bold">$124,500.00</div>
                </div>
                <div className="p-4 bg-card border rounded-xl space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Expenses</div>
                    <div className="text-2xl font-bold">$42,350.00</div>
                </div>
                <div className="p-4 bg-card border rounded-xl space-y-1">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Net Operating Income</div>
                    <div className="text-2xl font-bold text-emerald-600">$82,150.00</div>
                </div>
            </div>

            {/* Mock Table */}
            <div className="border rounded-xl bg-card overflow-hidden">
                <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/50">
                    <h3 className="font-semibold text-sm">Detailed Breakdown</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900/50 border-b text-xs uppercase text-muted-foreground font-semibold">
                            <tr>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Description</th>
                                <th className="px-6 py-3">Category</th>
                                <th className="px-6 py-3 text-right">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                                    <td className="px-6 py-3 tabular-nums">Jan {i + 2}, 2024</td>
                                    <td className="px-6 py-3 font-medium">Rent Payment - Unit {300 + i}</td>
                                    <td className="px-6 py-3 text-muted-foreground">Rental Income</td>
                                    <td className="px-6 py-3 text-right tabular-nums text-emerald-600">$2,450.00</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
};

export default function ReportsPage() {
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  
  const selectedReport = REPORT_CATALOG.find(r => r.id === selectedReportId);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      
      {/* Page Header (Only show if not viewing a report to reduce clutter, or keep it small) */}
      {!selectedReport && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
              <p className="text-muted-foreground">Financial and operational summaries.</p>
            </div>
          </div>
      )}

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {!selectedReport ? (
            <motion.div 
                key="catalog"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-6"
            >
                {/* Search & Filter */}
                <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm max-w-2xl">
                    <Search className="text-muted-foreground ml-2" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search reports..." 
                        className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground outline-none"
                    />
                </div>

                {/* Categories */}
                <div className="space-y-8">
                    {/* Financial Section */}
                    <section>
                        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">Financial Reports</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {REPORT_CATALOG.filter(r => r.category === 'financial').map(report => (
                                <ReportCard key={report.id} report={report} onClick={() => setSelectedReportId(report.id)} />
                            ))}
                        </div>
                    </section>

                    {/* Tenancy Section */}
                    <section>
                         <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">Tenancy & Leasing</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {REPORT_CATALOG.filter(r => r.category === 'tenancy').map(report => (
                                <ReportCard key={report.id} report={report} onClick={() => setSelectedReportId(report.id)} />
                            ))}
                        </div>
                    </section>

                     {/* Maintenance Section */}
                     <section>
                         <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 border-b pb-2">Maintenance & Operations</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {REPORT_CATALOG.filter(r => r.category === 'maintenance').map(report => (
                                <ReportCard key={report.id} report={report} onClick={() => setSelectedReportId(report.id)} />
                            ))}
                        </div>
                    </section>
                </div>
            </motion.div>
        ) : (
            <motion.div
                key="viewer"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <ReportViewer report={selectedReport} onBack={() => setSelectedReportId(null)} />
            </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
