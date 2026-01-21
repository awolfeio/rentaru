import { useState, useMemo } from 'react';
import { 
  Wrench, 
  Plus, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  ChevronRight, 
  X,
  Image as ImageIcon,
  Send,
  ArrowLeft,
  UploadCloud,
  Home,
  Check,
  Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, formatDistanceToNow } from 'date-fns';
import { cn } from '@/shared/lib/utils';
import { 
  MaintenanceRequest, 
  MaintenanceStatus, 
  MaintenancePriority, 
  MaintenanceCategory,
  MaintenanceMessage
} from '@/shared/types/maintenance';
import { MOCK_TENANT_REQUESTS } from '@/shared/mockData/tenantMaintenance';
import { CreateRequestWizard, WizardFormData } from '@/tenant/components/maintenance/CreateRequestWizard';
import { useToast } from '@/shared/components/ui/Toast';
import { Lightbox } from '@/shared/components/ui/Lightbox';

// --- CONFIG & STYLES ---

const STATUS_STYLES: Record<MaintenanceStatus, string> = {
  submitted: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  reviewing: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
  scheduled: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
  closed: "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
};

const PRIORITY_STYLES: Record<MaintenancePriority, string> = {
  emergency: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
  high: "bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  normal: "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
};

const CATEGORY_ICONS: Record<MaintenanceCategory, any> = {
  plumbing: Wrench,
  electrical: Wrench,
  hvac: Wrench,
  appliance: Wrench,
  structural: Home,
  pest: Wrench,
  safety: Shield,
  other: Wrench,
};

// --- COMPONENTS ---

// 1. Tag Component
const StatusBadge = ({ status }: { status: MaintenanceStatus }) => (
  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize", STATUS_STYLES[status])}>
    {status.replace('_', ' ')}
  </span>
);

const PriorityBadge = ({ priority }: { priority: MaintenancePriority }) => (
  <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize flex items-center gap-1", PRIORITY_STYLES[priority])}>
    {priority === 'emergency' && <AlertTriangle size={10} />}
    {priority}
  </span>
);

// 2. Request Card
const RequestCard = ({ request, onClick }: { request: MaintenanceRequest; onClick: () => void }) => {
  const Icon = CATEGORY_ICONS[request.category] || Wrench;
  const isEmergency = request.priority === 'emergency';
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "group relative p-4 bg-card border rounded-xl hover:border-primary/50 hover:shadow-md transition-all cursor-pointer overflow-hidden",
        isEmergency && "border-rose-200 bg-rose-50/10 dark:border-rose-900/30"
      )}
    >
      {isEmergency && <div className="absolute top-0 left-0 w-1 h-full bg-rose-500" />}
      
      <div className="flex justify-between items-start mb-3 pl-2">
        <div className="flex items-center gap-3">
          <div className={cn("p-2 rounded-lg bg-slate-100 dark:bg-slate-800", isEmergency && "bg-rose-100 dark:bg-rose-900/20 text-rose-600")}>
            <Icon size={20} className="text-muted-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{request.title}</h3>
            <span className="text-xs text-muted-foreground capitalize">{request.category}</span>
          </div>
        </div>
        <StatusBadge status={request.status} />
      </div>

      <p className="text-sm text-muted-foreground line-clamp-2 pl-2 mb-4">
        {request.description}
      </p>

      <div className="flex items-center justify-between text-xs text-muted-foreground pl-2 border-t pt-3">
        <div className="flex items-center gap-4">
           {request.priority !== 'normal' && <PriorityBadge priority={request.priority} />}
           <span className="flex items-center gap-1">
             <Clock size={12} />
             Updated {formatDistanceToNow(new Date(request.updatedAt))} ago
           </span>
        </div>
        <div className="flex items-center gap-1">
          {request.messages.length > 0 && (
            <span className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
              <MessageSquare size={12} /> {request.messages.length}
            </span>
          )}
          <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -mr-1" />
        </div>
      </div>
    </div>
  );
};

