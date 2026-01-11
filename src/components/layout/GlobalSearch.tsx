import { useState, useEffect, useRef, useMemo } from 'react';
import { 
    Search, Command, Building, Home, User, 
    FileText, Wrench, CreditCard, File, Shield, 
    ArrowRight, AlertCircle, Clock 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';

type EntityType = 'property' | 'unit' | 'tenant' | 'lease' | 'maintenance' | 'payment' | 'document' | 'user';

interface SearchResultStatus {
    label: string;
    severity: 'info' | 'warning' | 'critical';
}

interface GlobalSearchResult {
    id: string;
    entityType: EntityType;
    primaryLabel: string;
    secondaryLabel?: string;
    status?: SearchResultStatus;
    href: string;
}

const MOCK_RESULTS: GlobalSearchResult[] = [
    // Properties
    { id: 'p1', entityType: 'property', primaryLabel: 'Sunset Apartments', secondaryLabel: '12 units · Portland, OR', href: '/properties/p1' },
    { id: 'p2', entityType: 'property', primaryLabel: 'Pine Street Duplex', secondaryLabel: '2 units · Bend, OR', href: '/properties/p2' },
    
    // Units
    { id: 'u1', entityType: 'unit', primaryLabel: 'Unit 3B', secondaryLabel: 'Sunset Apartments', href: '/properties/p1/units/u1' },
    { id: 'u2', entityType: 'unit', primaryLabel: 'Unit 1A', secondaryLabel: 'Pine Street Duplex', href: '/properties/p2/units/u2' },

    // Tenants
    { id: 't1', entityType: 'tenant', primaryLabel: 'John Smith', secondaryLabel: 'Unit 3B · Sunset Apartments', status: { label: 'Overdue Rent', severity: 'critical' }, href: '/tenants/t1' },
    { id: 't2', entityType: 'tenant', primaryLabel: 'Sarah Jenkins', secondaryLabel: 'Unit 1A · Pine Street Duplex', href: '/tenants/t2' },

    // Maintenance
    { id: 'm1', entityType: 'maintenance', primaryLabel: 'Water Leak', secondaryLabel: 'Unit 3B · Reported 2h ago', status: { label: 'Urgent', severity: 'critical' }, href: '/maintenance/m1' },
    { id: 'm2', entityType: 'maintenance', primaryLabel: 'Broken Heater', secondaryLabel: 'Unit 1A · In Progress', status: { label: 'Medium', severity: 'warning' }, href: '/maintenance/m2' },

    // Leases
    { id: 'l1', entityType: 'lease', primaryLabel: 'Lease Agreement', secondaryLabel: 'Unit 3B · Expiring in 21 days', status: { label: 'Expiring', severity: 'warning' }, href: '/leases/l1' },

    // Payments
    { id: 'pay1', entityType: 'payment', primaryLabel: 'Rent Payment', secondaryLabel: 'John Smith · $1,250', status: { label: 'Paid', severity: 'info' }, href: '/payments/pay1' },
];

export function GlobalSearch() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Filter results
    const filteredResults = useMemo(() => {
        if (!query.trim()) return [];
        return MOCK_RESULTS.filter(item => 
            item.primaryLabel.toLowerCase().includes(query.toLowerCase()) || 
            item.secondaryLabel?.toLowerCase().includes(query.toLowerCase()) ||
            item.entityType.toLowerCase().includes(query.toLowerCase())
        );
    }, [query]);

    // Group results
    const groupedResults = useMemo(() => {
        const groups: Record<string, GlobalSearchResult[]> = {};
        filteredResults.forEach(result => {
            if (!groups[result.entityType]) groups[result.entityType] = [];
            groups[result.entityType].push(result);
        });
        return groups;
    }, [filteredResults]);

    // Flat list for keyboard navigation
    const flatResults = useMemo(() => {
        return Object.values(groupedResults).flat();
    }, [groupedResults]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 10);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                inputRef.current?.blur();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Arrow key navigation
    useEffect(() => {
        if (!isOpen) return;
        const handleNav = (e: KeyboardEvent) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setActiveIndex(prev => (prev + 1) % flatResults.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setActiveIndex(prev => (prev - 1 + flatResults.length) % flatResults.length);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (flatResults[activeIndex]) {
                    handleSelect(flatResults[activeIndex]);
                }
            }
        };
        window.addEventListener('keydown', handleNav);
        return () => window.removeEventListener('keydown', handleNav);
    }, [isOpen, flatResults, activeIndex]);

    // Click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (result: GlobalSearchResult) => {
        navigate(result.href);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <div ref={containerRef} className="relative z-50">
            <div className={cn(
                "relative flex items-center transition-all duration-200 ease-out h-9 rounded-md px-3 gap-2 border bg-muted/40 hover:bg-muted/60 w-[600px]",
                isOpen ? "border-primary ring-2 ring-primary/20 bg-background shadow-lg" : "border-transparent"
            )}>
                <Search className={cn(
                    "w-4 h-4 transition-colors duration-200",
                    isOpen ? "text-primary" : "text-muted-foreground"
                )} />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                        setActiveIndex(0);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder="Search properties, tenants, units..."
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/60 h-full"
                />
                <AnimatePresence>
                    {!isOpen && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded border border-border/50 bg-background/50 text-[10px] font-medium text-muted-foreground pointer-events-none"
                        >
                            <span className="text-xs">⌘</span>K
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Portal for dropdown to escape sticky stacking context */}
            {isOpen && (
                <GlobalSearchPortal
                    isOpen={isOpen}
                    anchorRef={containerRef}
                    onClose={() => setIsOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.1 }}
                        className="w-full bg-background/40 backdrop-blur-xl backdrop-saturate-150 border border-border/50 rounded-xl shadow-2xl flex flex-col max-h-[70vh] overflow-hidden z-[100]"
                        // Position is handled by the wrapper/portal style
                    >
                        {filteredResults.length > 0 ? (
                            <div className="flex-1 overflow-y-auto custom-scrollbar py-2">
                                {Object.keys(groupedResults).map((type) => (
                                    <div key={type}>
                                        <div className="px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70 bg-muted/30 sticky top-0 backdrop-blur-md z-10">
                                            {formatType(type)}
                                        </div>
                                        <div className="px-2 py-1">
                                            {groupedResults[type].map((result, idx) => {
                                                const globalIndex = flatResults.indexOf(result);
                                                const isActive = globalIndex === activeIndex;

                                                return (
                                                    <div
                                                        key={result.id}
                                                        onClick={() => handleSelect(result)}
                                                        onMouseEnter={() => setActiveIndex(globalIndex)}
                                                        className={cn(
                                                            "group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-150",
                                                            isActive ? "bg-primary/10" : "hover:bg-muted/50"
                                                        )}
                                                    >
                                                        <div className="flex items-center gap-3 min-w-0">
                                                            <div className={cn(
                                                                "p-2 rounded-md shrink-0 flex items-center justify-center transition-colors",
                                                                isActive ? "bg-background shadow-sm text-primary" : "bg-muted/50 text-muted-foreground"
                                                            )}>
                                                                {getIconForType(result.entityType)}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <div className={cn("text-sm font-medium truncate", isActive ? "text-primary" : "text-foreground")}>
                                                                        {result.primaryLabel}
                                                                    </div>
                                                                    {result.status && (
                                                                        <span className={cn(
                                                                            "text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wide",
                                                                            getStatusColor(result.status.severity)
                                                                        )}>
                                                                            {result.status.label}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground truncate">
                                                                    {result.secondaryLabel}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                        {isActive && (
                                                            <div
                                                                className="animate-in fade-in zoom-in-95 duration-200 px-2 flex items-center text-xs font-medium text-muted-foreground"
                                                            >
                                                                <span className="mr-2">Open</span>
                                                                <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                                                    <span className="text-xs">↵</span>
                                                                </kbd>
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex-1 p-12 flex flex-col items-center justify-center text-center opacity-50">
                                <Search className="w-12 h-12 mb-4 text-muted-foreground/30" />
                                <p className="text-sm font-medium">No results found for "{query}"</p>
                                <p className="text-xs text-muted-foreground mt-1">Try searching for properties, units, or tenants.</p>
                            </div>
                        )}
                        
                        {/* Footer / Helper - Fixed at bottom */}
                        <div className="shrink-0 p-2 border-t border-border bg-muted/40 backdrop-blur-md text-[10px] text-muted-foreground flex items-center justify-between px-4 z-20">
                            <div className="flex gap-4">
                                <span><span className="font-bold">↑↓</span> to navigate</span>
                                <span><span className="font-bold">↵</span> to select</span>
                                <span><span className="font-bold">Esc</span> to close</span>
                            </div>
                            <div>
                                {filteredResults.length} results
                            </div>
                        </div>
                    </motion.div>
                </GlobalSearchPortal>
            )}
        </div>
    );
}

// Portal Component
function GlobalSearchPortal({ 
    children, 
    anchorRef,
    isOpen,
    onClose
}: { 
    children: React.ReactNode; 
    anchorRef: React.RefObject<HTMLElement>;
    isOpen: boolean;
    onClose: () => void;
}) {
    const [position, setPosition] = useState<{ top: number, left: number, width: number } | null>(null);

    // Calculate position
    useEffect(() => {
        if (isOpen && anchorRef.current) {
            const updatePosition = () => {
                const rect = anchorRef.current?.getBoundingClientRect();
                if (rect) {
                    setPosition({
                        top: rect.bottom + 8, // mt-2 equivalent
                        left: rect.left,
                        width: rect.width
                    });
                }
            };
            
            updatePosition();
            window.addEventListener('resize', updatePosition);
            window.addEventListener('scroll', updatePosition, true); // true for capture, to detect parent scrolls
            
            return () => {
                window.removeEventListener('resize', updatePosition);
                window.removeEventListener('scroll', updatePosition, true);
            };
        }
    }, [isOpen, anchorRef]);

    if (!isOpen || !position) return null;

    return createPortal(
        <AnimatePresence>
            <div 
                style={{ 
                    position: 'fixed', 
                    top: position.top, 
                    left: position.left,
                    width: position.width,
                    zIndex: 100
                }} 
                className="z-[100]"
            >
                {children}
            </div>
        </AnimatePresence>,
        document.body
    );
}

function getIconForType(type: string) {
    switch (type) {
        case 'property': return <Building className="w-4 h-4" />;
        case 'unit': return <Home className="w-4 h-4" />;
        case 'tenant': return <User className="w-4 h-4" />;
        case 'lease': return <FileText className="w-4 h-4" />;
        case 'maintenance': return <Wrench className="w-4 h-4" />;
        case 'payment': return <CreditCard className="w-4 h-4" />;
        case 'document': return <File className="w-4 h-4" />;
        case 'user': return <Shield className="w-4 h-4" />;
        default: return <Search className="w-4 h-4" />;
    }
}

function formatType(type: string) {
    if (type === 'property') return 'Properties';
    if (type === 'maintenance') return 'Maintenance Tickets';
    return type.charAt(0).toUpperCase() + type.slice(1) + 's';
}

function getStatusColor(severity: SearchResultStatus['severity']) {
    switch (severity) {
        case 'critical': return 'bg-red-500/10 text-red-600 dark:text-red-400';
        case 'warning': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400';
        case 'info': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
        default: return 'bg-slate-100 text-slate-600';
    }
}
