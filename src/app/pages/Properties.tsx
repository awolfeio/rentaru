
import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    ChevronDown,
    AlertTriangle,
    Wrench,
    Plus,
    Search,
    Filter,
    Users,
    TrendingUp,
    DollarSign,
    ChevronRight,
    Clock,
    CheckCircle2,
    XCircle,
    LayoutGrid,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

// --- Types ---

type UnitStatus = 'occupied' | 'vacant' | 'maintenance';
type PaymentStatus = 'paid' | 'partial' | 'overdue' | 'unpaid';
type LeaseStatus = 'active' | 'expiring_soon' | 'expired' | 'missing';
type PropertiesViewMode = 'auto' | 'single' | 'portfolio';

interface Unit {
    id: string;
    unitNumber: string;
    status: UnitStatus;
    tenantName?: string;
    rentAmount?: number;
    leaseEndDate?: string;
    maintenanceRequest?: boolean;
    paymentStatus?: PaymentStatus;
    leaseStatus?: LeaseStatus;
}

interface Property {
    id: string;
    name: string;
    address: string;
    units: Unit[];
    rentCollected: number;
    rentExpected: number;
    image?: string;
}

// --- Mock Data ---

const MOCK_PROPERTIES: Property[] = [
    {
        id: 'p1',
        name: 'Highland Lofts',
        address: '4221 Highland Ave, Seattle WA',
        rentCollected: 14200,
        rentExpected: 15600,
        units: [
            { id: 'u1', unitNumber: '101', status: 'occupied',    tenantName: 'Sarah Jenkins', rentAmount: 2300, leaseEndDate: '2025-08-01', paymentStatus: 'paid',    leaseStatus: 'active' },
            { id: 'u2', unitNumber: '102', status: 'occupied',    tenantName: 'Mike Ross',     rentAmount: 2300, leaseEndDate: '2025-03-15', paymentStatus: 'overdue', leaseStatus: 'expiring_soon' },
            { id: 'u3', unitNumber: '201', status: 'maintenance', maintenanceRequest: true },
            { id: 'u4', unitNumber: '202', status: 'occupied',    tenantName: 'Jessica P.',    rentAmount: 2400, leaseEndDate: '2025-11-30', paymentStatus: 'paid',    leaseStatus: 'active' },
            { id: 'u5', unitNumber: '301', status: 'vacant',      rentAmount: 2600 },
            { id: 'u6', unitNumber: '302', status: 'occupied',    tenantName: 'Donna M.',      rentAmount: 2600, leaseEndDate: '2026-01-01', paymentStatus: 'partial', leaseStatus: 'active' },
        ],
    },
    {
        id: 'p2',
        name: 'The Oakley',
        address: '881 Oak Street, Portland OR',
        rentCollected: 8400,
        rentExpected: 8400,
        units: [
            { id: 'u7',  unitNumber: '1A', status: 'occupied', tenantName: 'K. Lamar',  rentAmount: 1200, leaseEndDate: '2025-06-01' },
            { id: 'u8',  unitNumber: '1B', status: 'occupied', tenantName: 'J. Cole',   rentAmount: 1200, leaseEndDate: '2025-06-01' },
            { id: 'u9',  unitNumber: '2A', status: 'occupied', tenantName: 'Drake G.',  rentAmount: 1250, leaseEndDate: '2025-07-01' },
            { id: 'u10', unitNumber: '2B', status: 'occupied', tenantName: 'Travis S.', rentAmount: 1250, leaseEndDate: '2025-07-01' },
            { id: 'u11', unitNumber: '3A', status: 'occupied', tenantName: 'Abel T.',   rentAmount: 1750, leaseEndDate: '2026-02-01' },
            { id: 'u12', unitNumber: '3B', status: 'occupied', tenantName: 'Future',    rentAmount: 1750, leaseEndDate: '2026-02-01' },
        ],
    },
    {
        id: 'p3',
        name: 'Sunset Duplex',
        address: '101 Sunset Blvd, Los Angeles CA',
        rentCollected: 0,
        rentExpected: 4500,
        units: [
            { id: 'u13', unitNumber: 'A', status: 'occupied', tenantName: 'Walter W.', rentAmount: 2250, leaseEndDate: '2025-12-01' },
            { id: 'u14', unitNumber: 'B', status: 'occupied', tenantName: 'Jesse P.',  rentAmount: 2250, leaseEndDate: '2025-12-01', maintenanceRequest: true },
        ],
    },
];

