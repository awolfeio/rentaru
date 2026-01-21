import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  MoreVertical,
  Edit,
  Archive,
  UserPlus,
  FileText,
  DollarSign,
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  CreditCard,
  Download,
  MessageSquare,
  Shield,
  Activity,
  Home,
  Bed,
  Bath,
  Maximize,
  Car,
  Box,
  Sofa,
  UploadCloud
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Mock Data ---

const MOCK_UNIT = {
  id: 'u103',
  propertyId: 'p1',
  propertyName: 'Highland Lofts',
  unitNumber: '103',
  type: '1BR / 1BA',
  floor: 1,
  building: 'North Wing',
  sqft: 750,
  beds: 1,
  baths: 1,
  parking: true,
  storage: false,
  furnished: false,
  marketRent: 1650,
  status: 'occupied', // occupied, vacant, maintenance
  metrics: {
    rent: 1600,
    balance: 0,
    leaseStatus: 'active',
    maintenanceCount: 0,
    urgentMaintenance: false,
  }
};

const MOCK_TENANT = {
  id: 't1',
  name: 'Michael Chen',
  email: 'm.chen@example.com',
  phone: '(555) 123-4567',
  moveInDate: '2023-08-01',
  leaseEndDate: '2024-07-31',
  autopay: true,
  paymentMethod: 'Credit Card ending in 4242',
  emergencyContact: {
    name: 'Sarah Chen',
    phone: '(555) 987-6543',
    relation: 'Sister'
  }
};

const MOCK_LEASE = {
  startDate: '2023-08-01',
  endDate: '2024-07-31',
  term: '12 months',
  rent: 1600,
  deposit: 1600,
  petDeposit: 0,
  lateFee: '5% after 5 days',
  clauses: ['No smoking', 'Pets allowed (under 20lbs)'],
  history: [
    { type: 'renewal', date: '2023-08-01', note: 'Renewed for 12 months at $1600' },
    { type: 'signed', date: '2022-08-01', note: 'Initial lease sign at $1550' }
  ]
};

const MOCK_MAINTENANCE = [
  { id: 'm1', title: 'Leaking faucet', category: 'Plumbing', priority: 'medium', status: 'closed', date: '2023-11-15' },
  { id: 'm2', title: 'HVAC Filter Replacement', category: 'HVAC', priority: 'low', status: 'open', date: '2024-01-05' },
];

const MOCK_ACTIVITY = [
  { id: 'a1', type: 'payment', title: 'Rent Payment Received', date: '2024-01-01', amount: '$1600.00' },
  { id: 'a2', type: 'maintenance', title: 'Ticket #m2 Created', date: '2024-01-05', user: 'Michael Chen' },
  { id: 'a3', type: 'system', title: 'Auto-pay Triggered', date: '2024-01-01', note: 'Scheduled for 1st of month' },
];

const MOCK_DOCUMENTS = [
  { id: 'd1', name: 'Lease Agreement 2023-2024.pdf', type: 'lease', date: '2023-07-15', size: '2.4 MB' },
  { id: 'd2', name: 'Move-in Inspection.pdf', type: 'inspection', date: '2023-08-01', size: '4.1 MB' },
  { id: 'd3', name: 'Appliance Manuals.zip', type: 'manuals', date: '2022-08-01', size: '12 MB' },
];

// --- Components ---

const KPICard = ({ label, value, subtext, icon: Icon, alert }: any) => (
  <div className={cn(
    "p-4 bg-card border rounded-xl flex flex-col justify-between shadow-sm hover:border-primary/20 transition-all",
    alert && "border-amber-200 bg-amber-50/30 dark:border-amber-900/30 dark:bg-amber-900/10"
  )}>
    <div className="flex justify-between items-start">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</span>
      {Icon && <Icon size={14} className="text-muted-foreground" />}
    </div>
    <div className="mt-2">
      <div className={cn("text-2xl font-bold tracking-tight", alert ? "text-amber-700 dark:text-amber-500" : "text-foreground")}>
        {value}
      </div>
      {subtext && <div className="text-xs text-muted-foreground mt-1">{subtext}</div>}
    </div>
  </div>
);

