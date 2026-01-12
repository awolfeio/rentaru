import { ArrowDown, AlertCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';



const MetricCard = ({ label, value, subtext, alert = false }: { label: string, value: string, subtext?: React.ReactNode, alert?: boolean }) => (
    <div className={cn(
        "bg-card p-4 rounded-xl border shadow-sm flex flex-col justify-between transition-all hover:shadow-md",
        alert ? "border-amber-200 bg-amber-50/50 dark:bg-amber-950/10 dark:border-amber-900/50" : "border-border"
    )}>
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="mt-2">
            <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
            {subtext && <div className={cn("text-xs font-medium mt-1 flex items-center gap-1", alert ? "text-amber-600 dark:text-amber-500" : "text-muted-foreground")}>{subtext}</div>}
        </div>
    </div>
)

export function PortfolioHealthStrip() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard 
                label="Occupancy" 
                value="94.2%" 
                subtext={<span className="text-red-500 flex items-center">↓ 1.1% from last month</span>}
            />
            <MetricCard 
                label="Rent Collected (MTD)" 
                value="$128,400" 
                subtext="of $136,500 expected"
            />
            <MetricCard 
                label="Overdue Rent" 
                value="$4,250" 
                subtext="3 tenants overdue"
                alert={true}
            />
             <MetricCard 
                label="Active Maintenance" 
                value="6 Open" 
                subtext="2 Urgent requests"
            />
        </div>
    )
}
