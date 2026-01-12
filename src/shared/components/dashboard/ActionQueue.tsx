import { AlertTriangle, Banknote, Clock, ArrowRight } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const ActionItem = ({ icon: Icon, title, meta, urgency = 'medium', actionLabel }: any) => (
    <div className="group flex items-center gap-4 p-3 rounded-xl bg-muted/20 border border-border/50 hover:border-border hover:bg-muted/50 transition-all duration-200 cursor-pointer">
        <div className={cn(
            "p-2 rounded-lg flex-shrink-0",
            urgency === 'high' ? "bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400" :
                urgency === 'medium' ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
                    "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
        )}>
            <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm text-foreground truncate">{title}</h4>
            <p className="text-xs text-muted-foreground mt-0.5">{meta}</p>
        </div>
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-xs font-semibold text-primary">{actionLabel}</span>
            <ArrowRight className="w-4 h-4 text-primary" />
        </div>
    </div>
)

export function ActionQueue() {
    return (
        <section className="bg-card rounded-xl border border-border p-6 shadow-sm h-full overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    Action Queue
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full dark:bg-red-900/20 dark:text-red-400">3 Urgent</span>
                </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-6">Immediate attention required.</p>

            <div className="flex flex-col gap-2 -mx-2 px-2 overflow-y-auto max-h-[400px]">
                <ActionItem
                    icon={AlertTriangle}
                    title="Water leak – Unit 3B"
                    meta="Reported 2 hours ago · Vendor unassigned"
                    urgency="high"
                    actionLabel="Assign"
                />
                <ActionItem
                    icon={Banknote}
                    title="Rent overdue – John S."
                    meta="7 days overdue · $1,250"
                    urgency="medium"
                    actionLabel="Review"
                />
                <ActionItem
                    icon={Clock}
                    title="Lease expires in 21 days"
                    meta="Unit 12 · Sarah Jenkins"
                    urgency="medium"
                    actionLabel="Renew"
                />
            </div>
        </section>
    )
}