// 3. Detail Drawer
const DetailDrawer = ({ request, onClose }: { request: MaintenanceRequest | null; onClose: () => void }) => {
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  return (
    <AnimatePresence>
      {request && (
        <>
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[1px]"
          />
          {/* Drawer */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-2xl bg-background border-l shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b flex justify-between items-center flex-shrink-0 bg-slate-50/50 dark:bg-slate-900/50">
              <div className="flex items-center gap-3">
                 <button onClick={onClose} className="p-2 -ml-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                   <ArrowLeft size={20} className="text-muted-foreground" />
                 </button>
                 <div>
                   <div className="flex items-center gap-2">
                     <span className="text-xs text-muted-foreground font-mono">#{request.id}</span>
                     <span className="text-xs text-muted-foreground">•</span>
                     <span className="text-xs text-muted-foreground">{format(new Date(request.createdAt), 'MMM d, yyyy')}</span>
                   </div>
                   <h2 className="font-semibold text-lg line-clamp-1">{request.title}</h2>
                 </div>
              </div>
              <div className="flex items-center gap-3">
                 <PriorityBadge priority={request.priority} />
                 <StatusBadge status={request.status} />
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              
              {/* Description */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Issue Details</h3>
                <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border text-sm leading-relaxed">
                  {request.description}
                </div>
              </section>

              {/* Photos/Attachments */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
                  Attachments
                  <span className="text-xs font-normal bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-muted-foreground">{request.attachments.length}</span>
                </h3>
                {request.attachments.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {request.attachments.map(att => (
                      <div 
                        key={att.id} 
                        onClick={() => att.type === 'image' && setLightboxImg(att.url)}
                        className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-lg border overflow-hidden relative group cursor-pointer"
                      >
                        {att.type === 'image' ? (
                          <img src={att.url} alt="Attachment" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">Video</div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground gap-2 bg-slate-50/50">
                    <ImageIcon size={24} className="opacity-50" />
                    <span className="text-sm">No photos attached</span>
                  </div>
                )}
              </section>

              {/* Access Info */}
              <section className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Access & Logistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border flex items-center gap-3">
                     <div className={cn("p-2 rounded-full", request.allowEntryWithoutTenant ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500")}>
                        {request.allowEntryWithoutTenant ? <Check size={16} /> : <X size={16} />}
                     </div>
                     <div>
                       <div className="text-sm font-medium">Entry Permission</div>
                       <div className="text-xs text-muted-foreground">{request.allowEntryWithoutTenant ? "Granted (Key/Code)" : "Tenant must be present"}</div>
                     </div>
                  </div>
                  <div className="p-4 rounded-xl border flex items-center gap-3">
                     <div className={cn("p-2 rounded-full bg-slate-100 text-slate-500")}>
                        <Clock size={16} />
                     </div>
                     <div>
                       <div className="text-sm font-medium">Timing</div>
                       <div className="text-xs text-muted-foreground">{request.preferredAccessTimes || "Anytime"}</div>
                     </div>
                  </div>
                </div>
              </section>

              {/* Timeline / Chat */}
              <section className="space-y-4 pt-4 border-t">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Activity & Messages</h3>
                <div className="space-y-6">
                  {request.messages.map((msg: MaintenanceMessage) => (
                    <div key={msg.id} className={cn("flex gap-3", msg.senderType === 'tenant' ? "flex-row-reverse" : "flex-row")}>
                       <div className={cn(
                         "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                         msg.senderType === 'tenant' ? "bg-primary text-primary-foreground" : 
                         msg.senderType === 'system' ? "bg-slate-200 text-slate-600" :
                         "bg-amber-100 text-amber-700" 
                       )}>
                         {msg.senderType === 'tenant' ? 'ME' : msg.senderType === 'system' ? 'SYS' : 'MGR'}
                       </div>
                       <div className={cn(
                         "max-w-[80%] rounded-2xl px-4 py-3 text-sm",
                         msg.senderType === 'tenant' ? "bg-primary text-primary-foreground rounded-tr-none" : 
                         msg.senderType === 'system' ? "bg-slate-100 text-slate-600 w-full text-center italic text-xs rounded-xl" :
                         "bg-white border rounded-tl-none shadow-sm"
                       )}>
                         {msg.message}
                         <div className={cn("text-[10px] mt-1 opacity-70", msg.senderType === 'system' && "justify-center flex")}>
                           {format(new Date(msg.createdAt), 'h:mm a')}
                         </div>
                       </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* Message Input */}
            <div className="p-4 border-t bg-slate-50 dark:bg-slate-900/50 flex-shrink-0">
               <div className="flex gap-2">
                 <button className="p-2.5 text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors">
                    <UploadCloud size={20} />
                 </button>
                 <input 
                   type="text" 
                   placeholder="Type a message..." 
                   className="flex-1 bg-background border rounded-lg px-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                 />
                 <button className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
                    <Send size={18} />
                 </button>
               </div>
            </div>
          </motion.div>
          
          <Lightbox 
            isOpen={!!lightboxImg} 
            onClose={() => setLightboxImg(null)} 
            src={lightboxImg || ''} 
          />
        </>
      )}
    </AnimatePresence>
  );
};

// --- MAIN PAGE ---

export default function TenantMaintenancePage() {
  const { toast } = useToast();
  const [requests, setRequests] = useState<MaintenanceRequest[]>(MOCK_TENANT_REQUESTS);
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'active' | 'closed'>('active');
  const [search, setSearch] = useState('');

  const filteredRequests = useMemo(() => {
    return requests
      .filter(r => {
        if (filter === 'active') return !['completed', 'closed'].includes(r.status);
        if (filter === 'closed') return ['completed', 'closed'].includes(r.status);
        return true;
      })
      .filter(r => r.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => {
        // Date Sort: Newest first
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [requests, filter, search]);

  const activeRequestCount = requests.filter(r => !['completed', 'closed'].includes(r.status)).length;

  const handleCreateSubmit = (data: WizardFormData) => {
    if (!data.category) return;
    
    // Create new mock request
    const newRequest: MaintenanceRequest = {
      id: `new_${Date.now()}`,
      unitId: 'unit_3b',
      tenantId: 'tenant_1',
      propertyId: 'prop_sunset',
      title: data.title,
      description: data.description,
      category: data.category!,
      priority: data.priority,
      status: 'submitted',
      allowEntryWithoutTenant: data.allowEntryWithoutTenant,
      preferredAccessTimes: data.preferredAccessTimes,
      petsPresent: data.petsPresent,
      
      // New fields
      locationContext: data.locationContext,
      issueType: data.issueType,
      subIssueDetail: data.subIssueDetail,
      applianceProvidedByProperty: data.applianceProvidedByProperty,

      attachments: [], // In a real app, these would be uploaded URLs
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    
    setRequests(prev => [newRequest, ...prev]);
    
    toast({
      type: 'success',
      title: 'Request Submitted',
      message: 'Your maintenance request has been submitted successfully.',
    });

    // Optionally open the new request details
    // setSelectedRequest(newRequest);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-4">
        <div>
           <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
             <Home size={14} />
             <span>Unit 3B • Sunset Apartments</span>
           </div>
           <h1 className="text-3xl font-bold tracking-tight text-foreground">Maintenance</h1>
           <p className="text-muted-foreground mt-1">Submit requests, track status, and chat with management.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="hidden md:flex items-center text-rose-600 bg-rose-50 hover:bg-rose-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <AlertTriangle size={16} className="mr-2" /> Emergency Info
          </button>
          <button 
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl font-medium shadow-sm hover:bg-primary/90 transition-all hover:scale-[1.02]"
          >
            <Plus size={18} strokeWidth={2.5} />
            Submit Request
          </button>
        </div>
      </div>

      {/* 2. Content Area */}
      {requests.length === 0 ? (
        // Empty State
        <div className="py-20 text-center space-y-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed">
          <div className="w-16 h-16 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 size={32} className="text-emerald-500" />
          </div>
          <div className="max-w-sm mx-auto">
            <h3 className="text-lg font-semibold">No issues currently</h3>
            <p className="text-muted-foreground">You don't have any active maintenance requests. Everything looks good!</p>
          </div>
          <button onClick={() => setIsCreateOpen(true)} className="text-primary font-medium hover:underline">
            Submit a new request
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* Controls */}
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg self-start">
              <button 
                onClick={() => setFilter('active')}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                  filter === 'active' ? "bg-white dark:bg-slate-700 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Active ({activeRequestCount})
              </button>
              <button 
                onClick={() => setFilter('closed')}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                  filter === 'closed' ? "bg-white dark:bg-slate-700 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                History
              </button>
              <button 
                onClick={() => setFilter('all')}
                className={cn(
                  "px-4 py-1.5 rounded-md text-sm font-medium transition-all",
                  filter === 'all' ? "bg-white dark:bg-slate-700 shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                All
              </button>
            </div>

            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search requests..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-card border rounded-lg text-sm w-full sm:w-64 focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Request Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
             {filteredRequests.map(req => (
               <RequestCard 
                 key={req.id} 
                 request={req} 
                 onClick={() => setSelectedRequest(req)} 
               />
             ))}
          </div>

          {filteredRequests.length === 0 && (
            <div className="py-12 text-center text-muted-foreground bg-slate-50 dark:bg-slate-900/30 rounded-xl border-2 border-dashed">
              No requests found matching your filters.
            </div>
          )}
        </div>
      )}

      {/* Drawers & Modals */}
      <DetailDrawer 
        request={selectedRequest} 
        onClose={() => setSelectedRequest(null)} 
      />
      
      <CreateRequestWizard 
        isOpen={isCreateOpen} 
        onClose={() => setIsCreateOpen(false)} 
        onSubmit={handleCreateSubmit}
      />

    </div>
  );
}
