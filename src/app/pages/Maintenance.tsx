
import React, { useState, useRef, useEffect } from 'react';
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
  CheckCircle,
  Check,
  X,
  Droplets,
  Flame,
  Zap,
  Package
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MaintenanceTicket, TicketStatus, UrgencyLevel, TicketCategory } from '@/shared/types/maintenance';
import { MOCK_TICKETS } from '@/shared/mockData/maintenance';
import { CreateMaintenanceTicketModal } from '@/shared/components/maintenance/CreateTicketModal';
import { FilterDropdown } from '@/shared/components/ui/FilterDropdown';

// --- Components ---

import { UrgencyBadge, StatusBadge, TicketRow } from '@/shared/components/maintenance/TicketRow';

const PRIORITY_OPTIONS: { value: UrgencyLevel; label: string }[] = [
  { value: 'emergency', label: 'Emergency' },
  { value: 'urgent',    label: 'Urgent' },
  { value: 'routine',   label: 'Routine' },
];

const STATUS_OPTIONS: { value: TicketStatus; label: string }[] = [
  { value: 'open',        label: 'Open' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'waiting',     label: 'Waiting' },
  { value: 'resolved',    label: 'Resolved' },
  { value: 'closed',      label: 'Closed' },
];

const CATEGORY_OPTIONS: { value: TicketCategory; label: string }[] = [
  { value: 'plumbing',   label: 'Plumbing' },
  { value: 'hvac',       label: 'HVAC' },
  { value: 'electrical', label: 'Electrical' },
  { value: 'appliance',  label: 'Appliance' },
  { value: 'general',    label: 'General' },
];

export default function MaintenancePage() {
  const [tickets, setTickets] = useState<MaintenanceTicket[]>(MOCK_TICKETS);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState<string[]>([]);
  const [statusFilter, setStatusFilter]     = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);

  const filteredTickets = tickets.filter(t => {
    if (priorityFilter.length && !priorityFilter.includes(t.urgency)) return false;
    if (statusFilter.length   && !statusFilter.includes(t.status))    return false;
    if (categoryFilter.length && !categoryFilter.includes(t.categoryId)) return false;
    return true;
  });

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
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground font-medium mr-1">Filter by:</span>
        <FilterDropdown
          label="Priority"
          options={PRIORITY_OPTIONS}
          selected={priorityFilter}
          onChange={setPriorityFilter}
        />
        <FilterDropdown
          label="Status"
          options={STATUS_OPTIONS}
          selected={statusFilter}
          onChange={setStatusFilter}
        />
        <FilterDropdown
          label="Category"
          options={CATEGORY_OPTIONS}
          selected={categoryFilter}
          onChange={setCategoryFilter}
        />
        <span className="ml-auto text-xs text-muted-foreground">{filteredTickets.length} ticket{filteredTickets.length !== 1 ? 's' : ''}</span>
        {(priorityFilter.length + statusFilter.length + categoryFilter.length) > 0 && (
          <button
            onClick={() => { setPriorityFilter([]); setStatusFilter([]); setCategoryFilter([]); }}
            className="ml-2 text-xs text-muted-foreground hover:text-rose-500 flex items-center gap-1 transition-colors"
          >
            <X size={11} /> Clear all
          </button>
        )}
      </div>

      {/* Ticket List */}
      <div className="space-y-3">
        {filteredTickets.length > 0 ? filteredTickets.map(t => (
          <TicketRow key={t.id} ticket={t} />
        )) : (
          <div className="py-12 text-center text-muted-foreground bg-slate-50 dark:bg-slate-900/30 rounded-xl border-2 border-dashed text-sm">
            No tickets match the selected filters.
          </div>
        )}
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
