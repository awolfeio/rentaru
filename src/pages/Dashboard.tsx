import { PortfolioHealthStrip } from '@/components/dashboard/PortfolioHealthStrip';
import { FinancialPanel } from '@/components/dashboard/FinancialPanel';
import { ActionQueue } from '@/components/dashboard/ActionQueue';
import { PropertiesSnapshot } from '@/components/dashboard/PropertiesSnapshot';
import { TenantPulse } from '@/components/dashboard/TenantPulse';

export default function Dashboard() {
    return (
        <div>
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="text-muted-foreground mt-1">Overview of your portfolio health and pending actions.</p>
            </header>

            <PortfolioHealthStrip />

            <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-6 mb-6">
                <FinancialPanel />
                <ActionQueue />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[2fr_3fr] gap-6">
                <TenantPulse />
                <PropertiesSnapshot />
            </div>
        </div>
    )
}
