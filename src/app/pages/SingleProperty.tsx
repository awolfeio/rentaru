import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Building2,
    MapPin,
    ArrowUpRight,
    AlertTriangle,
    Clock,
    Plus,
    Wrench,
    FileText,
    DollarSign,
    Download,
    Users
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

// --- Types ---

interface PropertyMetrics {
    occupancyRate: number;
    rentCollected: number;
    rentExpected: number;
    overdueBalance: number;
    openMaintenanceCount: number;
    leasesEndingSoon: number;
}

interface UnitSummary {
    id: string;
    unitNumber: string;
    status: 'occupied' | 'vacant' | 'maintenance';
    tenantName?: string;
    rent?: number;
    leaseEndDate?: string;
    flags?: string[];
}

interface ActivityItem {
    id: string;
    type: 'payment' | 'maintenance' | 'lease' | 'message';
    title: string;
    timestamp: string;
}

// --- Mock Data ---

const MOCK_METRICS: PropertyMetrics = {
    occupancyRate: 94,
    rentCollected: 48200,
    rentExpected: 51000,
    overdueBalance: 1850,
    openMaintenanceCount: 3,
    leasesEndingSoon: 2
};

const MOCK_UNITS: UnitSummary[] = [
    { id: 'u1', unitNumber: '101', status: 'occupied', tenantName: 'Jane Smith', rent: 1450, leaseEndDate: '2024-06-30' },
    { id: 'u2', unitNumber: '102', status: 'vacant', rent: 1600 },
    { id: 'u3', unitNumber: '103', status: 'occupied', tenantName: 'Michael Chen', rent: 1500, leaseEndDate: '2024-02-15', flags: ['lease_ending'] },
    { id: 'u4', unitNumber: '201', status: 'maintenance', flags: ['repair_ongoing'] },
    { id: 'u5', unitNumber: '202', status: 'occupied', tenantName: 'Sarah Jones', rent: 1550, leaseEndDate: '2024-08-31', flags: ['late_payment'] },
];

const MOCK_ACTIVITY: ActivityItem[] = [
    { id: 'a1', type: 'payment', title: 'Rent received from Unit 101', timestamp: '2h ago' },
    { id: 'a2', type: 'maintenance', title: 'New ticket: HVAC Issue (Unit 201)', timestamp: '5h ago' },
    { id: 'a3', type: 'message', title: 'Message from Michael Chen', timestamp: 'Yesterday' },
    { id: 'a4', type: 'lease', title: 'Lease signed for Unit 302', timestamp: '2 days ago' },
];

// --- Components ---

const KPICard = ({ label, value, subtext, alert }: { label: string, value: string, subtext?: string, alert?: boolean }) => (
    <div className={cn("p-4 bg-card border rounded-xl flex flex-col justify-between shadow-sm cursor-pointer hover:border-primary/50 transition-colors", alert && "border-amber-200 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-900/10")}>
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
        <div className="mt-2">
            <div className={cn("text-2xl font-bold tracking-tight", alert ? "text-amber-700 dark:text-amber-500" : "text-foreground")}>{value}</div>
            {subtext && <div className="text-xs text-muted-foreground mt-1">{subtext}</div>}
        </div>
    </div>
);

