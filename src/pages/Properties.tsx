
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  ChevronDown, 
  AlertTriangle, 
  Wrench, 
  Plus, 
  Search, 
  Filter 
} from 'lucide-react';
import { cn } from '@/lib/utils';

// --- Types ---

type UnitStatus = 'occupied' | 'vacant' | 'maintenance';

interface Unit {
  id: string;
  unitNumber: string;
  status: UnitStatus;
  tenantName?: string;
  rentAmount?: number;
  leaseEndDate?: string;
  maintenanceRequest?: boolean;
}

interface Property {
  id: string;
  name: string;
  address: string;
  units: Unit[];
  rentCollected: number;
  rentExpected: number;
  image?: string; // Optional thumbnail
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
      { id: 'u1', unitNumber: '101', status: 'occupied', tenantName: 'Sarah Jenkins', rentAmount: 2300, leaseEndDate: '2024-08-01' },
      { id: 'u2', unitNumber: '102', status: 'occupied', tenantName: 'Mike Ross', rentAmount: 2300, leaseEndDate: '2024-09-15' },
      { id: 'u3', unitNumber: '201', status: 'maintenance', maintenanceRequest: true },
      { id: 'u4', unitNumber: '202', status: 'occupied', tenantName: 'Jessica P.', rentAmount: 2400, leaseEndDate: '2024-11-30' },
      { id: 'u5', unitNumber: '301', status: 'vacant', rentAmount: 2600 },
      { id: 'u6', unitNumber: '302', status: 'occupied', tenantName: 'Donna M.', rentAmount: 2600, leaseEndDate: '2025-01-01' },
    ]
  },
  {
    id: 'p2',
    name: 'The Oakley',
    address: '881 Oak Street, Portland OR',
    rentCollected: 8400,
    rentExpected: 8400,
    units: [
      { id: 'u7', unitNumber: '1A', status: 'occupied', tenantName: 'K. Lamar', rentAmount: 1200, leaseEndDate: '2024-06-01' },
      { id: 'u8', unitNumber: '1B', status: 'occupied', tenantName: 'J. Cole', rentAmount: 1200, leaseEndDate: '2024-06-01' },
      { id: 'u9', unitNumber: '2A', status: 'occupied', tenantName: 'Drake G.', rentAmount: 1250, leaseEndDate: '2024-07-01' },
      { id: 'u10', unitNumber: '2B', status: 'occupied', tenantName: 'Travis S.', rentAmount: 1250, leaseEndDate: '2024-07-01' },
      { id: 'u11', unitNumber: '3A', status: 'occupied', tenantName: 'Abel T.', rentAmount: 1750, leaseEndDate: '2025-02-01' },
      { id: 'u12', unitNumber: '3B', status: 'occupied', tenantName: 'Future', rentAmount: 1750, leaseEndDate: '2025-02-01' },
    ]
  },
  {
    id: 'p3',
    name: 'Sunset Duplex',
    address: '101 Sunset Blvd, Los Angeles CA',
    rentCollected: 0,
    rentExpected: 4500,
    units: [
      { id: 'u13', unitNumber: 'A', status: 'occupied', tenantName: 'Walter W.', rentAmount: 2250, leaseEndDate: '2024-12-01' },
      { id: 'u14', unitNumber: 'B', status: 'occupied', tenantName: 'Jesse P.', rentAmount: 2250, leaseEndDate: '2024-12-01', maintenanceRequest: true },
    ]
  }
];

// --- Components ---

const StatusBadge = ({ status }: { status: UnitStatus }) => {
  const styles = {
    occupied: 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-500/20',
    vacant: 'bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20',
    maintenance: 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20'
  };

  const labels = {
    occupied: 'Occupied',
    vacant: 'Vacant',
    maintenance: 'Maintenance'
  };

  return (
    <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide", styles[status])}>
      {labels[status]}
    </span>
  );
};

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
               <button className="text-muted-foreground hover:text-foreground transition-colors">
                 Edit
               </button>
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
        "group border rounded-xl bg-card transition-all duration-200",
        expanded ? "shadow-md ring-1 ring-primary/5 border-primary/20" : "hover:border-primary/20 hover:shadow-sm"
    )}>
      <div 
        className="p-4 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
        onClick={() => navigate(`/properties/${property.id}`)}
      >
        {/* Identifiers */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Building2 size={20} />
             </div>
             <div>
                <h3 className="font-semibold text-foreground">{property.name}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin size={12} />
                  {property.address}
                </div>
             </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
            
            {/* Unit Count */}
            <div className="text-sm">
                <div className="text-muted-foreground text-xs">Units</div>
                <div className="font-medium">{property.units.length}</div>
            </div>

            {/* Occupancy */}
            <div className="text-sm">
                <div className="text-muted-foreground text-xs">Occupancy</div>
                <div className={cn("font-medium", occupancyRate < 90 ? "text-amber-600 dark:text-amber-500" : "text-foreground")}>
                    {occupancyRate}%
                </div>
            </div>

            {/* Financial */}
            <div className="text-sm">
                <div className="text-muted-foreground text-xs">Rent Status</div>
                <div className="font-medium flex items-center gap-1">
                    ${property.rentCollected.toLocaleString()}
                    <span className="text-muted-foreground font-normal text-xs">/ ${property.rentExpected.toLocaleString()}</span>
                </div>
            </div>

            {/* Maintenance */}
            <div className="text-sm">
                 <div className="text-muted-foreground text-xs">Maintenance</div>
                 <div className="font-medium flex items-center gap-1">
                    {maintenanceCount > 0 ? (
                        <span className="text-amber-600 dark:text-amber-500 flex items-center gap-1">
                            <Wrench size={12} /> {maintenanceCount}
                        </span>
                    ) : (
                        <span className="text-muted-foreground">—</span>
                    )}
                 </div>
            </div>
        </div>

        {/* Actions & Alerts */}
        <div className="flex items-center gap-4 justify-end min-w-[100px]">
            {isOverdue && (
                <div className="text-rose-500" title="Rent Overdue">
                    <AlertTriangle size={18} />
                </div>
            )}
            
            <div 
                className={cn(
                    "transition-transform duration-200 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800", 
                    expanded && "rotate-180"
                )}
                onClick={(e) => {
                    e.stopPropagation();
                    setExpanded(!expanded);
                }}
            >
                <ChevronDown size={20} className="text-muted-foreground" />
            </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && <UnitTable units={property.units} />}
    </div>
  );
};

export default function PropertiesPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Properties</h1>
          <p className="text-muted-foreground">Manage your buildings and check unit status.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm">
             <Plus size={16} />
             Add Property
           </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm max-w-2xl">
         <Search className="text-muted-foreground ml-2" size={18} />
         <input 
            type="text" 
            placeholder="Search properties..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground"
         />
         <div className="w-px h-6 bg-border mx-2" />
         <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Filter size={14} />
            Filters
         </button>
      </div>

      {/* Property List */}
      <div className="space-y-4">
        {MOCK_PROPERTIES.map(p => (
            <PropertyRow key={p.id} property={p} />
        ))}
      </div>

    </div>
  );
}
