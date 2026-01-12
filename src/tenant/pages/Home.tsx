
import { 
    DollarSign, Calendar, Home as HomeIcon, 
    Wrench, MessageSquare, FileText, 
    ChevronRight, AlertCircle, CheckCircle2, 
    Clock, CreditCard, ShieldCheck,
    ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

// --- MOCK DATA ---

const TENANT_STATE = {
    firstName: 'John',
    rentAmount: 1450,
    rentStatus: 'overdue' as 'paid' | 'due_soon' | 'overdue',
    dueDate: 'Jan 1, 2024',
    balance: 1450,
    lastPayment: { date: 'Dec 1, 2023', amount: 1450, method: 'Auto-Pay (Visa ...4242)' },
    unit: {
        name: 'Sunset Apartments',
        number: 'Unit 3B',
        address: '123 Sunset Blvd, Los Angeles, CA 90026'
    },
    upcoming: [
        { label: 'Lease Renewal Offer', date: 'Expires Feb 15', icon: FileText, urgency: 'high' },
        { label: 'HVAC Inspection', date: 'Jan 20, 2024', icon: Wrench, urgency: 'medium' },
    ],
    maintenance: [
        { id: 'm1', title: 'Water leak under sink', status: 'in_progress', date: '2 hrs ago', urgency: 'high' }
    ],
    messages: [
        { id: 'msg1', sender: 'Property Manager', subject: 'Parking Structure Cleaning', preview: 'Please remove your vehicle by...', date: 'Yesterday', isUnread: true },
        { id: 'msg2', sender: 'System', subject: 'Rent Receipt - December', preview: 'We received your payment of...', date: 'Dec 1', isUnread: false }
    ],
    recentPayments: [
        { id: 'p1', date: 'Dec 1, 2023', amount: 1450, label: 'Rent Payment', status: 'paid' },
        { id: 'p2', date: 'Nov 1, 2023', amount: 1450, label: 'Rent Payment', status: 'paid' },
        { id: 'p3', date: 'Oct 1, 2023', amount: 1450, label: 'Rent Payment', status: 'paid' }
    ]
};

// --- HELPER COMPONENTS ---

const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
        paid: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
        in_progress: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
        waiting: 'bg-amber-500/10 text-amber-600 border-amber-500/20',
        high: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
        default: 'bg-slate-100 text-slate-600 border-slate-200'
    };
    
    const getStyle = (s: string) => {
        if (s === 'paid') return styles.paid;
        if (s === 'in_progress') return styles.in_progress;
        if (s === 'high' || s === 'overdue') return styles.high; 
        return styles.default;
    };

    return (
        <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border", getStyle(status))}>
            {status.replace('_', ' ')}
        </span>
    );
};

