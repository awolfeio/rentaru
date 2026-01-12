
import { 
    DollarSign, CreditCard, ChevronDown, CheckCircle2, 
    AlertCircle, Clock, Calendar, Download, FileText,
    History, Plus, ArrowRight
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// --- MOCK DATA ---
const PAYMENT_STATE = {
    balance: 1450,
    dueDate: 'Jan 1, 2024',
    status: 'overdue' as 'paid' | 'due_soon' | 'overdue',
    breakdown: [
        { label: 'Base Rent (Unit 3B)', amount: 1350, type: 'rent' },
        { label: 'Parking Space #42', amount: 50, type: 'fee' },
        { label: 'Water / Sewer', amount: 35, type: 'utility' },
        { label: 'Trash', amount: 15, type: 'utility' },
    ],
    methods: [
        { id: 'pm1', type: 'ach', name: 'Chase Checking ...4242', fee: 0, isDefault: true },
        { id: 'pm2', type: 'card', name: 'Visa ...8899', fee: 0.029, isDefault: false },
    ],
    history: [
        { id: 'h1', date: 'Dec 1, 2023', description: 'Rent Payment', amount: 1450, status: 'success', method: 'Chase Checking ...4242' },
        { id: 'h2', date: 'Nov 1, 2023', description: 'Rent Payment', amount: 1450, status: 'success', method: 'Chase Checking ...4242' },
        { id: 'h3', date: 'Oct 1, 2023', description: 'Rent Payment', amount: 1450, status: 'success', method: 'Chase Checking ...4242' },
        { id: 'h4', date: 'Oct 5, 2023', description: 'Late Fee Payment', amount: 75, status: 'success', method: 'Visa ...8899' },
    ],
    autopay: {
        enabled: true,
        methodId: 'pm1',
        day: 1
    }
};

// --- SUB-COMPONENTS ---

const PaymentMethodCard = ({ method, isSelected, onClick }: { method: any, isSelected: boolean, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className={cn(
            "p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between",
            isSelected 
                ? "border-primary bg-primary/10 shadow-sm" 
                : "border-white/10 bg-transparent hover:bg-white/5 hover:border-white/30"
        )}
    >
        <div className="flex items-center gap-3">
             <div className={cn("p-2 rounded-lg", isSelected ? "bg-primary/20 text-primary" : "bg-white/5 text-slate-400")}>
                <CreditCard size={20} />
             </div>
             <div>
                 <p className={cn("font-medium text-sm", isSelected ? "text-white" : "text-slate-300")}>{method.name}</p>
                 <p className="text-xs text-slate-500">
                    {method.fee > 0 ? `${(method.fee * 100).toFixed(1)}% Fee` : 'No Fee'}
                 </p>
             </div>
        </div>
        {isSelected && (
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <CheckCircle2 size={12} className="text-white" />
            </div>
        )}
    </div>
);

const HistoryRow = ({ item }: { item: any }) => (
    <div className="flex items-center justify-between p-4 bg-card border rounded-xl hover:border-primary/30 transition-colors group">
        <div className="flex items-center gap-4">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", 
                item.status === 'success' ? "bg-emerald-500/10 text-emerald-600" : "bg-red-500/10 text-red-600"
            )}>
                 {item.status === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            </div>
            <div>
                <p className="font-medium text-sm">{item.description}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{item.date}</span>
                    <span>•</span>
                    <span>{item.method}</span>
                </div>
            </div>
        </div>
        <div className="text-right">
            <p className="font-bold text-sm">-${item.amount.toLocaleString()}</p>
            <button className="text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:underline flex items-center gap-1 justify-end mt-1">
                Receipt <Download size={10} />
            </button>
        </div>
    </div>
);

export default function TenantPayments() {
    const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);
    const [selectedMethodId, setSelectedMethodId] = useState(PAYMENT_STATE.methods[0].id);
    const [paymentAmount, setPaymentAmount] = useState<number>(PAYMENT_STATE.balance);

    const activeMethod = PAYMENT_STATE.methods.find(m => m.id === selectedMethodId);
    const feeAmount = activeMethod ? activeMethod.fee * paymentAmount : 0;
    const totalPayment = paymentAmount + feeAmount;

    // --- RENDER HELPERS ---
    const StatusConfig = {
        paid: { color: 'bg-emerald-500', icon: CheckCircle2, text: 'Paid in Full' },
        due_soon: { color: 'bg-amber-500', icon: Clock, text: 'Due Soon' },
        overdue: { color: 'bg-rose-500', icon: AlertCircle, text: 'Payment Overdue' },
    }[PAYMENT_STATE.status];

    return (
        <div className="max-w-4xl mx-auto space-y-8 pb-24">
            
            {/* Header */}
            <div>
                 <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
                 <p className="text-muted-foreground mt-1">Manage payments, view history, and set up autopay.</p>
            </div>

            {/* 1. Payment Summary Card (Dominant) */}
            <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl shadow-xl overflow-hidden relative">
                {/* Status Strip */}
                <div className={cn("absolute top-0 left-0 w-full h-1.5 z-20", StatusConfig.color)} />
                
                <div className="grid md:grid-cols-2">
                    {/* Left: Balance Info */}
                    <div className="p-8 pb-0 md:pb-8 flex flex-col justify-between relative z-10">
                        <div>
                             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-sm font-medium mb-6">
                                <StatusConfig.icon size={16} className={cn(
                                    PAYMENT_STATE.status === 'paid' ? 'text-emerald-400' : 
                                    PAYMENT_STATE.status === 'overdue' ? 'text-rose-400' : 'text-amber-400'
                                )} />
                                {StatusConfig.text}
                             </div>
                             
                             <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Total Balance Due</p>
                             <div className="text-5xl font-bold tracking-tight flex items-baseline gap-2 mb-2">
                                ${PAYMENT_STATE.balance.toLocaleString()}
                                <span className="text-lg font-normal text-slate-400">USD</span>
                             </div>
                             <p className="text-slate-300 text-sm">
                                Due Date: <span className="font-medium text-white">{PAYMENT_STATE.dueDate}</span>
                             </p>
                        </div>

                        {/* Breakdown Toggle */}
                        <button 
                            onClick={() => setIsBreakdownOpen(!isBreakdownOpen)}
                            className="mt-8 flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
                        >
                            <ChevronDown className={cn("transition-transform", isBreakdownOpen && "rotate-180")} size={16} />
                            {isBreakdownOpen ? 'Hide Breakdown' : 'View Breakdown'}
                        </button>
                    </div>

                    {/* Right: Quick Pay Module */}
                    <div className="p-8 bg-black/20 backdrop-blur-sm border-l border-white/5 flex flex-col justify-between">
                         <div className="space-y-4">
                             <p className="text-sm font-medium text-slate-300">Select Method</p>
                             <div className="space-y-2">
                                 {PAYMENT_STATE.methods.map(method => (
                                     <PaymentMethodCard 
                                         key={method.id} 
                                         method={method} 
                                         isSelected={selectedMethodId === method.id}
                                         onClick={() => setSelectedMethodId(method.id)}
                                     />
                                 ))}
                                 <button className="w-full py-2 border-2 border-dashed border-white/10 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:border-white/30 transition-all flex items-center justify-center gap-2">
                                     <Plus size={14} /> Add Payment Method
                                 </button>
                             </div>
                         </div>

                         <div className="mt-8">
                             <div className="flex justify-between items-center text-sm mb-4 text-slate-400">
                                 <span>Subtotal</span>
                                 <span>${paymentAmount.toLocaleString()}</span>
                             </div>
                             {feeAmount > 0 && (
                                <div className="flex justify-between items-center text-sm mb-4 text-slate-400">
                                    <span>Processing Fee</span>
                                    <span>${feeAmount.toFixed(2)}</span>
                                </div>
                             )}
                             <button className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold text-lg shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2">
                                 Pay ${totalPayment.toLocaleString()}
                             </button>
                         </div>
                    </div>
                </div>

                {/* Decor */}
                <DollarSign className="absolute left-[-20px] bottom-[-20px] w-64 h-64 text-white/5 rotate-[15deg] pointer-events-none" />

                {/* 2. Breakdown Section (Expandable) */}
                <AnimatePresence>
                    {isBreakdownOpen && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="bg-white/5 border-t border-white/10"
                        >
                            <div className="p-8 grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    {PAYMENT_STATE.breakdown.map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-sm">
                                            <span className="text-slate-300">{item.label}</span>
                                            <span className="font-medium font-mono">${item.amount}</span>
                                        </div>
                                    ))}
                                    <div className="border-t border-white/10 pt-3 mt-3 flex justify-between text-base font-bold">
                                         <span>Total</span>
                                         <span>${PAYMENT_STATE.balance}</span>
                                    </div>
                                </div>
                                <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 text-sm text-rose-200">
                                     <div className="flex items-center gap-2 font-bold mb-1">
                                        <AlertCircle size={16} /> Late Fee Warning
                                     </div>
                                     <p className="opacity-80 leading-relaxed">
                                        Your payment is overdue. A late fee of $75 will be applied if not paid by tomorrow, Jan 12.
                                     </p>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 4. Autopay Section */}
            <div className="flex items-center justify-between p-6 bg-card border rounded-2xl shadow-sm">
                <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center">
                         <Calendar size={24} />
                     </div>
                     <div>
                         <h3 className="font-bold text-base">Autopay is Enabled</h3>
                         <p className="text-sm text-muted-foreground">
                            Scheduled for the <span className="font-medium text-foreground">1st of every month</span> using <span className="font-medium text-foreground">Chase Checking</span>.
                         </p>
                     </div>
                </div>
                <button className="px-4 py-2 border rounded-lg text-sm font-medium hover:bg-muted transition-colors">
                    Manage Autopay
                </button>
            </div>

            {/* 5. Payment History */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                     <h2 className="text-xl font-bold flex items-center gap-2">
                         <History size={20} className="text-muted-foreground" />
                         Payment History
                     </h2>
                     <button className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                         Download All <Download size={12} />
                     </button>
                </div>

                <div className="space-y-3">
                    {/* Month Headers could be added here for grouped history */}
                    {PAYMENT_STATE.history.map(item => (
                        <HistoryRow key={item.id} item={item} />
                    ))}
                </div>
                
                <button className="w-full py-3 border border-dashed rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted/50 transition-colors">
                    Load More Transactions
                </button>
            </div>

            {/* 7. Documents Section */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-card border rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                     <FileText className="w-8 h-8 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
                     <h3 className="font-bold">2023 Tax Documents</h3>
                     <p className="text-sm text-muted-foreground mt-1 mb-4">Download your annual rent verification form.</p>
                     <div className="flex items-center gap-2 text-sm font-medium text-primary">
                         Download PDF <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </div>
                </div>
                <div className="p-6 bg-card border rounded-xl hover:border-primary/50 transition-colors cursor-pointer group">
                     <FileText className="w-8 h-8 text-muted-foreground mb-4 group-hover:text-primary transition-colors" />
                     <h3 className="font-bold">Lease Agreement</h3>
                     <p className="text-sm text-muted-foreground mt-1 mb-4">View your current signed lease terms.</p>
                     <div className="flex items-center gap-2 text-sm font-medium text-primary">
                         View Document <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                     </div>
                </div>
            </div>

        </div>
    );
}
