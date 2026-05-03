
import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom';
import { User, Shield, Bell, CreditCard, FileText, Palette } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const SETTINGS_NAV = [
    {
        category: 'Personal',
        items: [
            { path: 'account',       label: 'My Account',       icon: User },
            { path: 'security',      label: 'Login & Security',  icon: Shield },
            { path: 'notifications', label: 'Notifications',     icon: Bell },
        ],
    },
    {
        category: 'Home & Lease',
        items: [
            { path: 'payments',  label: 'Payment Settings', icon: CreditCard },
            { path: 'documents', label: 'Documents',         icon: FileText },
        ],
    },
    {
        category: 'Preferences',
        items: [
            { path: 'appearance', label: 'Appearance', icon: Palette },
        ],
    },
];

function SettingsNavLink({ to, children, icon: Icon }: { to: string; children: React.ReactNode; icon: any }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                cn(
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
            }
        >
            <Icon size={16} />
            {children}
        </NavLink>
    );
}

export default function TenantSettingsLayout() {
    return (
        <div className="flex flex-col md:flex-row gap-8 min-h-[600px] h-full">
            {/* Sidenav */}
            <aside className="w-full md:w-64 shrink-0 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Settings</h1>
                    <p className="text-muted-foreground text-sm">Manage your account, payments, notifications, and preferences.</p>
                </div>

                <nav className="space-y-6">
                    {SETTINGS_NAV.map((section) => (
                        <div key={section.category}>
                            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-3">
                                {section.category}
                            </h3>
                            <div className="space-y-1">
                                {section.items.map((item) => (
                                    <SettingsNavLink key={item.path} to={item.path} icon={item.icon}>
                                        {item.label}
                                    </SettingsNavLink>
                                ))}
                            </div>
                        </div>
                    ))}
                </nav>
            </aside>

            {/* Content */}
            <main className="flex-1 bg-card border border-border rounded-xl shadow-sm p-6 overflow-hidden min-h-[500px]">
                <Outlet />
            </main>
        </div>
    );
}