// --- Shared badge components ---

const StatusBadge = ({ status }: { status: UnitStatus }) => {
    const styles: Record<UnitStatus, string> = {
        occupied:    'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20',
        vacant:      'bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20',
        maintenance: 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20',
    };
    const labels: Record<UnitStatus, string> = { occupied: 'Occupied', vacant: 'Vacant', maintenance: 'Maintenance' };
    return (
        <span className={cn('text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide', styles[status])}>
            {labels[status]}
        </span>
    );
};

const PaymentBadge = ({ status }: { status: PaymentStatus }) => {
    const styles: Record<PaymentStatus, string> = {
        paid:    'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20',
        partial: 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20',
        overdue: 'bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20',
        unpaid:  'bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20',
    };
    return (
        <span className={cn('text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide', styles[status])}>
            {status}
        </span>
    );
};

const LeaseBadge = ({ status }: { status: LeaseStatus }) => {
    const styles: Record<LeaseStatus, string> = {
        active:         'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20',
        expiring_soon:  'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20',
        expired:        'bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20',
        missing:        'bg-slate-100/50 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border-slate-200/50 dark:border-slate-700',
    };
    const labels: Record<LeaseStatus, string> = {
        active: 'Active', expiring_soon: 'Expiring Soon', expired: 'Expired', missing: 'No Lease',
    };
    return (
        <span className={cn('text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide', styles[status])}>
            {labels[status]}
        </span>
    );
};

// --- Portfolio mode components (preserved from original) ---

