
import { ReactNode } from 'react';
import { TenantSidebar } from './TenantSidebar';
import { TenantUtilityBar } from './TenantUtilityBar';

export function TenantLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex bg-background min-h-screen">
             {/* Sidebar */}
             <TenantSidebar />

             {/* Main Content Area */}
             <main className="flex-1 transition-all duration-300 ease-in-out lg:ml-64">
                <TenantUtilityBar />
                
                <div className="p-6 md:p-8 max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {children}
                </div>
             </main>
        </div>
    );
}
