import {
    Building,
    Car,
    CreditCard,
    FileText,
    HelpCircle,
    Home,
    LogOut,
    Menu,
    MessageSquare,
    Settings,
    Sparkles,
    Wrench,
    X,
    type LucideIcon,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { MOCK_PROPERTIES } from '@/shared/mockData/properties';
import { MOCK_TENANTS } from '@/shared/mockData/tenants';
import logo from '@/shared/assets/rentaru.svg';

const ACTIVE_TENANT_ID = 't1';
const UNREAD_MESSAGES = 2;

type TenantNavSection = {
    label?: string;
    items: TenantNavItem[];
};

type TenantNavItem = {
    name: string;
    icon: LucideIcon;
    href: string;
    badge?: {
        label: string | number;
        variant: 'neutral' | 'info' | 'warning' | 'critical' | 'success';
    };
    hidden?: boolean;
};

const NavBadge = ({ badge }: { badge: TenantNavItem['badge'] }) => {
    if (!badge) return null;

    const variants = {
        neutral: 'bg-slate-800 text-slate-300',
        info: 'bg-blue-500/20 text-blue-200',
        warning: 'bg-amber-500/20 text-amber-200',
        critical: 'bg-rose-500/20 text-rose-200',
        success: 'bg-emerald-500/20 text-emerald-200',
    } as const;

    return (
        <span className={cn('ml-auto rounded-full px-1.5 py-0.5 text-[10px] font-bold', variants[badge.variant])}>
            {badge.label}
        </span>
    );
};

export function TenantSidebar() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const activeTenant = MOCK_TENANTS.find(({ id }) => id === ACTIVE_TENANT_ID);
    const activeProperty = activeTenant
        ? MOCK_PROPERTIES.find(({ id }) => id === activeTenant.propertyId)
        : null;
    const hasAmenities = Boolean(activeProperty?.features?.amenities && activeProperty.amenities?.length);
    const hasVehicles = Boolean(activeProperty?.features?.vehicles);

    const tenantState = {
        rentStatus: activeTenant?.rentStatus ?? 'no_balance',
        unreadMessages: UNREAD_MESSAGES,
        activeMaintenance: activeTenant?.maintenanceRequestCount ?? 0,
        balance: Math.max(activeTenant?.balance ?? 0, 0),
    };

    const navSections: TenantNavSection[] = [
        {
            items: [
                { name: 'Home', icon: Home, href: '/tenant/home' },
                {
                    name: 'Payments',
                    icon: CreditCard,
                    href: '/tenant/payments',
                    badge:
                        tenantState.balance > 0
                            ? {
                                  label: `$${tenantState.balance}`,
                                  variant: tenantState.rentStatus === 'overdue' ? 'critical' : 'warning',
                              }
                            : undefined,
                },
                {
                    name: 'Maintenance',
                    icon: Wrench,
                    href: '/tenant/maintenance',
                    badge:
                        tenantState.activeMaintenance > 0
                            ? { label: tenantState.activeMaintenance, variant: 'info' }
                            : undefined,
                },
                { name: 'Lease & Docs', icon: FileText, href: '/tenant/documents' },
                { name: 'My Unit', icon: Building, href: '/tenant/unit' },
                { name: 'Amenities', icon: Sparkles, href: '/tenant/amenities', hidden: !hasAmenities },
                { name: 'Vehicles', icon: Car, href: '/tenant/vehicles', hidden: !hasVehicles },
                {
                    name: 'Messages',
                    icon: MessageSquare,
                    href: '/tenant/messages',
                    badge:
                        tenantState.unreadMessages > 0
                            ? { label: tenantState.unreadMessages, variant: 'info' }
                            : undefined,
                },
            ],
        },
    ];

    const tenantInitials = activeTenant?.name
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() ?? 'TN';

    return (
        <>
            <div className="fixed left-0 right-0 top-0 z-40 flex h-14 items-center justify-between border-b bg-background px-4 lg:hidden">
                <div className="flex items-center gap-2 text-lg font-bold">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">R</div>
                    <span>Rentaru</span>
                </div>
                <button onClick={() => setIsMobileOpen((open) => !open)} className="p-2">
                    {isMobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-sidebar-hover bg-sidebar pt-6 text-sidebar-text transition-transform duration-200 ease-in-out tall-desktop:pt-12 lg:translate-x-0',
                    isMobileOpen ? 'mt-14 translate-x-0 shadow-2xl' : '-translate-x-full lg:mt-0'
                )}
            >
                <div className="mb-8 hidden shrink-0 items-center gap-2 px-6 lg:flex tall-desktop:mb-12">
                    <img src={logo} alt="Rentaru" className="h-6 w-auto" />
                </div>

                <nav className="custom-scrollbar flex-1 space-y-6 overflow-y-auto px-4 pb-6">
                    {navSections.map((section, index) => (
                        <div key={index}>
                            {section.label ? (
                                <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-text/50">
                                    {section.label}
                                </h3>
                            ) : null}
                            <div className="space-y-1">
                                {section.items
                                    .filter((item) => !item.hidden)
                                    .map((item) => (
                                        <NavLink
                                            key={item.name}
                                            to={item.href}
                                            onClick={() => setIsMobileOpen(false)}
                                            className={({ isActive }) =>
                                                cn(
                                                    'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                                    isActive
                                                        ? 'bg-sidebar-active text-sidebar-textActive shadow-sm'
                                                        : 'text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-textActive'
                                                )
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <item.icon
                                                        size={18}
                                                        className={cn(
                                                            'shrink-0',
                                                            isActive
                                                                ? 'text-sidebar-textActive'
                                                                : 'text-sidebar-text group-hover:text-sidebar-textActive'
                                                        )}
                                                    />
                                                    <span>{item.name}</span>
                                                    <NavBadge badge={item.badge} />
                                                </>
                                            )}
                                        </NavLink>
                                    ))}
                            </div>
                        </div>
                    ))}
                </nav>

                <div className="space-y-1 border-t border-sidebar-hover p-4">
                    <NavLink
                        to="/tenant/settings"
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-hover hover:text-sidebar-textActive',
                                isActive ? 'bg-sidebar-active text-sidebar-textActive' : 'text-sidebar-text'
                            )
                        }
                    >
                        <Settings size={18} />
                        <span>Settings</span>
                    </NavLink>
                    <NavLink
                        to="/tenant/help"
                        className={({ isActive }) =>
                            cn(
                                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-hover hover:text-sidebar-textActive',
                                isActive ? 'bg-sidebar-active text-sidebar-textActive' : 'text-sidebar-text'
                            )
                        }
                    >
                        <HelpCircle size={18} />
                        <span>Help & Support</span>
                    </NavLink>
                    <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-text transition-colors hover:bg-sidebar-hover hover:text-red-400">
                        <LogOut size={18} />
                        <span>Log Out</span>
                    </button>
                </div>

                <div className="border-t border-sidebar-hover bg-sidebar-hover/30 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-sidebar-hover bg-sidebar-active text-sm font-medium text-sidebar-textActive">
                            {tenantInitials}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium text-sidebar-textActive">{activeTenant?.name ?? 'Tenant'}</p>
                            <p className="truncate text-xs text-sidebar-text/70">
                                Unit {activeTenant?.unitNumber ?? '--'} • {activeProperty?.name ?? activeTenant?.propertyName ?? 'Property'}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {isMobileOpen ? (
                <div
                    className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            ) : null}
        </>
    );
}
