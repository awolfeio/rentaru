
import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_TENANTS } from '@/mockData/tenants';
import { 
    User, Phone, Mail, MapPin, Calendar, CreditCard, 
    FileText, Wrench, MessageSquare, Users, Shield, 
    Clock, AlertCircle, CheckCircle2, MoreVertical,
    ArrowUpRight, Download, Plus, History, DollarSign,
    Building, Key
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

// Types based on the plan
type TabType = 'overview' | 'leases' | 'payments' | 'maintenance' | 'documents' | 'messages' | 'household' | 'notes' | 'activity';

interface ActivityEvent {
    id: string;
    type: 'status_change' | 'payment' | 'lease' | 'maintenance' | 'note' | 'communication';
    description: string;
    actor: string;
    timestamp: string;
}

interface HouseholdMember {
    id: string;
    name: string;
    role: 'co-tenant' | 'occupant' | 'emergency';
    relation?: string;
    phone: string;
    email?: string;
}

// Mock Data Extensions
const MOCK_ACTIVITY_LOG: ActivityEvent[] = [
    { id: 'a1', type: 'payment', description: 'Rent payment of $1,600 received', actor: 'System', timestamp: '2024-01-01T10:00:00' },
    { id: 'a2', type: 'maintenance', description: 'opened ticket #M-1024: "Leaky Faucet"', actor: 'Jane Smith', timestamp: '2023-12-28T14:30:00' },
    { id: 'a3', type: 'communication', description: 'Sent lease renewal reminder email', actor: 'System', timestamp: '2023-12-15T09:00:00' },
    { id: 'a4', type: 'note', description: 'Tenant mentioned getting a dog next month', actor: 'Admin', timestamp: '2023-11-20T11:15:00' },
];

const MOCK_HOUSEHOLD: HouseholdMember[] = [
    { id: 'h1', name: 'James Smith', role: 'occupant', relation: 'Spouse', phone: '555-0102', email: 'james.s@example.com' },
    { id: 'h2', name: 'Mary Johnson', role: 'emergency', relation: 'Mother', phone: '555-0199' },
];

export default function TenantProfile() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const tenant = MOCK_TENANTS.find(t => t.id === id);

    if (!tenant) {
        return (
            <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <User className="w-8 h-8 text-muted-foreground" />
                </div>
                <h2 className="text-xl font-semibold">Tenant Not Found</h2>
                <p className="text-muted-foreground mt-2 mb-6">The tenant profile you are looking for does not exist.</p>
                <button onClick={() => navigate('/tenants')} className="text-primary hover:underline">
                    Return to Tenants List
                </button>
            </div>
        );
    }

    // Helper functions for UI
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active': return 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200/50';
            case 'inactive': return 'bg-slate-500/15 text-slate-700 dark:text-slate-400 border-slate-200/50';
            case 'pending_move_in': return 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200/50';
            case 'eviction': return 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-200/50';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    return (
        <div className="max-w-[1600px] mx-auto min-h-screen pb-20">
            {/* 1. Header Section */}
            <div className="bg-background border-b sticky top-0 z-30 pt-6 pb-0 px-8 mb-6">
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    {/* Avatar */}
                    <div className="shrink-0">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-slate-100 dark:from-indigo-900/50 dark:to-slate-900/50 border flex items-center justify-center text-3xl font-bold text-indigo-600 dark:text-indigo-400 shadow-sm">
                            {tenant.name.split(' ').map(n => n[0]).join('')}
                        </div>
                    </div>

                    {/* Identity & Status */}
                    <div className="flex-1 min-w-0 pt-1">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                                    {tenant.name}
                                    {tenant.tags.map(tag => (
                                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-indigo-50 text-indigo-600 border border-indigo-100">
                                            {tag.replace('_', ' ')}
                                        </span>
                                    ))}
                                </h1>
                                <div className="mt-3 flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1.5">
                                        <Mail className="w-4 h-4 text-slate-400" />
                                        <a href={`mailto:${tenant.email}`} className="hover:text-primary transition-colors">{tenant.email}</a>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Phone className="w-4 h-4 text-slate-400" />
                                        <a href={`tel:${tenant.phone}`} className="hover:text-primary transition-colors">{tenant.phone || 'No phone'}</a>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock className="w-4 h-4 text-slate-400" />
                                        <span>Customer since {format(new Date(tenant.createdAt), 'MMM yyyy')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Status Chips */}
                            <div className="flex flex-col items-end gap-2">
                                <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border", getStatusColor(tenant.leaseStatus))}>
                                    Lease: {tenant.leaseStatus.replace(/_/g, ' ')}
                                </div>
                                <div className={cn("px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border", 
                                    tenant.rentStatus === 'paid' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                    tenant.rentStatus === 'overdue' ? 'bg-red-50 text-red-600 border-red-100' : 
                                    'bg-amber-50 text-amber-600 border-amber-100'
                                )}>
                                    Rent: {tenant.rentStatus}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar mask-gradient-right">
                    {[
                        { id: 'overview', label: 'Overview', icon: Building },
                        { id: 'leases', label: 'Leases', icon: Key },
                        { id: 'payments', label: 'Payments', icon: DollarSign },
                        { id: 'maintenance', label: 'Maintenance', icon: Wrench },
                        { id: 'documents', label: 'Documents', icon: FileText },
                        { id: 'messages', label: 'Messages', icon: MessageSquare },
                        { id: 'household', label: 'Household', icon: Users },
                        { id: 'notes', label: 'Notes', icon: Shield },
                        { id: 'activity', label: 'Activity', icon: History },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all whitespace-nowrap",
                                activeTab === tab.id
                                    ? "border-primary text-primary"
                                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                            )}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="px-8">
                <div className="grid grid-cols-12 gap-8">
                    {/* Main Content Area */}
                    <div className="col-span-12 lg:col-span-9 space-y-6">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'overview' && <OverviewTab tenant={tenant} />}
                                {activeTab === 'leases' && <LeasesTab tenant={tenant} />}
                                {activeTab === 'payments' && <PaymentsTab tenant={tenant} />}
                                {activeTab === 'household' && <HouseholdTab tenant={tenant} />}
                                {activeTab === 'activity' && <ActivityTab tenant={tenant} />}
                                {['maintenance', 'documents', 'messages', 'notes'].includes(activeTab) && (
                                    <div className="p-12 text-center border rounded-xl border-dashed bg-muted/30">
                                        <Wrench className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-foreground">Work in Progress</h3>
                                        <p className="text-muted-foreground">The {activeTab} section is currently under development.</p>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Sidebar / Actions - Sticky */}
                    <div className="col-span-12 lg:col-span-3 space-y-6">
                        {/* Quick Actions Card */}
                        <div className="bg-card rounded-xl border shadow-sm p-4 sticky top-48">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Quick Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors text-left group">
                                    <div className="p-1.5 bg-background rounded-md shadow-sm group-hover:scale-105 transition-transform">
                                        <MessageSquare className="w-4 h-4 text-blue-600" />
                                    </div>
                                    Message Tenant
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors text-left group">
                                    <div className="p-1.5 bg-background rounded-md shadow-sm group-hover:scale-105 transition-transform">
                                        <CreditCard className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    Record Payment
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-foreground bg-secondary/50 hover:bg-secondary rounded-lg transition-colors text-left group">
                                    <div className="p-1.5 bg-background rounded-md shadow-sm group-hover:scale-105 transition-transform">
                                        <Wrench className="w-4 h-4 text-amber-600" />
                                    </div>
                                    Create Ticket
                                </button>
                                <div className="h-px bg-border my-2" />
                                <button className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-colors text-left">
                                    <MoreVertical className="w-4 h-4" />
                                    More Options
                                </button>
                            </div>
                        </div>

                        {/* Current Contact Info Summary */}
                        <div className="bg-card rounded-xl border shadow-sm p-5">
                            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Current Residence</h3>
                            <div className="space-y-4">
                                <div>
                                    <span className="text-xs text-muted-foreground block mb-1">Property</span>
                                    <div className="font-medium text-sm flex items-center gap-2">
                                        <Building className="w-3.5 h-3.5 text-muted-foreground" />
                                        {tenant.propertyName}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block mb-1">Unit</span>
                                    <div className="font-medium text-sm flex items-center gap-2">
                                        <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                                        {tenant.unitNumber}
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs text-muted-foreground block mb-1">Lease Term</span>
                                    <div className="font-medium text-sm">
                                        {format(new Date(tenant.leaseStartDate), 'MMM d, yyyy')} - {format(new Date(tenant.leaseEndDate), 'MMM d, yyyy')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Sub-components (Tab Content) ---

function OverviewTab({ tenant }: { tenant: any }) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CardMetric 
                    label="Current Balance" 
                    value={`$${tenant.balance.toLocaleString()}`} 
                    subtext={tenant.balance > 0 ? "Overdue" : "In good standing"} 
                    status={tenant.balance > 0 ? 'critical' : 'good'}
                    icon={DollarSign}
                />
                <CardMetric 
                    label="Monthly Rent" 
                    value={`$${tenant.rentAmount.toLocaleString()}`} 
                    subtext={`Due on the 1st`}
                    status="neutral"
                    icon={Calendar}
                />
                <CardMetric 
                    label="Open Tickets" 
                    value={tenant.maintenanceRequestCount.toString()} 
                    subtext={tenant.maintenanceRequestCount > 0 ? "Review required" : "No active requests"} 
                    status={tenant.maintenanceRequestCount > 0 ? 'warning' : 'good'}
                    icon={Wrench}
                />
            </div>

            {/* Recent Activity Mini-Feed */}
            <div className="bg-card rounded-xl border shadow-sm">
                <div className="px-6 py-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold text-sm">Recent Activity</h3>
                    <button className="text-xs font-medium text-primary hover:underline">View All</button>
                </div>
                <div className="p-0">
                    {MOCK_ACTIVITY_LOG.map((event, i) => (
                        <div key={event.id} className={cn("flex gap-4 p-4 hover:bg-muted/30 transition-colors", i !== MOCK_ACTIVITY_LOG.length - 1 && "border-b")}>
                            <div className="shrink-0 mt-1">
                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                    {event.type === 'payment' && <DollarSign className="w-4 h-4 text-emerald-600" />}
                                    {event.type === 'maintenance' && <Wrench className="w-4 h-4 text-amber-600" />}
                                    {event.type === 'communication' && <Mail className="w-4 h-4 text-blue-600" />}
                                    {event.type === 'note' && <FileText className="w-4 h-4 text-slate-600" />}
                                </div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground">{event.description}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                    <span>{format(new Date(event.timestamp), 'MMM d, h:mm a')}</span>
                                    <span>•</span>
                                    <span>by {event.actor}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function LeasesTab({ tenant }: { tenant: any }) {
    return (
        <div className="bg-card rounded-xl border shadow-sm">
            <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-sm">Lease History</h3>
            </div>
            <div className="p-6">
                <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-8 pl-8">
                    {/* Current Lease */}
                    <div className="relative">
                        <div className="absolute -left-[39px] mt-1.5 w-5 h-5 rounded-full border-2 border-emerald-500 bg-background" />
                        <div className="bg-muted/30 p-4 rounded-lg border">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-sm">Current Lease</h4>
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-700 font-medium uppercase">Active</span>
                                    </div>
                                    <p className="text-sm text-foreground mt-1">{tenant.propertyName} - {tenant.unitNumber}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium">${tenant.rentAmount}/mo</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4 text-sm text-muted-foreground">
                                <div>
                                    <span className="block text-xs uppercase tracking-wider mb-1">Term</span>
                                    {format(new Date(tenant.leaseStartDate), 'MMM d, yyyy')} - {format(new Date(tenant.leaseEndDate), 'MMM d, yyyy')}
                                </div>
                                <div>
                                    <span className="block text-xs uppercase tracking-wider mb-1">Deposit</span>
                                    $1,500.00 (Held)
                                </div>
                            </div>
                            <div className="mt-4 flex gap-3">
                                <button className="text-xs font-medium text-primary border border-primary/20 px-3 py-1.5 rounded-md hover:bg-primary/5">View Agreement</button>
                                <button className="text-xs font-medium text-foreground border border-border px-3 py-1.5 rounded-md hover:bg-muted">Renew Lease</button>
                            </div>
                        </div>
                    </div>

                    {/* Past Lease Example */}
                    <div className="relative opacity-60">
                        <div className="absolute -left-[39px] mt-1.5 w-5 h-5 rounded-full border-2 border-slate-300 bg-background" />
                        <div className="bg-transparent p-4 rounded-lg border border-dashed">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h4 className="font-semibold text-sm">Previous Lease</h4>
                                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 font-medium uppercase">Expired</span>
                                    </div>
                                    <p className="text-sm text-foreground mt-1">Different Property (Example)</p>
                                </div>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">
                                Jan 1, 2022 - Jan 1, 2023
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PaymentsTab({ tenant }: { tenant: any }) {
    return (
        <div className="bg-card rounded-xl border shadow-sm">
             <div className="px-6 py-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-sm">Ledger</h3>
                <div className="flex gap-2">
                    <button className="text-xs font-medium px-3 py-1.5 rounded-md hover:bg-muted transition-colors flex items-center gap-1">
                        <Download className="w-3.5 h-3.5" /> Export
                    </button>
                    <button className="text-xs font-medium px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center gap-1">
                        <Plus className="w-3.5 h-3.5" /> Record Payment
                    </button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/40 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Type</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3 text-right">Amount</th>
                            <th className="px-6 py-3 text-right">Balance</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {/* Mock Ledger Rows */}
                        <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">{format(new Date(), 'MMM d, yyyy')}</td>
                            <td className="px-6 py-4">Rent Charge - January 2025</td>
                            <td className="px-6 py-4 text-xs uppercase tracking-wide">Charge</td>
                            <td className="px-6 py-4"><span className="inline-flex items-center text-xs font-medium text-slate-600">Posted</span></td>
                            <td className="px-6 py-4 text-right font-medium text-foreground">${tenant.rentAmount.toLocaleString()}</td>
                            <td className="px-6 py-4 text-right text-muted-foreground">$1,600.00</td>
                        </tr>
                        <tr className="hover:bg-muted/50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">{format(new Date().setDate(1), 'MMM d, yyyy')}</td>
                            <td className="px-6 py-4">Payment - ACH</td>
                            <td className="px-6 py-4 text-xs uppercase tracking-wide">Payment</td>
                            <td className="px-6 py-4"><span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700">Cleared</span></td>
                            <td className="px-6 py-4 text-right font-medium text-emerald-600">(${tenant.rentAmount.toLocaleString()})</td>
                            <td className="px-6 py-4 text-right text-muted-foreground">$0.00</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function HouseholdTab({ tenant }: { tenant: any }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_HOUSEHOLD.map(member => (
                <div key={member.id} className="bg-card p-5 rounded-xl border shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-600 font-semibold">
                        {member.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <h4 className="font-medium text-foreground">{member.name}</h4>
                            <span className={cn(
                                "text-[10px] font-bold uppercase px-2 py-0.5 rounded",
                                member.role === 'emergency' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                            )}>
                                {member.role}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">{member.relation}</p>
                        
                        <div className="space-y-1 text-sm">
                            <div className="flex items-center gap-2">
                                <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                                <a href={`tel:${member.phone}`} className="hover:text-primary">{member.phone}</a>
                            </div>
                            {member.email && (
                            <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                                <a href={`mailto:${member.email}`} className="hover:text-primary">{member.email}</a>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

function ActivityTab({ tenant }: { tenant: any }) {
    return (
        <div className="bg-card rounded-xl border shadow-sm">
             <div className="px-6 py-4 border-b">
                <h3 className="font-semibold text-sm">Audit Log</h3>
            </div>
            <div className="p-0 divide-y">
                {MOCK_ACTIVITY_LOG.map((event) => (
                    <div key={event.id} className="flex gap-4 p-4 px-6 hover:bg-muted/30 transition-colors">
                        <div className="text-xs text-muted-foreground w-24 shrink-0 pt-1">
                            {format(new Date(event.timestamp), 'MMM d, h:mm a')}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <span className={cn("text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border",
                                    event.type === 'payment' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                    event.type === 'maintenance' ? 'bg-amber-50 border-amber-100 text-amber-700' :
                                    'bg-slate-50 border-slate-100 text-slate-700'
                                )}>{event.type}</span>
                                <span className="text-xs text-muted-foreground">by {event.actor}</span>
                            </div>
                            <p className="text-sm text-foreground">{event.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

function CardMetric({ label, value, subtext, status, icon: Icon }: any) {
    return (
        <div className="p-5 rounded-xl border bg-card shadow-sm flex items-start justify-between">
            <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">{label}</p>
                <div className="text-2xl font-bold text-foreground mb-1">{value}</div>
                <p className={cn("text-xs font-medium",
                    status === 'good' ? 'text-emerald-600' :
                    status === 'critical' ? 'text-red-600' :
                    status === 'warning' ? 'text-amber-600' :
                    'text-muted-foreground'
                )}>
                    {subtext}
                </p>
            </div>
            <div className={cn("p-2 rounded-lg",
                 status === 'good' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20' :
                 status === 'critical' ? 'bg-red-100 text-red-600 dark:bg-red-900/20' :
                 status === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/20' :
                 'bg-slate-100 text-slate-600 dark:bg-slate-800'
            )}>
                <Icon className="w-5 h-5" />
            </div>
        </div>
    );
}
