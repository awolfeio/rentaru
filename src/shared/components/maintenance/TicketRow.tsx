import React, { useState } from 'react';
import { Wrench, AlertOctagon, Clock, User, Briefcase, AlertTriangle, MessageSquare, CheckCircle, Check, X, Droplets, Flame, Zap, Package, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MaintenanceTicket, TicketStatus, UrgencyLevel, TicketCategory } from '@/shared/types/maintenance';

export const UrgencyBadge = ({ level }: { level: UrgencyLevel }) => {
  const styles = {
    routine: 'bg-slate-100/50 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200/50 dark:border-slate-700/50',
    medium: 'bg-blue-100/50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200/50 dark:border-blue-500/20',
    high: 'bg-amber-100/50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200/50 dark:border-amber-500/20',
    emergency: 'bg-rose-100/50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200/50 dark:border-rose-500/20'
  };

  const icons = {
    routine: null,
    medium: <Clock size={10} className="mr-1" />,
    high: <AlertTriangle size={10} className="mr-1" />,
    emergency: <AlertOctagon size={10} className="mr-1" />
  };

  return (
    <span className={cn("inline-flex items-center text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border tracking-wide", styles[level])}>
      {icons[level]} {level}
    </span>
  );
};

export const StatusBadge = ({ status }: { status: TicketStatus }) => {
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

// --- Category metadata (shared between row icon + expanded view) ---

const CATEGORY_META: Record<string, { label: string; icon: React.ReactElement; bgColor: string; textColor: string }> = {
  plumbing:   { label: 'Plumbing',   icon: <Droplets size={20} />, bgColor: 'bg-blue-100 dark:bg-blue-900/20',   textColor: 'text-blue-600 dark:text-blue-400' },
  hvac:       { label: 'HVAC',        icon: <Flame size={20} />,    bgColor: 'bg-orange-100 dark:bg-orange-900/20', textColor: 'text-orange-500 dark:text-orange-400' },
  electrical: { label: 'Electrical',  icon: <Zap size={20} />,      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20', textColor: 'text-yellow-600 dark:text-yellow-400' },
  appliance:  { label: 'Appliance',   icon: <Package size={20} />,  bgColor: 'bg-violet-100 dark:bg-violet-900/20', textColor: 'text-violet-500 dark:text-violet-400' },
  general:    { label: 'General',     icon: <Wrench size={20} />,   bgColor: 'bg-slate-100 dark:bg-slate-800',     textColor: 'text-slate-500 dark:text-slate-400' },
};

const CATEGORY_BADGE_COLOR: Record<string, string> = {
  plumbing:   'text-blue-500 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400',
  hvac:       'text-orange-500 bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800 dark:text-orange-400',
  electrical: 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400',
  appliance:  'text-violet-500 bg-violet-50 border-violet-200 dark:bg-violet-900/20 dark:border-violet-800 dark:text-violet-400',
  general:    'text-slate-500 bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400',
};

export const TicketRow = ({ ticket }: { ticket: MaintenanceTicket }) => {
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
              CATEGORY_META[ticket.categoryId]?.bgColor   ?? 'bg-slate-100 dark:bg-slate-800',
              CATEGORY_META[ticket.categoryId]?.textColor ?? 'text-slate-500 dark:text-slate-400'
            )}>
              {React.cloneElement(CATEGORY_META[ticket.categoryId]?.icon ?? <Wrench size={20} />, { size: 20 })}
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

                  {/* Type */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Type</h4>
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold',
                      CATEGORY_BADGE_COLOR[ticket.categoryId] ?? 'text-slate-500 bg-slate-100 border-slate-200'
                    )}>
                      {React.cloneElement(CATEGORY_META[ticket.categoryId]?.icon ?? <Wrench size={14} />, { size: 14 })}
                      {CATEGORY_META[ticket.categoryId]?.label ?? ticket.categoryId}
                    </span>
                  </div>

                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</h4>
                  <p className="text-sm text-foreground leading-relaxed">{ticket.description}</p>

                  {/* Access Row */}
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground pt-1">Access</h4>
                  <div className="flex flex-wrap gap-2">
                    {/* Entry Permission Chip */}
                    <div className={cn(
                      "inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium",
                      ticket.accessPermission
                        ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400"
                        : "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400"
                    )}>
                      <span className={cn(
                        "flex items-center justify-center w-4 h-4 rounded-full text-white shrink-0",
                        ticket.accessPermission ? "bg-emerald-500" : "bg-amber-500"
                      )}>
                        {ticket.accessPermission ? <Check size={10} strokeWidth={3} /> : <X size={10} strokeWidth={3} />}
                      </span>
                      {ticket.accessPermission ? "Key/code access granted" : "Tenant must be present"}
                    </div>

                    {/* Time Window Chip */}
                    {ticket.preferredTime && (
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-800/50 dark:border-slate-700 dark:text-slate-400">
                        <Clock size={12} className="text-slate-400 shrink-0" />
                        {{
                          morning: 'Morning preferred (8am–12pm)',
                          afternoon: 'Afternoon preferred (12pm–5pm)',
                          evening: 'Evening preferred (5pm–8pm)',
                          anytime: 'Anytime — no time restriction',
                        }[ticket.preferredTime]}
                      </div>
                    )}
                  </div>
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