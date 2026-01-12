
import { useState } from 'react';
import {
  Wrench,
  Search,
  Filter,
  Plus,
  ChevronDown,
  AlertOctagon,
  Clock,
  User,
  Briefcase,
  AlertTriangle,
  MessageSquare,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MaintenanceTicket, TicketStatus, UrgencyLevel } from '@/shared/types/maintenance';
import { MOCK_TICKETS } from '@/shared/mockData/maintenance';
import { CreateMaintenanceTicketModal } from '@/shared/components/maintenance/CreateTicketModal';

// --- Components ---

const UrgencyBadge = ({ level }: { level: UrgencyLevel }) => {
  const styles = {
    routine: 'bg-slate-100/50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50',
    urgent: 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20',
    emergency: 'bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20'
  };

  const icons = {
    routine: null,
    urgent: <AlertTriangle size={10} className="mr-1" />,
    emergency: <AlertOctagon size={10} className="mr-1" />
  };

  return (
    <span className={cn("inline-flex items-center text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide", styles[level])}>
      {icons[level]} {level}
    </span>
  );
};

const StatusBadge = ({ status }: { status: TicketStatus }) => {
  // Map internal status to display labels
  const labels: Record<TicketStatus, string> = {
    open: 'Open',
    in_progress: 'In Progress',
    waiting: 'Waiting',
    resolved: 'Resolved',
    closed: 'Closed'
  };

  const colors: Record<TicketStatus, string> = {
    open: 'text-rose-600 bg-rose-50 border-rose-100 dark:bg-rose-900/10 dark:text-rose-400 dark:border-rose-900/20',
    in_progress: 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-900/10 dark:text-blue-400 dark:border-blue-900/20',
    waiting: 'text-amber-600 bg-amber-50 border-amber-100 dark:bg-amber-900/10 dark:text-amber-400 dark:border-amber-900/20',
    resolved: 'text-emerald-600 bg-emerald-50 border-emerald-100 dark:bg-emerald-900/10 dark:text-emerald-400 dark:border-emerald-900/20',
    closed: 'text-slate-600 bg-slate-50 border-slate-100 dark:bg-slate-900/10 dark:text-slate-400 dark:border-slate-900/20'
  };

  return (
    <span className={cn("text-xs font-medium px-2 py-1 rounded-md border", colors[status])}>
      {labels[status]}
    </span>
  );
}

const TicketRow = ({ ticket }: { ticket: MaintenanceTicket }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={cn(
      "group border rounded-xl bg-card transition-all duration-200",
      expanded ? "shadow-md ring-1 ring-primary/5 border-primary/20" : "hover:border-primary/20 hover:shadow-sm"
    )}>
      {/* Primary Row Content */}
      <div
        className="p-4 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Issue & Context */}
        <div className="flex-1 min-w-[250px]">
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2 rounded-lg mt-0.5",
              ticket.urgency === 'emergency' ? "bg-rose-100 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400" : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            )}>
              <Wrench size={20} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground leading-tight mb-1">{ticket.title}</h3>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                <span>{ticket.propertyName}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span>Unit {ticket.unitNumber}</span>
                <span className="w-1 h-1 rounded-full bg-border" />
                <span className="text-xs">Rep. by {ticket.reportedBy}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Grid */}
        <div className="flex-1 grid grid-cols-2 md:grid-cols-3 gap-4 items-center">

          {/* Urgency */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">Priority</div>
            <UrgencyBadge level={ticket.urgency} />
          </div>

          {/* Status */}
          <div>
            <div className="text-xs text-muted-foreground mb-1">Status</div>
            <StatusBadge status={ticket.status} />
          </div>

          {/* Vendor/Cost */}
          <div className="hidden md:block">
            <div className="text-xs text-muted-foreground mb-1">Assigned</div>
            <div className="text-sm font-medium flex items-center gap-1.5 truncate">
              {ticket.vendorName ? (
                <>
                  <Briefcase size={12} className="text-muted-foreground" /> {ticket.vendorName}
                </>
              ) : (
                <span className="text-muted-foreground italic text-xs">Unassigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions & Chevron */}
        <div className="flex items-center gap-3 justify-end min-w-[50px]">
          {ticket.estimatedCost && (
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-2 py-1 rounded">
              ${ticket.estimatedCost}
            </div>
          )}
          <div className={cn("transition-transform duration-200 text-muted-foreground", expanded && "rotate-180")}>
            <ChevronDown size={20} />
          </div>
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
            className="overflow-hidden border-t border-border/50 bg-slate-50/50 dark:bg-slate-900/20"
          >
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">

              {/* Full Description & Timeline */}
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</h4>
                  <p className="text-sm text-foreground leading-relaxed">{ticket.description}</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-border/50">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Clock size={14} /> Activity
                  </h4>
                  <div className="text-sm space-y-3 pl-2 border-l-2 border-border/50">
                    <div className="pl-4 relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="text-muted-foreground text-xs">{ticket.updatedAt}</span>
                      <p className="mt-0.5">Status updated to <span className="font-medium text-foreground">{ticket.status.replace('_', ' ')}</span></p>
                    </div>
                    <div className="pl-4 relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-700" />
                      <span className="text-muted-foreground text-xs">{ticket.createdAt}</span>
                      <p className="mt-0.5">Ticket created by {ticket.reportedBy}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions & Meta */}
              <div className="space-y-6">
                {/* Cost Block */}
                <div className="p-3 bg-card border rounded-md space-y-2">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Financial</h4>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Estimated</span>
                    <span className="font-medium">${ticket.estimatedCost || 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Actual</span>
                    <span className="font-medium">${ticket.actualCost || 0}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md hover:bg-primary/90 transition-colors shadow-sm justify-center">
                    <User size={14} /> Assign Vendor
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-foreground bg-white dark:bg-card border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm justify-center">
                    <MessageSquare size={14} className="text-muted-foreground" /> Add Note
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-2 text-sm font-medium text-emerald-600 bg-emerald-50 border border-emerald-100 rounded-md hover:bg-emerald-100 transition-colors shadow-sm justify-center">
                    <CheckCircle size={14} /> Resolve Ticket
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

export default function MaintenancePage() {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(MOCK_TICKETS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // TODO: In a real app, this would send to API
  const handleCreateTicket = (newTicketPart: Partial<MaintenanceTicket>) => {
      const ticket: MaintenanceTicket = {
          ...newTicketPart as MaintenanceTicket, // Asserting for mock purposes
          id: `m${Date.now()}`,
      };
      setTickets(prev => [ticket, ...prev]);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Maintenance</h1>
          <p className="text-muted-foreground">Triage and track property issues.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-rose-600 text-white hover:bg-rose-700 transition-colors font-medium text-sm shadow-sm"
          >
            <Plus size={16} />
            New Ticket
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 bg-card p-2 rounded-lg border shadow-sm w-full">
        <Search className="text-muted-foreground ml-2" size={18} />
        <input
          type="text"
          placeholder="Search issues, units, or vendors..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-sm placeholder:text-muted-foreground outline-none"
        />
        <div className="w-px h-6 bg-border mx-2" />
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          <Filter size={14} />
          Filters
        </button>
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {tickets.map(t => (
          <TicketRow key={t.id} ticket={t} />
        ))}
      </div>

      {/* Modal */}
      <CreateMaintenanceTicketModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        onCreate={handleCreateTicket}
        userRole="manager" // Default to manager for now as per instructions
      />

    </div>
  );
}