const UnitTable = ({ units }: { units: Unit[] }) => (
    <div className="w-full bg-slate-50/50 dark:bg-slate-900/20 border-t border-border/50 animate-in fade-in slide-in-from-top-1 duration-200">
        <table className="w-full text-sm text-left">
            <thead className="bg-slate-100/50 dark:bg-slate-800/50 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                <tr>
                    <th className="px-6 py-3 pl-14">Unit</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3">Tenant</th>
                    <th className="px-6 py-3">Rent</th>
                    <th className="px-6 py-3">Lease</th>
                    <th className="px-6 py-3 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
                {units.map((unit) => (
                    <tr key={unit.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-3 pl-14 font-medium">{unit.unitNumber}</td>
                        <td className="px-6 py-3"><StatusBadge status={unit.status} /></td>
                        <td className="px-6 py-3 text-muted-foreground">{unit.tenantName || '—'}</td>
                        <td className="px-6 py-3 font-medium">{unit.rentAmount ? `$${unit.rentAmount.toLocaleString()}` : '—'}</td>
                        <td className="px-6 py-3 text-muted-foreground">{unit.leaseEndDate || '—'}</td>
                        <td className="px-6 py-3 text-right">
                            {unit.maintenanceRequest && (
                                <span className="inline-flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 font-medium mr-4">
                                    <Wrench size={12} /> Req
                                </span>
                            )}
                            <button className="text-muted-foreground hover:text-foreground transition-colors">Edit</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const PropertyRow = ({ property }: { property: Property }) => {
    const [expanded, setExpanded] = useState(false);
    const navigate = useNavigate();

    const occupiedCount = property.units.filter(u => u.status === 'occupied').length;
    const occupancyRate = Math.round((occupiedCount / property.units.length) * 100);
    const maintenanceCount = property.units.filter(u => u.maintenanceRequest || u.status === 'maintenance').length;
    const isOverdue = property.rentCollected < property.rentExpected;

    return (
        <div className={cn(
            'group border rounded-xl bg-card transition-all duration-200',
            expanded ? 'shadow-md ring-1 ring-primary/5 border-primary/20' : 'hover:border-primary/20 hover:shadow-sm',
        )}>
            <div className="p-4 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer" onClick={() => navigate(`/app/properties/${property.id}`)}>
                <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Building2 size={20} /></div>
                        <div>
                            <h3 className="font-semibold text-foreground">{property.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin size={12} />{property.address}</div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="text-muted-foreground text-xs mb-1">Units</div>
                        <div className="font-semibold text-base">{property.units.length}</div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="text-muted-foreground text-xs mb-1">Occupancy</div>
                        <div className={cn('font-semibold text-base', occupancyRate < 90 ? 'text-amber-600 dark:text-amber-500' : 'text-foreground')}>
                            {occupancyRate}%
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="text-muted-foreground text-xs mb-1">Rent Status</div>
                        <div className="flex flex-col items-center leading-tight">
                            <span className="font-semibold text-base">${property.rentCollected.toLocaleString()}</span>
                            <span className="text-muted-foreground text-[11px] font-normal">/ ${property.rentExpected.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="flex flex-col items-center justify-center text-center">
                        <div className="text-muted-foreground text-xs mb-1">Maintenance</div>
                        <div className="font-medium flex items-center justify-center h-6">
                            {maintenanceCount > 0
                                ? <span className="text-amber-600 dark:text-amber-500 flex items-center gap-1.5 font-semibold"><Wrench size={14} /> {maintenanceCount}</span>
                                : <span className="text-muted-foreground">—</span>
                            }
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4 justify-end min-w-[100px]">
                    {isOverdue && <div className="text-rose-500" title="Rent Overdue"><AlertTriangle size={18} /></div>}
                    <div
                        className={cn('transition-transform duration-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800', expanded && 'rotate-180')}
                        onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
                    >
                        <ChevronDown size={20} className="text-muted-foreground" />
                    </div>
                </div>
            </div>

            {expanded && <UnitTable units={property.units} />}
        </div>
    );
};

// --- Portfolio view ---

const PortfolioPropertiesView = ({ properties }: { properties: Property[] }) => {
    const navigate = useNavigate();
    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
                    <p className="text-muted-foreground">Manage your buildings and check unit status.</p>
                </div>
                <button
                    onClick={() => navigate('/app/properties/new')}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm"
                >
                    <Plus size={16} /> Add Property
                </button>
            </div>

            <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm max-w-2xl">
                <Search className="text-muted-foreground ml-2" size={18} />
                <input type="text" placeholder="Search properties..." className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground outline-none" />
                <div className="w-px h-6 bg-border mx-2" />
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Filter size={14} /> Filters
                </button>
            </div>

            <div className="space-y-4">
                {properties.map(p => <PropertyRow key={p.id} property={p} />)}
            </div>
        </div>
    );
};

// --- Empty state ---

const EmptyPropertiesState = () => {
    const navigate = useNavigate();
    const steps = [
        'Add property details',
        'Create units',
        'Invite tenants',
        'Set rent amounts',
        'Upload leases',
    ];
    return (
        <div className="max-w-3xl mx-auto py-20 text-center space-y-8">
            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Building2 size={28} />
            </div>
            <div className="space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">Set up your first property</h1>
                <p className="text-muted-foreground max-w-sm mx-auto">
                    Add your property, create units, invite tenants, and start tracking rent from one place.
                </p>
            </div>
            <div className="inline-block text-left bg-card border rounded-xl px-8 py-6 shadow-sm space-y-3">
                {steps.map((step, i) => (
                    <div key={step} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground text-[10px] font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                        {step}
                    </div>
                ))}
            </div>
            <button
                onClick={() => navigate('/app/properties/new')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm shadow-sm"
            >
                <Plus size={16} /> Add Property
            </button>
        </div>
    );
};

// --- Single property summary cards ---

interface SummaryCardProps {
    label: string;
    value: string;
    helper?: string;
    icon: React.ReactNode;
    tone?: 'default' | 'warning' | 'danger' | 'success';
}

const PropertySummaryCard = ({ label, value, helper, icon, tone = 'default' }: SummaryCardProps) => (
    <div className="rounded-xl border bg-card p-5 shadow-sm flex flex-col gap-3">
        <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
            <div className={cn(
                'p-2 rounded-lg',
                tone === 'success' ? 'bg-emerald-500/10 text-emerald-600' :
                tone === 'warning' ? 'bg-amber-500/10 text-amber-600' :
                tone === 'danger'  ? 'bg-rose-500/10 text-rose-600' :
                'bg-muted text-muted-foreground',
            )}>
                {icon}
            </div>
        </div>
        <div>
            <div className={cn(
                'text-2xl font-bold tracking-tight',
                tone === 'success' && 'text-emerald-600 dark:text-emerald-500',
                tone === 'warning' && 'text-amber-600 dark:text-amber-500',
                tone === 'danger'  && 'text-rose-600 dark:text-rose-500',
            )}>
                {value}
            </div>
            {helper && <p className="text-xs text-muted-foreground mt-1">{helper}</p>}
        </div>
    </div>
);

// --- Single property units table ---

const SinglePropertyUnitsTable = ({ property }: { property: Property }) => {
    const navigate = useNavigate();
    const [search, setSearch] = useState('');

    const filtered = property.units.filter(u =>
        u.unitNumber.toLowerCase().includes(search.toLowerCase()) ||
        (u.tenantName?.toLowerCase() ?? '').includes(search.toLowerCase())
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <h2 className="text-lg font-semibold">Units</h2>
                    <p className="text-sm text-muted-foreground">Manage occupancy, leases, rent, and maintenance by unit.</p>
                </div>
                <button className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-card hover:bg-muted transition-colors font-medium text-sm shrink-0">
                    <Plus size={15} /> Add Unit
                </button>
            </div>

            <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm">
                <Search className="text-muted-foreground ml-2 shrink-0" size={16} />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search units, tenants..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground outline-none"
                />
                <div className="w-px h-6 bg-border mx-2" />
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                    <Filter size={14} /> Filters
                </button>
            </div>

            <div className="rounded-xl border bg-card overflow-hidden shadow-sm">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-100/50 dark:bg-slate-800/50 text-muted-foreground font-medium text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-5 py-3">Unit</th>
                            <th className="px-5 py-3">Status</th>
                            <th className="px-5 py-3">Tenant</th>
                            <th className="px-5 py-3">Rent</th>
                            <th className="px-5 py-3">Payment</th>
                            <th className="px-5 py-3">Lease</th>
                            <th className="px-5 py-3">Maintenance</th>
                            <th className="px-5 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border/30">
                        {filtered.map(unit => (
                            <tr key={unit.id} className="hover:bg-slate-100/50 dark:hover:bg-slate-800/30 transition-colors">
                                <td className="px-5 py-4 font-semibold">{unit.unitNumber}</td>
                                <td className="px-5 py-4"><StatusBadge status={unit.status} /></td>
                                <td className="px-5 py-4 text-muted-foreground">{unit.tenantName || <span className="italic text-muted-foreground/60">No tenant</span>}</td>
                                <td className="px-5 py-4 font-medium">{unit.rentAmount ? `$${unit.rentAmount.toLocaleString()}` : <span className="text-muted-foreground">—</span>}</td>
                                <td className="px-5 py-4">
                                    {unit.paymentStatus
                                        ? <PaymentBadge status={unit.paymentStatus} />
                                        : <span className="text-muted-foreground">—</span>
                                    }
                                </td>
                                <td className="px-5 py-4">
                                    {unit.leaseStatus
                                        ? <LeaseBadge status={unit.leaseStatus} />
                                        : unit.leaseEndDate
                                            ? <span className="text-muted-foreground text-xs">{unit.leaseEndDate}</span>
                                            : <span className="text-muted-foreground">—</span>
                                    }
                                </td>
                                <td className="px-5 py-4">
                                    {unit.maintenanceRequest || unit.status === 'maintenance'
                                        ? <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-500 font-medium text-xs"><Wrench size={13} /> Open</span>
                                        : <span className="text-muted-foreground">—</span>
                                    }
                                </td>
                                <td className="px-5 py-4 text-right">
                                    <button
                                        onClick={() => navigate(`/app/properties/${property.id}/units/${unit.id}`)}
                                        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        View <ChevronRight size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filtered.length === 0 && (
                            <tr>
                                <td colSpan={8} className="px-5 py-10 text-center text-muted-foreground text-sm">
                                    No units match your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Property activity feed ---

const PropertyActivityFeed = ({ property }: { property: Property }) => {
    const items = [
        ...property.units
            .filter(u => u.paymentStatus === 'overdue')
            .map(u => ({
                id: `overdue-${u.id}`,
                icon: <XCircle size={15} className="text-rose-500" />,
                bg: 'bg-rose-500/10',
                text: `Unit ${u.unitNumber} — rent overdue`,
                sub: u.tenantName ?? 'Unknown tenant',
                time: '2 days ago',
            })),
        ...property.units
            .filter(u => u.maintenanceRequest || u.status === 'maintenance')
            .map(u => ({
                id: `maint-${u.id}`,
                icon: <Wrench size={15} className="text-amber-500" />,
                bg: 'bg-amber-500/10',
                text: `Unit ${u.unitNumber} — maintenance request open`,
                sub: u.tenantName ?? 'No tenant assigned',
                time: '5 hours ago',
            })),
        ...property.units
            .filter(u => u.leaseStatus === 'expiring_soon')
            .map(u => ({
                id: `lease-${u.id}`,
                icon: <Clock size={15} className="text-blue-500" />,
                bg: 'bg-blue-500/10',
                text: `Unit ${u.unitNumber} — lease expiring ${u.leaseEndDate ?? 'soon'}`,
                sub: u.tenantName ?? 'Unknown tenant',
                time: 'This week',
            })),
        ...property.units
            .filter(u => u.paymentStatus === 'paid')
            .slice(0, 2)
            .map(u => ({
                id: `paid-${u.id}`,
                icon: <CheckCircle2 size={15} className="text-emerald-500" />,
                bg: 'bg-emerald-500/10',
                text: `Unit ${u.unitNumber} — rent payment confirmed`,
                sub: u.tenantName ?? 'Tenant',
                time: '3 days ago',
            })),
    ];

    if (items.length === 0) return null;

    return (
        <div className="space-y-3">
            <h2 className="text-lg font-semibold">Recent Activity</h2>
            <div className="rounded-xl border bg-card shadow-sm divide-y divide-border/50">
                {items.map(item => (
                    <div key={item.id} className="flex items-start gap-4 px-5 py-4">
                        <div className={cn('p-1.5 rounded-lg mt-0.5 shrink-0', item.bg)}>
                            {item.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{item.text}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.sub}</p>
                        </div>
                        <span className="text-xs text-muted-foreground shrink-0">{item.time}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Single property overview ---

const SinglePropertyOverview = ({ property }: { property: Property }) => {
    const navigate = useNavigate();

    const occupiedCount   = property.units.filter(u => u.status === 'occupied').length;
    const vacantCount     = property.units.filter(u => u.status === 'vacant').length;
    const occupancyRate   = Math.round((occupiedCount / property.units.length) * 100);
    const maintenanceCount = property.units.filter(u => u.maintenanceRequest || u.status === 'maintenance').length;
    const expiringSoon    = property.units.filter(u => u.leaseStatus === 'expiring_soon').length;
    const rentShortfall   = property.rentExpected - property.rentCollected;

    return (
        <div className="max-w-6xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary"><Building2 size={20} /></div>
                        <h1 className="text-2xl font-bold tracking-tight">{property.name}</h1>
                    </div>
                    <p className="text-muted-foreground flex items-center gap-1.5 text-sm pl-0.5">
                        <MapPin size={14} className="shrink-0" /> {property.address}
                    </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={() => navigate(`/app/properties/${property.id}`)}
                        className="px-4 py-2 rounded-lg border bg-card hover:bg-muted transition-colors font-medium text-sm"
                    >
                        Edit Property
                    </button>
                    <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm">
                        <Plus size={16} /> Add Unit
                    </button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
                <PropertySummaryCard
                    label="Units"
                    value={`${property.units.length}`}
                    helper={`${occupiedCount} occupied · ${vacantCount} vacant`}
                    icon={<LayoutGrid size={16} />}
                    tone="default"
                />
                <PropertySummaryCard
                    label="Occupancy"
                    value={`${occupancyRate}%`}
                    helper={occupancyRate < 90 ? 'Below target' : 'Fully stabilized'}
                    icon={<Users size={16} />}
                    tone={occupancyRate < 90 ? 'warning' : 'success'}
                />
                <PropertySummaryCard
                    label="Rent Collected"
                    value={`$${property.rentCollected.toLocaleString()}`}
                    helper={rentShortfall > 0
                        ? `$${rentShortfall.toLocaleString()} remaining`
                        : `of $${property.rentExpected.toLocaleString()} expected`}
                    icon={<DollarSign size={16} />}
                    tone={rentShortfall > 0 ? 'warning' : 'success'}
                />
                <PropertySummaryCard
                    label="Maintenance"
                    value={maintenanceCount > 0 ? `${maintenanceCount} open` : 'Clear'}
                    helper={maintenanceCount > 0 ? 'Requests need attention' : 'No open requests'}
                    icon={<Wrench size={16} />}
                    tone={maintenanceCount > 0 ? 'warning' : 'success'}
                />
                <PropertySummaryCard
                    label="Lease Alerts"
                    value={expiringSoon > 0 ? `${expiringSoon} expiring` : 'All clear'}
                    helper={expiringSoon > 0 ? 'Review renewal offers' : 'No upcoming expirations'}
                    icon={<TrendingUp size={16} />}
                    tone={expiringSoon > 0 ? 'warning' : 'success'}
                />
            </div>

            {/* Units table */}
            <SinglePropertyUnitsTable property={property} />

            {/* Activity feed */}
            <PropertyActivityFeed property={property} />
        </div>
    );
};

// --- Dev mode toggle ---

const PropertiesDevModeToggle = ({ mode, onModeChange }: { mode: PropertiesViewMode; onModeChange: (m: PropertiesViewMode) => void }) => {
    const next: Record<PropertiesViewMode, PropertiesViewMode> = { auto: 'single', single: 'portfolio', portfolio: 'auto' };
    const labels: Record<PropertiesViewMode, string> = { auto: 'Auto', single: 'Single', portfolio: 'Portfolio' };
    const toolbar = document.getElementById('dev-toolbar');
    if (!toolbar) return null;
    return createPortal(
        <button
            type="button"
            onClick={() => onModeChange(next[mode])}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-2 text-[11px] font-bold uppercase tracking-wide shadow-lg border border-slate-700 hover:bg-slate-800 transition-all opacity-50 hover:opacity-100"
            title="Dev toggle: Properties view mode"
        >
            <LayoutGrid size={12} />
            Properties: {labels[mode]}
        </button>,
        toolbar,
    );
};

// --- Page ---

export default function PropertiesPage() {
    const [devViewMode, setDevViewMode] = useState<PropertiesViewMode>('auto');

    const effectiveMode: 'empty' | 'single' | 'portfolio' = (() => {
        if (devViewMode === 'single')    return 'single';
        if (devViewMode === 'portfolio') return 'portfolio';
        if (MOCK_PROPERTIES.length === 0) return 'empty';
        if (MOCK_PROPERTIES.length === 1) return 'single';
        return 'portfolio';
    })();

    return (
        <>
            {effectiveMode === 'empty'     && <EmptyPropertiesState />}
            {effectiveMode === 'single'    && <SinglePropertyOverview property={MOCK_PROPERTIES[0]} />}
            {effectiveMode === 'portfolio' && <PortfolioPropertiesView properties={MOCK_PROPERTIES} />}

            {import.meta.env.DEV && (
                <PropertiesDevModeToggle mode={devViewMode} onModeChange={setDevViewMode} />
            )}
        </>
    );
}
