
import { 
    FileText, Download, Printer, Search, 
    ChevronDown, Clock, ShieldCheck, 
    AlertCircle, CheckCircle2, File
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- MOCK DATA ---
const DOCS_STATE = {
    currentLease: {
        id: 'l1',
        title: 'Lease Agreement - 2023-2024',
        status: 'active' as 'active' | 'pending_signature' | 'expired',
        startDate: 'Mar 1, 2023',
        endDate: 'Feb 28, 2024',
        monthlyRent: 1450,
        securityDeposit: 1450,
        unit: 'Unit 3B',
        property: 'Sunset Apartments',
        pdfUrl: '#'
    },
    archivedLeases: [
        { id: 'l0', title: 'Lease Agreement - 2022-2023', startDate: 'Mar 1, 2022', endDate: 'Feb 28, 2023', status: 'expired' }
    ],
    documents: [
        { id: 'd1', title: 'Move-in Checklist', category: 'Property', date: 'Mar 1, 2023', status: 'signed', type: 'pdf' },
        { id: 'd2', title: 'Pet Addendum', category: 'Legal', date: 'Mar 1, 2023', status: 'signed', type: 'pdf' },
        { id: 'd3', title: 'Generic House Rules', category: 'Property', date: 'Mar 1, 2023', status: 'informational', type: 'pdf' },
        { id: 'd4', title: 'Renters Insurance Policy', category: 'Financial', date: 'Mar 5, 2023', status: 'informational', type: 'pdf' },
        { id: 'd5', title: 'Notice of Entry - HVAC', category: 'Notice', date: 'Jan 15, 2024', status: 'informational', type: 'pdf' },
    ]
};

// --- SUB-COMPONENTS ---

const DocStatusBadge = ({ status }: { status: string }) => {
    const styles = {
        signed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        active: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        expired: 'bg-slate-100 text-slate-500 border-slate-200',
        informational: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    };
    
    const getStyle = (s: string) => {
        if (s === 'signed' || s === 'active') return styles.active;
        if (s === 'pending_signature') return styles.pending;
        if (s === 'expired') return styles.expired;
        return styles.informational;
    };

    const getIcon = (s: string) => {
        if (s === 'signed' || s === 'active') return CheckCircle2;
        if (s === 'pending_signature') return AlertCircle;
        if (s === 'expired') return Clock;
        return FileText;
    };

    const Icon = getIcon(status);

    return (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border flex items-center gap-1 w-fit", getStyle(status))}>
            <Icon size={12} />
            {status.replace('_', ' ')}
        </span>
    );
};

export default function TenantDocuments() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'all' | 'legal' | 'financial' | 'property' | 'notice'>('all');

    const filteredDocs = DOCS_STATE.documents.filter(doc => {
        const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTab = activeTab === 'all' || doc.category.toLowerCase() === activeTab;
        return matchesSearch && matchesTab;
    });

    const isExpiringSoon = true; // Mock logic for expiring soon banner

    return (
        <div className="max-w-5xl mx-auto space-y-8 pb-24">
            
            {/* Header */}
            <div>
                 <h1 className="text-3xl font-bold tracking-tight">Lease & Documents</h1>
                 <p className="text-muted-foreground mt-1">View and download your lease agreement and other important files.</p>
            </div>

            {/* Expiring Soon Banner */}
            {isExpiringSoon && (
                <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3">
                    <Clock className="text-amber-600 shrink-0 mt-0.5" size={20} />
                    <div className="flex-1">
                        <h3 className="text-sm font-bold text-amber-700 dark:text-amber-500">Lease Expiring Soon</h3>
                        <p className="text-sm text-amber-600/90 dark:text-amber-400 mt-1">
                            Your current lease ends in <span className="font-bold">45 days</span> (Feb 28, 2024). A renewal offer is available.
                        </p>
                    </div>
                    <button className="px-3 py-1.5 bg-amber-500 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-amber-600 transition-colors">
                        View Offer
                    </button>
                </div>
            )}

            {/* 1. Current Lease (Featured) */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-xl overflow-hidden relative">
                 <div className="p-8 relative z-10">
                     <div className="flex justify-between items-start mb-6">
                         <div className="flex items-center gap-3">
                             <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400 border border-emerald-500/20">
                                 <ShieldCheck size={24} />
                             </div>
                             <div>
                                 <h2 className="text-xl font-bold">Current Lease Agreement</h2>
                                 <p className="text-sm text-slate-400">Valid through {DOCS_STATE.currentLease.endDate}</p>
                             </div>
                         </div>
                         <div className="hidden sm:block">
                             <DocStatusBadge status={DOCS_STATE.currentLease.status} />
                         </div>
                     </div>

                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 py-6 border-t border-white/10 border-b mb-6">
                         <div>
                             <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Monthly Rent</p>
                             <p className="text-lg font-bold">${DOCS_STATE.currentLease.monthlyRent.toLocaleString()}</p>
                         </div>
                         <div>
                             <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Term Start</p>
                             <p className="text-lg font-bold text-slate-200">{DOCS_STATE.currentLease.startDate}</p>
                         </div>
                         <div>
                             <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Term End</p>
                             <p className="text-lg font-bold text-slate-200">{DOCS_STATE.currentLease.endDate}</p>
                         </div>
                         <div>
                             <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">Deposit</p>
                             <p className="text-lg font-bold text-slate-200">${DOCS_STATE.currentLease.securityDeposit.toLocaleString()}</p>
                         </div>
                     </div>

                     <div className="flex items-center gap-3">
                         <button className="flex-1 sm:flex-none h-10 px-6 bg-white text-slate-900 hover:bg-slate-200 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2">
                             <FileText size={16} /> View Lease
                         </button>
                         <button className="h-10 px-4 border border-white/20 hover:bg-white/10 rounded-lg text-white transition-colors flex items-center justify-center" title="Download PDF">
                             <Download size={18} />
                         </button>
                         <button className="h-10 px-4 border border-white/20 hover:bg-white/10 rounded-lg text-white transition-colors flex items-center justify-center" title="Print">
                             <Printer size={18} />
                         </button>
                     </div>
                 </div>

                 {/* Decor */}
                 <FileText className="absolute right-[-20px] top-[-20px] w-64 h-64 text-white/5 rotate-[-12deg] pointer-events-none" />
            </div>

            {/* 2. Lease History (Accordion) */}
            <div className="border rounded-xl bg-card overflow-hidden">
                <button 
                    onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                >
                    <span className="font-medium text-sm flex items-center gap-2">
                        <HistoryIcon isActive={isHistoryOpen} /> Previous Leases
                    </span>
                    <ChevronDown size={16} className={cn("text-muted-foreground transition-transform", isHistoryOpen && "rotate-180")} />
                </button>
                <AnimatePresence>
                    {isHistoryOpen && (
                        <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="border-t">
                                {DOCS_STATE.archivedLeases.map(lease => (
                                    <div key={lease.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors border-b last:border-0">
                                        <div>
                                            <p className="font-medium text-sm">{lease.title}</p>
                                            <p className="text-xs text-muted-foreground">{lease.startDate} - {lease.endDate}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold uppercase border">Expired</span>
                                            <button className="text-sm font-medium text-primary hover:underline">Download</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 3. Document Library */}
            <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h2 className="text-xl font-bold">Document Library</h2>
                    
                    <div className="flex items-center gap-2">
                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                            <input 
                                type="text"
                                placeholder="Search documents..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="h-9 pl-9 pr-4 rounded-lg border bg-background text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1px hide-scrollbar border-b">
                    {['all', 'legal', 'financial', 'property', 'notice'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={cn(
                                "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap capitalize",
                                activeTab === tab 
                                    ? "border-primary text-primary" 
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                            )}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Document List */}
                <div className="bg-card border rounded-xl overflow-hidden divide-y">
                    {filteredDocs.length > 0 ? filteredDocs.map((doc) => (
                        <div key={doc.id} className="p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group cursor-pointer">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                    <File size={20} />
                                </div>
                                <div>
                                    <p className="font-medium text-sm group-hover:text-primary transition-colors">{doc.title}</p>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                        <span className="capitalize">{doc.category}</span>
                                        <span>•</span>
                                        <span>{doc.date}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <DocStatusBadge status={doc.status} />
                                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="p-2 hover:bg-muted rounded-full transition-colors" title="Download">
                                        <Download size={16} className="text-muted-foreground hover:text-foreground" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div className="p-12 flex flex-col items-center justify-center text-center text-muted-foreground">
                            <File size={48} className="mb-4 opacity-20" />
                            <p className="font-medium">No documents found</p>
                            <p className="text-sm">Try adjusting your search or filters.</p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}

const HistoryIcon = ({ isActive }: { isActive: boolean }) => (
    <div className={cn("w-5 h-5 rounded-full border flex items-center justify-center transition-colors", isActive ? "bg-primary border-primary text-primary-foreground" : "bg-muted border-muted-foreground/30 text-muted-foreground")}>
        <Clock size={10} />
    </div>
);
