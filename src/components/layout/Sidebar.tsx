import {
  LayoutDashboard,
  Building2,
  Users,
  FileText,
  Wrench,
  CreditCard,
  Calculator,
  Files,
  BarChart3,
  MessageSquare,
  Settings,
  LogOut,
  UserCog
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';

const NAV_GROUPS = [
  {
    label: 'Core',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, href: '/' },
      { name: 'Properties', icon: Building2, href: '/properties' },
      { name: 'Tenants', icon: Users, href: '/tenants' },
      { name: 'Leases', icon: FileText, href: '/leases' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { name: 'Maintenance', icon: Wrench, href: '/maintenance' },
      { name: 'Payments', icon: CreditCard, href: '/payments' },
      { name: 'Accounting', icon: Calculator, href: '/accounting' },
    ]
  },
  {
    label: 'Reference',
    items: [
      { name: 'Documents', icon: Files, href: '/documents' },
      { name: 'Reports', icon: BarChart3, href: '/reports' },
      { name: 'Messages', icon: MessageSquare, href: '/messages' },
    ]
  },
  {
    label: 'System',
    items: [
      { name: 'Users', icon: UserCog, href: '/users' },
      { name: 'Settings', icon: Settings, href: '/settings' },
    ]
  }
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-30 w-64 h-screen bg-sidebar text-sidebar-text border-r border-sidebar-hover flex flex-col pt-6">
      <div className="px-6 mb-8 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Rentaru</span>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar pb-4">
        <nav className="flex-1 px-4 space-y-6">
          {NAV_GROUPS.map((group, groupIndex) => (
            <div key={groupIndex}>
              <h3 className="text-[0.625rem] font-semibold text-sidebar-text/50 uppercase tracking-wider mb-2 pl-2">
                {group.label}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const isPlaceholder = item.href === '#' || item.href.startsWith('#');

                  if (isPlaceholder) {
                    return (
                      <div
                        key={item.name}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group text-sidebar-text hover:bg-sidebar-hover hover:text-sidebar-textActive cursor-pointer"
                        )}
                      >
                        <item.icon
                          className="w-4 h-4 transition-colors text-sidebar-text group-hover:text-sidebar-textActive"
                        />
                        {item.name}
                      </div>
                    );
                  }

                  return (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      end={item.href === '/'}
                      className={({ isActive }) => cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group",
                        isActive
                          ? "bg-sidebar-active text-sidebar-textActive shadow-sm"
                          : "hover:bg-sidebar-hover hover:text-sidebar-textActive"
                      )}
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon
                            className={cn(
                              "w-4 h-4 transition-colors",
                              isActive ? "text-white" : "text-sidebar-text group-hover:text-sidebar-textActive"
                            )}
                          />
                          {item.name}
                        </>
                      )}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-4 mt-auto pt-4 border-t border-sidebar-hover">
          <a
            href="#"
            className="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium text-sidebar-text hover:bg-sidebar-hover hover:text-red-400 transition-colors group"
          >
            <LogOut className="w-4 h-4 group-hover:text-red-400" />
            Log Out
          </a>
        </div>
      </div>
    </aside>
  );
}
