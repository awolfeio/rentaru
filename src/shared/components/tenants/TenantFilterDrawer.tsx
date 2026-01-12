import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
    X, 
    Filter, 
    RotateCcw, 
    Check, 
    ChevronDown, 
    ChevronUp,
    DollarSign,
    Home,
    Clock,
    User,
    AlertTriangle
} from 'lucide-react';
import { TenantFilterState, INITIAL_FILTERS } from '@/shared/types/tenantFilters';
import { MOCK_PROPERTIES } from '@/shared/mockData/properties'; 
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface TenantFilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    currentFilters: TenantFilterState;
    onApply: (filters: TenantFilterState) => void;
    onReset: () => void;
}

// Reusable Section Component
const FilterSection = ({ 
    title, 
    icon: Icon, 
    isOpenDefault = true, 
    children,
    count = 0
}: { 
    title: string; 
    icon: any; 
    isOpenDefault?: boolean; 
    children: React.ReactNode;
    count?: number;
}) => {
    const [isOpen, setIsOpen] = useState(isOpenDefault);

    return (
        <div className="border-b border-border/50 py-4 last:border-0">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between w-full group outline-none"
            >
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Icon size={16} className="text-muted-foreground" />
                    {title}
                    {count > 0 && (
                        <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded-full">
                            {count}
                        </span>
                    )}
                </div>
                <div className={cn("text-muted-foreground transition-transform duration-200", isOpen && "rotate-180")}>
                    <ChevronDown size={16} />
                </div>
            </button>
            
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="pt-4 space-y-3">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export function TenantFilterDrawer({ isOpen, onClose, currentFilters, onApply, onReset }: TenantFilterDrawerProps) {
    const [localFilters, setLocalFilters] = useState<TenantFilterState>(currentFilters);

    // Sync when drawer opens
    useEffect(() => {
        if (isOpen) {
            setLocalFilters(currentFilters);
        }
    }, [isOpen, currentFilters]);

    if (!isOpen) return null;

    const handleCheckboxChange = (category: keyof TenantFilterState, value: string) => {
        setLocalFilters(prev => {
            const currentList = prev[category] as string[];
            const exists = currentList.includes(value);
            
            return {
                ...prev,
                [category]: exists 
                    ? currentList.filter(item => item !== value)
                    : [...currentList, value]
            };
        });
    };

    const handleApply = () => {
        onApply(localFilters);
        onClose();
    };

    const handleClear = () => {
        setLocalFilters(INITIAL_FILTERS);
        onReset();
        // Don't close immediately to allow user to see reset
    };

    const countActive = (category: keyof TenantFilterState) => {
        const val = localFilters[category];
        return Array.isArray(val) ? val.length : val ? 1 : 0;
    };

    return createPortal(
        <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            />
            
            {/* Drawer */}
            <motion.div 
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="relative w-full max-w-md bg-card border-l h-full shadow-2xl flex flex-col"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div className="flex items-center gap-2">
                         <Filter size={18} className="text-primary" />
                         <h2 className="text-lg font-bold">Filters</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto px-6 py-2">
                    
                    {/* 1. Tenant Status */}
                    <FilterSection title="Tenant Status" icon={User} count={countActive('status')}>
                        <div className="grid grid-cols-2 gap-2">
                            {['active', 'inactive', 'pending_move_in', 'pending_move_out', 'eviction'].map(status => (
                                <label key={status} className="flex items-center gap-2 text-sm cursor-pointer select-none group">
                                    <div className={cn(
                                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                        localFilters.status.includes(status) 
                                            ? "bg-primary border-primary text-primary-foreground" 
                                            : "border-muted-foreground/30 group-hover:border-primary/50"
                                    )}>
                                        {localFilters.status.includes(status) && <Check size={10} />}
                                    </div>
                                    <span className="capitalize">{status.replace(/_/g, ' ')}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* 2. Rent & Financial */}
                    <FilterSection title="Rent & Financial" icon={DollarSign} count={countActive('rentStatus')}>
                        <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Rent Status</h4>
                         <div className="grid grid-cols-2 gap-2 mb-4">
                            {['paid', 'partial', 'overdue', 'credit'].map(status => (
                                <label key={status} className="flex items-center gap-2 text-sm cursor-pointer select-none group">
                                    <div className={cn(
                                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                        localFilters.rentStatus.includes(status) 
                                            ? "bg-primary border-primary text-primary-foreground" 
                                            : "border-muted-foreground/30 group-hover:border-primary/50"
                                    )}>
                                        {localFilters.rentStatus.includes(status) && <Check size={10} />}
                                    </div>
                                    <span className="capitalize">{status}</span>
                                </label>
                            ))}
                        </div>

                         <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Balance</h4>
                         <div className="flex gap-2 items-center">
                             <input 
                                type="number" 
                                placeholder="Min" 
                                value={localFilters.balanceMin || ''}
                                onChange={e => setLocalFilters(prev => ({ ...prev, balanceMin: e.target.value ? Number(e.target.value) : undefined }))}
                                className="w-full px-3 py-1.5 text-sm rounded-md border bg-slate-50 dark:bg-slate-900 outline-none focus:ring-1 focus:ring-primary"
                             />
                             <span className="text-muted-foreground">-</span>
                             <input 
                                type="number" 
                                placeholder="Max" 
                                value={localFilters.balanceMax || ''}
                                onChange={e => setLocalFilters(prev => ({ ...prev, balanceMax: e.target.value ? Number(e.target.value) : undefined }))}
                                className="w-full px-3 py-1.5 text-sm rounded-md border bg-slate-50 dark:bg-slate-900 outline-none focus:ring-1 focus:ring-primary"
                             />
                         </div>
                    </FilterSection>

                    {/* 3. Property */}
                    <FilterSection title="Property" icon={Home} count={countActive('propertyIds')}>
                        <div className="space-y-2">
                             {MOCK_PROPERTIES.map(p => (
                                <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer select-none group">
                                    <div className={cn(
                                        "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                        localFilters.propertyIds.includes(p.id) 
                                            ? "bg-primary border-primary text-primary-foreground" 
                                            : "border-muted-foreground/30 group-hover:border-primary/50"
                                    )}>
                                        {localFilters.propertyIds.includes(p.id) && <Check size={10} />}
                                    </div>
                                    <span className="truncate">{p.name}</span>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* 4. Lease */}
                    <FilterSection title="Lease Details" icon={Clock} count={countActive('leaseStatus')}>
                        <div className="space-y-4">
                             <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Lease Status</h4>
                                <div className="grid grid-cols-1 gap-2">
                                    {['active', 'month_to_month', 'renewal_pending', 'expired'].map(status => (
                                        <label key={status} className="flex items-center gap-2 text-sm cursor-pointer select-none group">
                                            <div className={cn(
                                                "w-4 h-4 rounded border flex items-center justify-center transition-colors",
                                                localFilters.leaseStatus.includes(status) 
                                                    ? "bg-primary border-primary text-primary-foreground" 
                                                    : "border-muted-foreground/30 group-hover:border-primary/50"
                                            )}>
                                                {localFilters.leaseStatus.includes(status) && <Check size={10} />}
                                            </div>
                                            <span className="capitalize">{status.replace(/_/g, ' ')}</span>
                                        </label>
                                    ))}
                                </div>
                             </div>

                             <div>
                                <h4 className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">Expiring Soon</h4>
                                <div className="flex gap-2">
                                     {[30, 60, 90].map(days => (
                                         <button
                                            key={days}
                                            onClick={() => setLocalFilters(prev => ({ ...prev, leaseExpiringDays: prev.leaseExpiringDays === days ? undefined : days }))}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                                                localFilters.leaseExpiringDays === days
                                                    ? "bg-primary text-primary-foreground border-primary"
                                                    : "bg-background hover:bg-slate-50 border-border"
                                            )}
                                         >
                                            {days} Days
                                         </button>
                                     ))}
                                </div>
                             </div>
                        </div>
                    </FilterSection>

                     {/* 5. Maintenance */}
                    <FilterSection title="Maintenance" icon={AlertTriangle} count={localFilters.hasOpenTickets ? 1 : 0}>
                        <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                            <input 
                                type="checkbox" 
                                checked={!!localFilters.hasOpenTickets}
                                onChange={(e) => setLocalFilters(prev => ({ ...prev, hasOpenTickets: e.target.checked }))}
                                className="rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <span>Has Open Tickets</span>
                        </label>
                    </FilterSection>

                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-slate-50/50 dark:bg-slate-900/50 flex gap-3">
                     <button 
                        onClick={handleClear}
                        className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <RotateCcw size={14} /> Reset
                    </button>
                    <button 
                        onClick={handleApply}
                        className="flex-[2] px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-colors"
                    >
                        Show Results
                    </button>
                </div>

            </motion.div>
        </div>,
        document.body
    );
}