const TabButton = ({ active, label, onClick, icon: Icon }: any) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-4 py-2 text-sm font-medium border-b-2 transition-colors",
      active 
        ? "border-primary text-primary" 
        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
    )}
  >
    {Icon && <Icon size={14} />}
    {label}
  </button>
);

// --- Sections ---

const OverviewTab = ({ navigate }: { navigate: any }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="md:col-span-2 space-y-6">
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Home size={18} className="text-muted-foreground" />
            Unit Specifications
          </h3>
        </div>
        <div className="p-6 grid grid-cols-2 gap-y-6 gap-x-4">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Type</div>
            <div className="font-medium">{MOCK_UNIT.type}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Size</div>
            <div className="font-medium flex items-center gap-1"><Maximize size={14} /> {MOCK_UNIT.sqft} sqft</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Layout</div>
            <div className="font-medium flex items-center gap-3">
              <span className="flex items-center gap-1"><Bed size={14} /> {MOCK_UNIT.beds} Bed</span>
              <span className="flex items-center gap-1"><Bath size={14} /> {MOCK_UNIT.baths} Bath</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Floor</div>
            <div className="font-medium">{MOCK_UNIT.floor}</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wider">Amenities</div>
            <div className="flex flex-wrap gap-2">
              {MOCK_UNIT.parking && <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs"><Car size={12} /> Parking</span>}
              {MOCK_UNIT.furnished ? 
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded text-xs"><Sofa size={12} /> Furnished</span> :
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs text-muted-foreground">Unfurnished</span>
              }
              {MOCK_UNIT.storage && <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs"><Box size={12} /> Storage</span>}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card border rounded-xl overflow-hidden shadow-sm p-6">
        <h3 className="font-semibold text-lg mb-4">Notes</h3>
        <textarea 
          className="w-full h-32 p-3 bg-slate-50 dark:bg-slate-900 border rounded-lg text-sm focus:ring-1 focus:ring-primary outline-none resize-none"
          placeholder="Add internal notes about this unit..."
          defaultValue="Corner unit, recently painted. North-facing view."
        />
        <div className="flex justify-end mt-2">
          <button className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors">
            Save Note
          </button>
        </div>
      </div>
    </div>

    <div className="space-y-6">
      {/* Current Tenant Card in Overview */}
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
         <div className="px-6 py-4 border-b flex justify-between items-center bg-slate-50/50 dark:bg-slate-900/30">
          <h3 className="font-semibold">Current Tenant</h3>
          <span className="text-xs bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full font-medium">Active</span>
        </div>
        <div className="p-6 space-y-4">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
               {MOCK_TENANT.name.split(' ').map(n=>n[0]).join('')}
             </div>
             <div>
               <div className="font-medium text-foreground">{MOCK_TENANT.name}</div>
               <div className="text-xs text-muted-foreground">{MOCK_TENANT.email}</div>
             </div>
           </div>
           
           <div className="pt-4 border-t space-y-2 text-sm">
             <div className="flex justify-between">
               <span className="text-muted-foreground">Move In</span>
               <span>{MOCK_TENANT.moveInDate}</span>
             </div>
             <div className="flex justify-between">
               <span className="text-muted-foreground">Lease End</span>
               <span className="text-amber-600 dark:text-amber-500 font-medium">{MOCK_TENANT.leaseEndDate}</span>
             </div>
           </div>

           <div className="grid grid-cols-2 gap-2 pt-2">
             <button className="flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-card border rounded-md text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
               <MessageSquare size={14} /> Message
             </button>
             <button 
               onClick={() => navigate(`/app/tenants/${MOCK_TENANT.id}`)}
               className="flex items-center justify-center gap-2 py-2 px-3 bg-white dark:bg-card border rounded-md text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
             >
               <UserPlus size={14} /> Profile
             </button>
           </div>
        </div>
      </div>
      
      <div className="bg-card border rounded-xl overflow-hidden shadow-sm p-6">
        <h3 className="font-semibold mb-4">Financial Snapshot</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Current Rent</span>
            <span className="font-bold">${MOCK_UNIT.metrics.rent}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Market Rent</span>
            <span className="text-muted-foreground line-through decoration-slate-400/50">${MOCK_UNIT.marketRent}</span>
          </div>
           <div className="w-full h-px bg-border my-2" />
           <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Current Balance</span>
            <span className={cn("font-bold", MOCK_UNIT.metrics.balance > 0 ? "text-rose-500" : "text-emerald-600")}>
              ${MOCK_UNIT.metrics.balance}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const LeaseTab = () => (
  <div className="bg-card border rounded-xl overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-200">
    <div className="p-6 border-b">
      <div className="flex justify-between items-start">
        <div>
           <h3 className="font-semibold text-lg">Active Lease Agreement</h3>
           <p className="text-sm text-muted-foreground">Aug 1, 2023 — July 31, 2024</p>
        </div>
        <button className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
          <Download size={14} /> Download PDF
        </button>
      </div>
    </div>
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Terms</h4>
        <div className="space-y-3">
          <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-sm text-gray-600 dark:text-gray-400">Monthly Rent</span>
            <span className="font-medium">${MOCK_LEASE.rent}</span>
          </div>
           <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-sm text-gray-600 dark:text-gray-400">Security Deposit</span>
            <span className="font-medium">${MOCK_LEASE.deposit}</span>
          </div>
           <div className="flex justify-between py-2 border-b border-border/50">
            <span className="text-sm text-gray-600 dark:text-gray-400">Late Fee Policy</span>
            <span className="font-medium text-sm">{MOCK_LEASE.lateFee}</span>
          </div>
        </div>
      </div>
       <div className="space-y-4">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Clauses & Addendums</h4>
        <ul className="list-disc list-inside text-sm space-y-1 text-gray-700 dark:text-gray-300">
          {MOCK_LEASE.clauses.map((clause, i) => (
            <li key={i}>{clause}</li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

const MaintenanceTab = () => (
   <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
     <div className="flex justify-between items-center">
       <h3 className="font-semibold">Work Orders</h3>
       <button className="bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary/90 flex items-center gap-2">
         <Wrench size={16} /> New Ticket
       </button>
     </div>
     <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
       <table className="w-full text-sm text-left">
         <thead className="bg-slate-50 dark:bg-slate-900 border-b text-muted-foreground font-medium">
           <tr>
             <th className="px-4 py-3">ID</th>
             <th className="px-4 py-3">Issue</th>
             <th className="px-4 py-3">Category</th>
             <th className="px-4 py-3">Status</th>
             <th className="px-4 py-3">Date</th>
             <th className="px-4 py-3"></th>
           </tr>
         </thead>
         <tbody>
           {MOCK_MAINTENANCE.map(ticket => (
             <tr key={ticket.id} className="border-b last:border-0 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
               <td className="px-4 py-3 font-medium">#{ticket.id}</td>
               <td className="px-4 py-3">{ticket.title}</td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                    {ticket.category}
                  </span>
                </td>
               <td className="px-4 py-3">
                 <span className={cn(
                   "inline-flex items-center px-2 py-0.5 rounded-full text-xs capitalize font-medium",
                   ticket.status === 'open' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
                   "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                 )}>
                   {ticket.status}
                 </span>
               </td>
               <td className="px-4 py-3 text-muted-foreground">{ticket.date}</td>
               <td className="px-4 py-3 text-right">
                 <button className="text-primary hover:underline text-xs">View</button>
               </td>
             </tr>
           ))}
         </tbody>
       </table>
     </div>
   </div>
);

const FinancialsTab = () => (
  <div className="bg-card border rounded-xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
     <div className="px-6 py-4 border-b flex justify-between items-center">
       <h3 className="font-semibold">Rent Ledger</h3>
       <div className="flex gap-2">
         <button className="text-xs font-medium px-3 py-1.5 bg-slate-100 dark:bg-slate-800 rounded hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Generate Statement</button>
         <button className="text-xs font-medium px-3 py-1.5 bg-primary/10 text-primary rounded hover:bg-primary/20 transition-colors">Export CSV</button>
       </div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-900 border-b text-muted-foreground font-medium">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Description</th>
            <th className="px-6 py-3 text-right">Charges</th>
            <th className="px-6 py-3 text-right">Payments</th>
            <th className="px-6 py-3 text-right">Balance</th>
          </tr>
        </thead>
        <tbody>
           {/* Mock Ledger Rows */}
           <tr className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
            <td className="px-6 py-3">Jan 01, 2024</td>
            <td className="px-6 py-3">Rent Charge - Jan 2024</td>
            <td className="px-6 py-3 text-right font-medium">$1,600.00</td>
            <td className="px-6 py-3 text-right text-muted-foreground">—</td>
            <td className="px-6 py-3 text-right">$1,600.00</td>
          </tr>
          <tr className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
            <td className="px-6 py-3">Jan 01, 2024</td>
            <td className="px-6 py-3 text-emerald-600">Payment Received (CC ending 4242)</td>
            <td className="px-6 py-3 text-right text-muted-foreground">—</td>
            <td className="px-6 py-3 text-right font-medium text-emerald-600">($1,600.00)</td>
            <td className="px-6 py-3 text-right font-medium text-muted-foreground">$0.00</td>
          </tr>
           <tr className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
            <td className="px-6 py-3">Dec 01, 2023</td>
            <td className="px-6 py-3">Rent Charge - Dec 2023</td>
            <td className="px-6 py-3 text-right font-medium">$1,600.00</td>
            <td className="px-6 py-3 text-right text-muted-foreground">—</td>
            <td className="px-6 py-3 text-right">$1,600.00</td>
          </tr>
          <tr className="border-b hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
            <td className="px-6 py-3">Dec 02, 2023</td>
            <td className="px-6 py-3 text-emerald-600">Payment Received (CC ending 4242)</td>
            <td className="px-6 py-3 text-right text-muted-foreground">—</td>
            <td className="px-6 py-3 text-right font-medium text-emerald-600">($1,600.00)</td>
            <td className="px-6 py-3 text-right font-medium text-muted-foreground">$0.00</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
);

const DocumentsTab = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
    <div className="col-span-full flex justify-end mb-2">
      <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-card border rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
        <UploadCloud size={16} /> Upload Document
      </button>
    </div>
    {MOCK_DOCUMENTS.map(doc => (
      <div key={doc.id} className="group p-4 bg-card border rounded-xl flex items-start gap-4 hover:border-primary/50 transition-colors cursor-pointer relative overflow-hidden">
        <div className="p-3 bg-primary/10 rounded-lg text-primary shrink-0">
          <FileText size={20} />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate pr-4">{doc.name}</h4>
          <p className="text-xs text-muted-foreground mt-1 capitalize">{doc.type} • {doc.date}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{doc.size}</p>
        </div>
         <div className="opacity-0 group-hover:opacity-100 absolute top-4 right-4 transition-opacity">
           <button className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-muted-foreground hover:text-primary">
             <Download size={16} />
           </button>
         </div>
      </div>
    ))}
  </div>
);

const ActivityTab = () => (
   <div className="max-w-2xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
     <div className="relative pl-6 border-l border-border space-y-8">
       {MOCK_ACTIVITY.map((item, i) => (
         <div key={item.id} className="relative">
           <span className={cn(
             "absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-background",
             item.type === 'payment' ? "bg-emerald-500" :
             item.type === 'maintenance' ? "bg-amber-500" :
             "bg-blue-500"
           )} />
           <div className="flex flex-col gap-1">
             <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{item.date}</span>
             <h4 className="text-sm font-medium">{item.title}</h4>
             {item.amount && <span className="text-sm font-bold text-emerald-600">{item.amount}</span>}
             {item.note && <p className="text-sm text-muted-foreground">{item.note}</p>}
             {item.user && <p className="text-xs text-muted-foreground">by {item.user}</p>}
           </div>
         </div>
       ))}
     </div>
   </div>
);

// --- Main Page Component ---

export default function UnitDetailsPage() {
  const { propertyId, unitId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Breadcrumbs logic mock
  const propertyName = MOCK_UNIT.propertyName; 

  const renderContent = () => {
    switch(activeTab) {
      case 'overview': return <OverviewTab navigate={navigate} />;
      case 'tenant': return <OverviewTab navigate={navigate} />; // Tenant info is in Overview for now
      case 'lease': return <LeaseTab />;
      case 'maintenance': return <MaintenanceTab />;
      case 'financials': return <FinancialsTab />;
      case 'documents': return <DocumentsTab />;
      case 'activity': return <ActivityTab />;
      default: return <div className="p-8 text-center text-muted-foreground">Content not found.</div>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Header & Breadcrumb */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hover:text-foreground cursor-pointer" onClick={() => navigate('/app/properties')}>Properties</span>
          <span>/</span>
          <span className="hover:text-foreground cursor-pointer" onClick={() => navigate(`/app/properties/${propertyId}`)}>{propertyName}</span>
          <span>/</span>
          <span className="text-foreground font-medium">Unit {MOCK_UNIT.unitNumber}</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
             <div className="p-3 bg-primary/10 rounded-xl text-primary mt-1">
               <Home size={24} />
             </div>
             <div>
               <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                 Unit {MOCK_UNIT.unitNumber}
                 <span className={cn(
                   "text-sm font-medium px-2.5 py-0.5 rounded-full border align-middle",
                   MOCK_UNIT.status === 'occupied' ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800" :
                   MOCK_UNIT.status === 'vacant' ? "bg-slate-100 text-slate-700 border-slate-200" :
                   "bg-amber-50 text-amber-700 border-amber-200"
                 )}>
                   {MOCK_UNIT.status.charAt(0).toUpperCase() + MOCK_UNIT.status.slice(1)}
                 </span>
               </h1>
               <div className="flex items-center gap-3 text-muted-foreground mt-1">
                 <span className="flex items-center gap-1"><Bed size={16} /> {MOCK_UNIT.type}</span>
                 <span className="w-1 h-1 rounded-full bg-border" />
                 <span>{MOCK_UNIT.sqft} sqft</span>
                 <span className="w-1 h-1 rounded-full bg-border" />
                  <span>Floor {MOCK_UNIT.floor}</span>
               </div>
             </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-card border rounded-lg text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
              <Edit size={16} className="text-muted-foreground" /> Edit Unit
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm">
              <DollarSign size={16} /> Collect Rent
            </button>
            <button className="p-2 text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard label="Occupancy" value="Occupied" subtext="Since Aug 2023" icon={UserPlus} />
        <KPICard label="Monthly Rent" value={`$${MOCK_UNIT.metrics.rent}`} subtext="Market: $1,650" icon={DollarSign} />
        <KPICard label="Balance" value={`$${MOCK_UNIT.metrics.balance}`} subtext="Paid in full" icon={CreditCard} alert={MOCK_UNIT.metrics.balance > 0} />
        <KPICard label="Lease" value="Active" subtext="Ends Jul 2024" icon={FileText} />
        <KPICard label="Maintenance" value={MOCK_UNIT.metrics.maintenanceCount} subtext="Open Tickets" icon={Wrench} alert={MOCK_UNIT.metrics.urgentMaintenance} />
      </div>

      {/* 3. Tabs */}
      <div className="border-b flex gap-2 overflow-x-auto">
        <TabButton active={activeTab === 'overview'} label="Overview" onClick={() => setActiveTab('overview')} icon={Home} />
        <TabButton active={activeTab === 'lease'} label="Lease" onClick={() => setActiveTab('lease')} icon={FileText} />
        <TabButton active={activeTab === 'financials'} label="Financials" onClick={() => setActiveTab('financials')} icon={DollarSign} />
        <TabButton active={activeTab === 'maintenance'} label="Maintenance" onClick={() => setActiveTab('maintenance')} icon={Wrench} />
        <TabButton active={activeTab === 'documents'} label="Documents" onClick={() => setActiveTab('documents')} icon={Download} />
        <TabButton active={activeTab === 'activity'} label="Activity" onClick={() => setActiveTab('activity')} icon={Activity} />
      </div>

      {/* 4. Tab Content */}
      <div className="min-h-[400px]">
        {renderContent()}
      </div>

    </div>
  );
}