export default function TenantHome() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'maintenance' | 'payments' | 'messages' | 'upcoming'>('maintenance');

    // -- 1.1 Rent Status Logic --
    const rentStatusConfig = {
        paid: {
            color: 'bg-emerald-500',
            lightColor: 'bg-emerald-500/10',
            textColor: 'text-emerald-700 dark:text-emerald-400',
            icon: CheckCircle2,
            title: 'Rent is Paid',
            subtitle: 'You are all set for this month!'
        },
        due_soon: {
            color: 'bg-amber-500',
            lightColor: 'bg-amber-500/10',
            textColor: 'text-amber-700 dark:text-amber-400',
            icon: Clock,
            title: 'Rent Due Soon',
            subtitle: `Due on ${TENANT_STATE.dueDate}`
        },
        overdue: {
            color: 'bg-rose-500',
            lightColor: 'bg-rose-500/10',
            textColor: 'text-rose-700 dark:text-rose-400',
            icon: AlertCircle,
            title: 'Rent Overdue',
            subtitle: `Was due on ${TENANT_STATE.dueDate}. Late fees may apply.`
        }
    }[TENANT_STATE.rentStatus];

    const TABS = [
        { id: 'maintenance', label: 'Maintenance', icon: Wrench, count: TENANT_STATE.maintenance.length },
        { id: 'payments', label: 'Payments', icon: CreditCard, count: 0 },
        { id: 'messages', label: 'Messages', icon: MessageSquare, count: TENANT_STATE.messages.filter(m => m.isUnread).length },
        { id: 'upcoming', label: 'Upcoming', icon: Calendar, count: TENANT_STATE.upcoming.length },
    ] as const;

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hi, {TENANT_STATE.firstName}</h1>
                <p className="text-muted-foreground mt-1">Welcome back to your home dashboard.</p>
            </div>

            {/* -- 1. Top Summary Zone -- */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* 1.1 Rent Status Card (Prominent - Left) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="lg:col-span-7 bg-card rounded-2xl border shadow-sm p-8 relative overflow-hidden group flex flex-col justify-between"
                >
                    <div className={cn("absolute top-0 left-0 w-2 h-full", rentStatusConfig.color)} />
                    
                    <div className="flex items-start justify-between relative z-10">
                        <div>
                            <div className={cn("inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4", rentStatusConfig.lightColor, rentStatusConfig.textColor)}>
                                <rentStatusConfig.icon size={16} />
                                {rentStatusConfig.title}
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Total Balance</p>
                                <div className="text-4xl font-bold tracking-tight flex items-baseline gap-1">
                                    ${TENANT_STATE.balance.toLocaleString()}
                                    <span className="text-sm font-normal text-muted-foreground">USD</span>
                                </div>
                                <p className={cn("text-sm font-medium pt-1", rentStatusConfig.textColor)}>
                                    {rentStatusConfig.subtitle}
                                </p>
                            </div>
                        </div>
                        {/* Decorative background Icon */}
                        <DollarSign className="absolute right-[-20px] top-[-20px] w-48 h-48 text-muted/10 rotate-[-15deg] pointer-events-none" />
                    </div>

                    <div className="mt-8 flex gap-3 relative z-10">
                        {TENANT_STATE.rentStatus !== 'paid' ? (
                            <button onClick={() => navigate('/tenant/payments')} className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 rounded-lg font-medium transition-colors shadow-lg shadow-primary/20">
                                Pay Now
                            </button>
                        ) : (
                            <button className="flex-1 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 rounded-lg font-medium transition-colors">
                                View Receipt
                            </button>
                        )}
                        <button className="px-4 h-10 border rounded-lg hover:bg-muted font-medium transition-colors">
                            Manage Auto-Pay
                        </button>
                    </div>
                </motion.div>

                {/* 1.2 Consolidated Unit & Lease Snapshot (Right) */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-8 relative overflow-hidden flex flex-col justify-between"
                >
                    <div className="relative z-10 space-y-6">
                         {/* Unit Info */}
                         <div>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Unit</span>
                                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold uppercase border border-emerald-500/30">
                                    <ShieldCheck size={12} /> Lease Active
                                </span>
                            </div>
                            <h2 className="text-2xl font-bold">{TENANT_STATE.unit.number}</h2>
                            <p className="text-slate-300 text-sm">{TENANT_STATE.unit.name}</p>
                         </div>

                         {/* Lease Info */}
                         <div className="pt-6 border-t border-white/10">
                             <div className="flex justify-between items-end">
                                 <div>
                                     <p className="text-xs text-slate-400 mb-1">Current Lease Ends</p>
                                     <p className="text-lg font-semibold">Feb 28, 2024</p>
                                 </div>
                                 <button onClick={() => navigate('/tenant/documents/lease')} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-medium transition-colors flex items-center gap-1">
                                     Details <ArrowRight size={12} />
                                 </button>
                             </div>
                         </div>
                    </div>
                    
                    {/* Decor */}
                    <HomeIcon className="absolute -bottom-8 -right-8 w-48 h-48 text-white/5 rotate-0 pointer-events-none" />
                </motion.div>
            </div>

            {/* -- 2. Tabbed Content Section -- */ }
            <div className="space-y-6">
                {/* Tabs */}
                <div className="flex items-center gap-2 border-b overflow-x-auto pb-1px hide-scrollbar">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                activeTab === tab.id 
                                    ? "border-primary text-primary" 
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30"
                            )}
                        >
                            <tab.icon size={16} />
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={cn(
                                    "px-1.5 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground",
                                    activeTab === tab.id && "bg-primary/10 text-primary"
                                )}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.15 }}
                        >
                            {/* 2.1 Maintenance Content */}
                            {activeTab === 'maintenance' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-2">
                                        <h3 className="text-lg font-semibold">Active Requests</h3>
                                        <button onClick={() => navigate('/tenant/maintenance/new')} className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                                            + New Request
                                        </button>
                                    </div>
                                    {TENANT_STATE.maintenance.length > 0 ? (
                                        <div className="grid gap-3">
                                            {TENANT_STATE.maintenance.map(ticket => (
                                                <div key={ticket.id} className="bg-card border rounded-xl p-4 flex items-center justify-between hover:border-primary/50 transition-colors cursor-pointer group" onClick={() => navigate(`/tenant/maintenance/${ticket.id}`)}>
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center">
                                                            <Wrench size={20} />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-sm group-hover:text-primary transition-colors">{ticket.title}</p>
                                                            <div className="flex items-center gap-2 mt-1">
                                                                <p className="text-xs text-muted-foreground">{ticket.date}</p>
                                                                <span className="text-[10px] text-muted-foreground">•</span>
                                                                <p className="text-xs text-muted-foreground capitalize">Urgency: {ticket.urgency}</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <StatusBadge status={ticket.status} />
                                                        <ChevronRight size={16} className="text-muted-foreground group-hover:text-foreground" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-12 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center text-muted-foreground">
                                            <CheckCircle2 size={32} className="mb-2 opacity-20" />
                                            <p className="text-sm">No active maintenance requests.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 2.2 Payments Content */}
                            {activeTab === 'payments' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-2">
                                        <h3 className="text-lg font-semibold">Recent History</h3>
                                        <button onClick={() => navigate('/tenant/payments')} className="text-sm font-medium text-primary hover:underline">
                                            View All
                                        </button>
                                    </div>
                                    <div className="bg-card border rounded-xl overflow-hidden">
                                        {TENANT_STATE.recentPayments.map((payment, i) => (
                                            <div key={payment.id} className={cn("p-4 flex items-center justify-between hover:bg-muted/30 transition-colors group", i !== TENANT_STATE.recentPayments.length - 1 && "border-b")}>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                                                        <DollarSign size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm text-foreground">{payment.label}</p>
                                                        <p className="text-xs text-muted-foreground">{payment.date}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-sm">-${payment.amount.toLocaleString()}</p>
                                                    <p className="text-xs text-emerald-600 font-medium capitalize flex items-center justify-end gap-1">
                                                        <CheckCircle2 size={10} /> {payment.status}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 2.3 Messages Content */}
                            {activeTab === 'messages' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center pb-2">
                                        <h3 className="text-lg font-semibold">Inbox</h3>
                                        <button onClick={() => navigate('/tenant/messages')} className="text-sm font-medium text-primary hover:underline">
                                            Go to Messages
                                        </button>
                                    </div>
                                    <div className="bg-card border rounded-xl overflow-hidden divide-y">
                                        {TENANT_STATE.messages.map((msg) => (
                                            <div key={msg.id} className="p-4 hover:bg-muted/30 transition-colors cursor-pointer group flex gap-4 items-start" onClick={() => navigate(`/tenant/messages/${msg.id}`)}>
                                                <div className="w-10 h-10 rounded-full bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                                                    <MessageSquare size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-0.5">
                                                        <p className={cn("text-sm font-medium", msg.isUnread ? "text-primary" : "text-foreground")}>
                                                            {msg.sender}
                                                        </p>
                                                        <span className="text-xs text-muted-foreground">{msg.date}</span>
                                                    </div>
                                                    <p className={cn("text-sm mb-1", msg.isUnread ? "font-semibold text-foreground" : "text-foreground/80")}>
                                                        {msg.subject}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground truncate">
                                                        {msg.preview}
                                                    </p>
                                                </div>
                                                {msg.isUnread && (
                                                    <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 2.4 Upcoming Content */}
                            {activeTab === 'upcoming' && (
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold pb-2">Upcoming Events</h3>
                                    <div className="grid gap-3">
                                        {TENANT_STATE.upcoming.map((item, i) => (
                                            <div key={i} className="bg-card border rounded-xl p-4 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center shrink-0">
                                                    <item.icon size={20} />
                                                </div>
                                                <div>
                                                    <p className="font-medium text-sm">{item.label}</p>
                                                    <p className="text-xs text-muted-foreground">{item.date}</p>
                                                </div>
                                                {item.urgency === 'high' && (
                                                    <span className="ml-auto px-2 py-0.5 bg-rose-500/10 text-rose-600 text-[10px] font-bold uppercase rounded-full border border-rose-500/20">
                                                        Action Required
                                                    </span>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