const UnitRow = ({ unit, onClick }: { unit: UnitSummary, onClick: () => void }) => (
    <div 
        onClick={onClick}
        className="grid grid-cols-12 gap-4 px-4 py-3 items-center border-b hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors cursor-pointer group"
    >
        <div className="col-span-2 font-medium">{unit.unitNumber}</div>
        <div className="col-span-3">
            <span className={cn(
                "inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full border",
                unit.status === 'occupied' ? "bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20" :
                    unit.status === 'vacant' ? "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700" :
                        "bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/20"
            )}>
                {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
            </span>
        </div>
        <div className="col-span-3 text-sm text-foreground">{unit.tenantName || '—'}</div>
        <div className="col-span-2 text-sm tabular-nums text-right">{unit.rent ? `$${unit.rent}` : '—'}</div>
        <div className="col-span-2 flex justify-end gap-2 text-muted-foreground group-hover:text-foreground">
            {unit.flags?.includes('late_payment') && <DollarSign size={16} className="text-rose-500" />}
            {unit.flags?.includes('lease_ending') && <Clock size={16} className="text-amber-500" />}
            {unit.flags?.includes('repair_ongoing') && <Wrench size={16} className="text-amber-500" />}
        </div>
    </div>
);

const ActivityRow = ({ item }: { item: ActivityItem }) => {
    const icons = {
        payment: <DollarSign size={14} className="text-emerald-600" />,
        maintenance: <Wrench size={14} className="text-amber-600" />,
        lease: <FileText size={14} className="text-blue-600" />,
        message: <Users size={14} className="text-purple-600" />,
    };

    return (
        <div className="flex gap-3 py-3 border-b last:border-0 items-start">
            <div className="mt-0.5 p-1.5 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0">
                {icons[item.type]}
            </div>
            <div>
                <p className="text-sm font-medium text-foreground">{item.title}</p>
                <span className="text-xs text-muted-foreground">{item.timestamp}</span>
            </div>
        </div>
    );
};

import { PropertyActionsMenu } from '@/shared/components/properties/PropertyActionsMenu';
import { TimeRangeToggle, PlaceholderChart } from '@/shared/components/dashboard/FinancialWidgets';

export default function SinglePropertyPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    // In a real app, fetch property details by ID here

    return (
        <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">

            {/* --- Property Header --- */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1">
                    <button
                        onClick={() => navigate('/app/properties')}
                        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors mb-2"
                    >
                        <ArrowLeft size={16} /> Back to Properties
                    </button>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        Highland Lofts
                    </h1>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin size={16} />
                        <span>123 Highland Ave, Seattle WA 98102</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Building2 size={16} />
                        <span>Apartment Building</span>
                        <span className="w-1 h-1 rounded-full bg-border" />
                        <span>24 Units</span>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-card border rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
                        <FileText size={16} className="text-muted-foreground" /> Reports
                    </button>
                    <button
                        onClick={() => navigate(`/app/properties/${id}/units/new`)}
                        className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
                    >
                        <Plus size={16} /> Add Unit
                    </button>
                    <PropertyActionsMenu />
                </div>
            </div>

            {/* --- KPI Strip --- */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <KPICard label="Occupancy" value={`${MOCK_METRICS.occupancyRate}%`} subtext="2 vacant units" />
                <KPICard label="Rent (MTD)" value={`$${(MOCK_METRICS.rentCollected / 1000).toFixed(1)}k`} subtext={`of $${(MOCK_METRICS.rentExpected / 1000).toFixed(1)}k expected`} />
                <KPICard label="Overdue" value={`$${MOCK_METRICS.overdueBalance}`} alert={true} subtext="3 tenants late" />
                <KPICard label="Maintenance" value={MOCK_METRICS.openMaintenanceCount.toString()} subtext="1 urgent ticket" />
                <KPICard label="Renewals" value={MOCK_METRICS.leasesEndingSoon.toString()} subtext="Ending in 60 days" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- Left Column (2/3): Units & Financials --- */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Units Table */}
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b flex items-center justify-between">
                            <h2 className="font-semibold">Units</h2>
                            <div className="flex gap-2">
                                <button className="text-xs font-medium px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-muted-foreground hover:text-foreground">Filter</button>
                            </div>
                        </div>
                        <div className="bg-slate-50/50 dark:bg-slate-900/50 grid grid-cols-12 gap-4 px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider border-b">
                            <div className="col-span-2">Unit</div>
                            <div className="col-span-3">Status</div>
                            <div className="col-span-3">Tenant</div>
                            <div className="col-span-2 text-right">Rent</div>
                            <div className="col-span-2"></div>
                        </div>
                        <div>
                            {MOCK_UNITS.map(unit => (
                                <UnitRow 
                                    key={unit.id} 
                                    unit={unit} 
                                    onClick={() => navigate(`/app/properties/${id}/units/${unit.id}`)}
                                />
                            ))}
                            <div className="p-3 text-center border-t text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                                View All 24 Units
                            </div>
                        </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-semibold">Financial Performance</h2>
                            <TimeRangeToggle />
                        </div>
                        <div className="grid grid-cols-3 gap-8 text-center mb-6">
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Income</div>
                                <div className="text-xl font-bold text-foreground">$48,200</div>
                                <div className="text-xs text-emerald-600 mt-1 flex justify-center items-center gap-1">
                                    <ArrowUpRight size={12} /> 4.2%
                                </div>
                            </div>
                            <div className="relative">
                                <div className="absolute inset-y-2 -left-4 w-px bg-border/50" />
                                <div className="text-sm text-muted-foreground mb-1">Expenses</div>
                                <div className="text-xl font-bold text-foreground">$12,450</div>
                                <div className="text-xs text-muted-foreground mt-1">Normal range</div>
                                <div className="absolute inset-y-2 -right-4 w-px bg-border/50" />
                            </div>
                            <div>
                                <div className="text-sm text-muted-foreground mb-1">Net Cash Flow</div>
                                <div className="text-xl font-bold text-emerald-600">$35,750</div>
                                <div className="text-xs text-emerald-600 mt-1 font-medium">Healthy</div>
                            </div>
                        </div>
                        <PlaceholderChart height="160px" />
                    </div>

                </div>

                {/* --- Right Column (1/3): Activity & Quick Actions --- */}
                <div className="space-y-8">

                    {/* Activity Feed */}
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
                        <div className="px-6 py-4 border-b">
                            <h2 className="font-semibold">Recent Activity</h2>
                        </div>
                        <div className="p-4">
                            {MOCK_ACTIVITY.map(item => (
                                <ActivityRow key={item.id} item={item} />
                            ))}
                        </div>
                    </div>

                    {/* Maintenance Snapshot */}
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm p-6">
                        <h2 className="font-semibold mb-4">Maintenance</h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-rose-50 dark:bg-rose-900/10 border border-rose-100 dark:border-rose-900/20 rounded-lg">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle size={18} className="text-rose-600" />
                                    <div className="text-sm font-medium text-rose-900 dark:text-rose-300">HVAC Failure</div>
                                </div>
                                <span className="text-xs font-bold text-rose-700 bg-rose-200/50 px-2 py-0.5 rounded">URGENT</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 border rounded-lg">
                                <div className="text-sm font-medium">Leaking Faucet</div>
                                <span className="text-xs text-muted-foreground">Unit 104</span>
                            </div>
                            <button className="w-full py-2 text-sm text-center text-primary font-medium hover:underline">
                                View All Tickets
                            </button>
                        </div>
                    </div>

                    {/* Documents Quick Links */}
                    <div className="bg-card border rounded-xl overflow-hidden shadow-sm p-6">
                        <h2 className="font-semibold mb-4">Documents</h2>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 -mx-2 rounded-md transition-colors">
                                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                                    <FileText size={16} /> Insurance Policy
                                </div>
                                <Download size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                            </div>
                            <div className="flex items-center justify-between text-sm group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-2 -mx-2 rounded-md transition-colors">
                                <div className="flex items-center gap-2 text-muted-foreground group-hover:text-foreground">
                                    <FileText size={16} /> Inspection Report (2023)
                                </div>
                                <Download size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}
