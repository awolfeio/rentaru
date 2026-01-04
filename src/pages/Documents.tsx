
import { useState } from 'react';
import { 
  Search, 
  Filter, 
  Upload, 
  ChevronRight,
  FileText,
  FileCode,
  FileImage,
  Download,
  Eye,
  Trash2,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types ---

type DocumentType = 'lease' | 'notice' | 'report' | 'invoice' | 'other';
type DocumentStatus = 'signed' | 'unsigned' | 'expired' | 'draft';
type RelatedEntityType = 'property' | 'unit' | 'tenant' | 'lease';

interface DocRecord {
  id: string;
  name: string;
  type: DocumentType;
  status: DocumentStatus;
  relatedEntityType: RelatedEntityType;
  relatedEntityName: string;
  size: string;
  uploadedAt: string;
  signedAt?: string;
  uploadedBy: string;
}

// --- Mock Data ---

const MOCK_DOCS: DocRecord[] = [
  {
    id: 'd1',
    name: 'Lease Agreement - Jane Smith.pdf',
    type: 'lease',
    status: 'signed',
    relatedEntityType: 'lease',
    relatedEntityName: 'Jane Smith - Unit 3B',
    size: '2.4 MB',
    uploadedAt: '2023-12-15',
    signedAt: '2023-12-20',
    uploadedBy: 'System'
  },
  {
    id: 'd2',
    name: 'Move-in Inspection - Unit 102.jpg',
    type: 'report',
    status: 'draft',
    relatedEntityType: 'unit',
    relatedEntityName: 'Highland Lofts - 102',
    size: '4.1 MB',
    uploadedAt: '2024-01-02',
    uploadedBy: 'Mike Ross (Tenant)'
  },
  {
    id: 'd3',
    name: 'Notice to Enter - Unit A.pdf',
    type: 'notice',
    status: 'unsigned',
    relatedEntityType: 'tenant',
    relatedEntityName: 'David Wilson',
    size: '145 KB',
    uploadedAt: '2024-01-04',
    uploadedBy: 'Property Manager'
  },
  {
    id: 'd4',
    name: 'Plumbing Invoice #4492.pdf',
    type: 'invoice',
    status: 'signed',
    relatedEntityType: 'property',
    relatedEntityName: 'Oak Street Apartments',
    size: '88 KB',
    uploadedAt: '2023-12-28',
    uploadedBy: 'Rapid Plumbers Co.'
  }
];

// --- Components ---

const StatusIndicator = ({ status }: { status: DocumentStatus }) => {
    const configs = {
        signed: { icon: CheckCircle, color: 'text-emerald-500', label: 'Signed' },
        unsigned: { icon: Clock, color: 'text-amber-500', label: 'Pending' },
        expired: { icon: AlertCircle, color: 'text-rose-500', label: 'Expired' },
        draft: { icon: FileText, color: 'text-slate-400', label: 'Draft' }
    };

    const Config = configs[status];
    return (
        <div className="flex items-center gap-1.5" title={Config.label}>
             <Config.icon size={14} className={Config.color} />
             <span className={cn("text-xs font-medium hidden md:inline-block", Config.color)}>{Config.label}</span>
        </div>
    );
};

const FileIcon = ({ type }: { type: DocumentType }) => {
    switch (type) {
        case 'lease': return <FileText className="text-blue-500" size={20} />;
        case 'notice': return <AlertCircle className="text-amber-500" size={20} />;
        case 'report': return <FileCode className="text-slate-500" size={20} />; // Placeholder
        case 'invoice': return <FileText className="text-emerald-500" size={20} />;
        case 'other': return <FileImage className="text-purple-500" size={20} />;
        default: return <FileText className="text-slate-500" size={20} />;
    }
}

const DocumentRow = ({ doc }: { doc: DocRecord }) => {
  const [expanded, setExpanded] = useState(false);

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
        {/* Document Identity */}
        <div className="col-span-6 md:col-span-5 flex items-center gap-3 overflow-hidden">
            <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg shrink-0">
                <FileIcon type={doc.type} />
            </div>
            <div className="truncate">
                <div className="font-medium text-sm text-foreground truncate" title={doc.name}>{doc.name}</div>
                <div className="text-xs text-muted-foreground truncate">{doc.relatedEntityName}</div>
            </div>
        </div>

        {/* Type - Desktop Only */}
        <div className="hidden md:flex col-span-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {doc.type}
        </div>

        {/* Status */}
        <div className="col-span-3 md:col-span-2">
            <StatusIndicator status={doc.status} />
        </div>

        {/* Date - Desktop Only */}
        <div className="hidden md:flex col-span-2 text-sm text-muted-foreground">
            {doc.uploadedAt}
        </div>

         {/* Actions/Chevron */}
         <div className="col-span-3 md:col-span-1 flex justify-end items-center gap-2">
            <button className="p-1.5 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-md transition-colors text-muted-foreground hidden group-hover:block" title="Download">
                <Download size={16} />
            </button>
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
                <div className="p-4 pl-[4.5rem] grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                    
                    {/* Metadata Column */}
                    <div className="space-y-4">
                         <div className="grid grid-cols-3 gap-y-2">
                             <div className="col-span-3 font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">Details</div>
                             
                             <span className="text-muted-foreground">Size</span>
                             <div className="col-span-2 font-medium">{doc.size}</div>

                             <span className="text-muted-foreground">Uploaded By</span>
                             <div className="col-span-2 font-medium">{doc.uploadedBy}</div>

                             <span className="text-muted-foreground">Upload Date</span>
                             <div className="col-span-2 font-medium">{doc.uploadedAt}</div>

                             {doc.signedAt && (
                                <>
                                    <span className="text-muted-foreground">Signed Date</span>
                                    <div className="col-span-2 font-medium text-emerald-600 dark:text-emerald-500">{doc.signedAt}</div>
                                </>
                             )}
                         </div>
                    </div>

                    {/* Actions Column */}
                    <div className="space-y-4">
                        <div className="font-semibold text-xs uppercase tracking-wider text-muted-foreground mb-1">Actions</div>
                        <div className="flex flex-wrap gap-2">
                             <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors bg-card shadow-sm">
                                 <Eye size={14} /> View
                             </button>
                             <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border rounded-md hover:bg-white dark:hover:bg-slate-800 transition-colors bg-card shadow-sm">
                                 <Download size={14} /> Download
                             </button>
                             <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium border border-rose-200 text-rose-600 rounded-md hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors bg-card shadow-sm ml-auto">
                                 <Trash2 size={14} /> Archive
                             </button>
                        </div>
                    </div>

                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function DocumentsPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Documents</h1>
          <p className="text-muted-foreground">Leases, notices, and property files.</p>
        </div>
        <div className="flex items-center gap-2">
           <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm shadow-sm">
             <Upload size={16} />
             Upload Document
           </button>
        </div>
      </div>

       {/* Controls */}
       <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm w-full">
         <Search className="text-muted-foreground ml-2" size={18} />
         <input 
            type="text" 
            placeholder="Search by name, tenant, or property..." 
            className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground outline-none"
         />
         <div className="w-px h-6 bg-border mx-2" />
         <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            <Filter size={14} />
            Filters
         </button>
      </div>

      {/* Document List */}
      <div className="border rounded-xl bg-card shadow-sm overflow-hidden min-h-[400px]">
        <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50/50 dark:bg-slate-800/50 border-b text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <div className="col-span-6 md:col-span-5">Name</div>
            <div className="hidden md:block col-span-2">Type</div>
            <div className="col-span-3 md:col-span-2">Status</div>
            <div className="hidden md:block col-span-2">Uploaded</div>
            <div className="col-span-3 md:col-span-1"></div>
        </div>
        <div className="divide-y divide-border/50">
            {MOCK_DOCS.map(doc => (
                <DocumentRow key={doc.id} doc={doc} />
            ))}
        </div>
      </div>

    </div>
  );
}
