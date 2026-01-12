import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MoreVertical,
    Settings,
    Users,
    FileText,
    Download,
    BarChart,
    CreditCard,
    FileSpreadsheet,
    Copy,
    Archive,
    Trash2,
    Edit,
    Shield,
    ArrowRightLeft
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/components/ui/Toast';

export function PropertyActionsMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const { toast } = useToast();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAction = (action: string) => {
        setIsOpen(false);
        toast({
            type: 'info',
            title: 'Action Triggered',
            message: `Feature coming soon: ${action}`
        });
    };

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "p-2 bg-white dark:bg-card border rounded-lg transition-colors shadow-sm",
                    isOpen ? "bg-slate-100 dark:bg-slate-800 text-foreground" : "text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-foreground"
                )}
            >
                <MoreVertical size={20} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.1 }}
                        className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                        <div className="max-h-[80vh] overflow-y-auto py-2">
                            {/* Section 1: Property Management */}
                            <div className="px-3 py-2">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Property Management</h3>
                                <div className="space-y-1">
                                    <MenuItem icon={Edit} label="Edit Details" onClick={() => handleAction('Edit Details')} />
                                    <MenuItem icon={Settings} label="Property Settings" onClick={() => handleAction('Property Settings')} />
                                    <MenuItem icon={Users} label="Manage Access / Roles" onClick={() => handleAction('Manage Access')} />
                                    <MenuItem icon={FileText} label="Property Documents" onClick={() => handleAction('Property Documents')} />
                                </div>
                            </div>
                            <MenuSeparator />

                            {/* Section 2: Operations */}
                            <div className="px-3 py-2">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Operations</h3>
                                <div className="space-y-1">
                                    <MenuItem icon={Layers} label="Bulk Actions" onClick={() => handleAction('Bulk Actions')} />
                                    <MenuItem icon={Download} label="Export Property Data" onClick={() => handleAction('Export Data')} />
                                    <MenuItem icon={BarChart} label="Generate Reports" onClick={() => handleAction('Generate Reports')} />
                                </div>
                            </div>
                            <MenuSeparator />

                            {/* Section 3: Financial */}
                            <div className="px-3 py-2">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Financial</h3>
                                <div className="space-y-1">
                                    <MenuItem icon={CreditCard} label="Accounting Settings" onClick={() => handleAction('Accounting Settings')} />
                                    <MenuItem icon={Shield} label="Reconcile Transactions" onClick={() => handleAction('Reconcile')} />
                                    <MenuItem icon={FileSpreadsheet} label="View Ledger" onClick={() => handleAction('View Ledger')} />
                                </div>
                            </div>
                            <MenuSeparator />

                            {/* Section 4: Lifecycle */}
                            <div className="px-3 py-2">
                                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-2">Lifecycle</h3>
                                <div className="space-y-1">
                                    <MenuItem icon={Copy} label="Duplicate Property" onClick={() => handleAction('Duplicate Property')} />
                                    <MenuItem icon={ArrowRightLeft} label="Transfer Ownership" onClick={() => handleAction('Transfer Ownership')} />
                                    <MenuItem icon={Archive} label="Archive Property" onClick={() => handleAction('Archive Property')} />
                                </div>
                            </div>
                            <MenuSeparator />

                            {/* Section 5: Danger Zone */}
                            <div className="px-3 py-2">
                                <h3 className="text-xs font-semibold text-rose-500 uppercase tracking-wider mb-2 px-2">Danger Zone</h3>
                                <div className="space-y-1">
                                    <MenuItem icon={Trash2} label="Delete Property" variant="danger" onClick={() => handleAction('Delete Property')} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MenuItem({ icon: Icon, label, onClick, variant = 'default' }: { icon: any, label: string, onClick: () => void, variant?: 'default' | 'danger' }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-2 px-2 py-2 text-sm rounded-lg transition-colors text-left",
                variant === 'danger'
                    ? "text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-900/20"
                    : "text-foreground hover:bg-slate-50 dark:hover:bg-slate-800"
            )}
        >
            <Icon size={16} className={cn(variant === 'danger' ? "text-rose-600" : "text-muted-foreground")} />
            {label}
        </button>
    );
}

function MenuSeparator() {
    return <div className="h-px bg-border mx-4 my-1" />;
}

// Missing import fix placeholder
import { Layers } from 'lucide-react';
