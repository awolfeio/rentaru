
import {
    Home,
    CreditCard,
    Wrench,
    FileText,
    Building,
    MessageSquare,
    Zap,
    Users,
    Flag,
    LogOut,
    HelpCircle,
    Settings,
    Menu,
    X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { useState } from 'react';
import logo from '@/shared/assets/rentaru.svg';

// Types for Navigation
type TenantNavSection = {
    label?: string; // Optional grouping label
    items: TenantNavItem[];
};

type TenantNavItem = {
    name: string;
    icon: any;
    href: string;
    badge?: {
        label: string | number;
        variant: 'neutral' | 'info' | 'warning' | 'critical' | 'success';
    };
    hidden?: boolean; // For future gating logic
};

// --- MOCK STATE for MVP ---
// In a real app, this would come from a `useTenantContext` hook
const MOCK_TENANT_STATE = {
    rentStatus: 'overdue' as const, // 'paid' | 'due' | 'overdue'
    unreadMessages: 2,
    activeMaintenance: 1,
    balance: 1450,
};

// --- NAVIGATION CONFIG ---
const TENANT_NAV_CONFIG: TenantNavSection[] = [
    {
        items: [
            { name: 'Home', icon: Home, href: '/tenant/home' },
            {
                name: 'Payments',
                icon: CreditCard,
                href: '/tenant/payments',
                badge: MOCK_TENANT_STATE.balance > 0 ? { label: `$${MOCK_TENANT_STATE.balance}`, variant: MOCK_TENANT_STATE.rentStatus === 'overdue' ? 'critical' : 'warning' } : undefined
            },
            {
                name: 'Maintenance',
                icon: Wrench,
                href: '/tenant/maintenance',
                badge: MOCK_TENANT_STATE.activeMaintenance > 0 ? { label: MOCK_TENANT_STATE.activeMaintenance, variant: 'info' } : undefined
            },
            { name: 'Lease & Docs', icon: FileText, href: '/tenant/documents' },
            { name: 'My Unit', icon: Building, href: '/tenant/unit' },
            {
                name: 'Messages',
                icon: MessageSquare,
                href: '/tenant/messages',
                badge: MOCK_TENANT_STATE.unreadMessages > 0 ? { label: MOCK_TENANT_STATE.unreadMessages, variant: 'info' } : undefined
            },
        ]
    }
];

// --- COMPONENTS ---

const NavBadge = ({ badge }: { badge: TenantNavItem['badge'] }) => {
    if (!badge) return null;

    // Adapted for dark sidebar background
    const variants = {
        neutral: 'bg-slate-800 text-slate-300',
        info: 'bg-blue-500/20 text-blue-200',
        warning: 'bg-amber-500/20 text-amber-200',
        critical: 'bg-rose-500/20 text-rose-200',
        success: 'bg-emerald-500/20 text-emerald-200',
    };

    return (
        <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-auto", variants[badge.variant])}>
            {badge.label}
        </span>
    );
};

export function TenantSidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <>
            {/* Mobile Header / Toggle */}
            <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-background border-b z-40 flex items-center justify-between px-4">
                <div className="flex items-center gap-2 font-bold text-lg">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">R</div>
                    <span>Rentaru</span>
                </div>
                <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2">
                    {isMobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar Container */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-30 w-64 bg-sidebar text-sidebar-text border-r border-sidebar-hover transform transition-transform duration-200 ease-in-out lg:translate-x-0 pt-6 tall-desktop:pt-12 flex flex-col",
                isMobileOpen ? "translate-x-0 mt-14 shadow-2xl" : "-translate-x-full lg:mt-0"
            )}>
                {/* Desktop Logo */}
                <div className="hidden lg:flex px-6 mb-8 tall-desktop:mb-12 shrink-0 items-center gap-2">
                    <img src={logo} alt="Rentaru" className="h-6 w-auto" />
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 overflow-y-auto px-4 space-y-6 pb-6 custom-scrollbar">
                    {TENANT_NAV_CONFIG.map((section, idx) => (
                        <div key={idx}>
                            {section.label && (
                                <h3 className="px-3 mb-2 text-xs font-semibold text-sidebar-text/50 uppercase tracking-wider">
                                    {section.label}
                                </h3>
                            )}
                            <div className="space-y-1">
                                {section.items.map(item => !item.hidden && (
                                    <NavLink
                                        key={item.name}
                                        to={item.href}
                                        onClick={() => setIsMobileOpen(false)}
                                        className={({ isActive }) => cn(
                                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors relative group",
                                            isActive
                                                ? "bg-sidebar-active text-sidebar-textActive shadow-sm"
                                                : "text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-textActive"
                                        )}
                                    >
                                        <item.icon size={18} className={cn("shrink-0", ({ isActive }: { isActive: boolean }) => isActive ? "text-white" : "text-sidebar-text group-hover:text-sidebar-textActive")} />
                                        <span>{item.name}</span>
                                        <NavBadge badge={item.badge} />
                                    </NavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>

                {/* Footer Actions */}
                <div className="p-4 border-t border-sidebar-hover space-y-1">
                    <NavLink
                        to="/tenant/settings"
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-sidebar-textActive hover:bg-sidebar-hover",
                            isActive ? "bg-sidebar-active text-sidebar-textActive" : "text-sidebar-text"
                        )}
                    >
                        <Settings size={18} />
                        <span>Settings</span>
                    </NavLink>
                    <NavLink
                        to="/tenant/help"
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:text-sidebar-textActive hover:bg-sidebar-hover",
                            isActive ? "bg-sidebar-active text-sidebar-textActive" : "text-sidebar-text"
                        )}
                    >
                        <HelpCircle size={18} />
                        <span>Help & Support</span>
                    </NavLink>
                    <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-sidebar-text hover:text-red-400 hover:bg-sidebar-hover">
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>
                </div>

                {/* Tenant Profile Snippet */}
                <div className="p-4 border-t border-sidebar-hover bg-sidebar-hover/30">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sidebar-active flex items-center justify-center border border-sidebar-hover text-sm font-medium text-sidebar-textActive">
                            JS
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate text-sidebar-textActive">John Smith</p>
                            <p className="text-xs text-sidebar-text/70 truncate">Unit 3B • Sunset Apts</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-background/80 backdrop-blur-sm z-20 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
}
