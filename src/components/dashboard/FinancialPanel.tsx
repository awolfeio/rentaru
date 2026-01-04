import { TrendingUp, DollarSign } from 'lucide-react';

export function FinancialPanel() {
    return (
        <section className="bg-card rounded-xl border border-border p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 text-green-600 rounded-md">
                        <DollarSign className="w-4 h-4" />
                    </div>
                    Financial Reality
                </h3>
                <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">Last 90 Days</span>
            </div>

            <div className="flex-1 flex flex-col gap-6">
                {/* Placeholder for Chart */}
                <div className="flex-1 bg-muted/30 rounded-lg border border-dashed border-border flex items-center justify-center p-8 min-h-[200px] relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-end justify-between px-8 pb-4 opacity-40">
                         {/* Fake bars */}
                         {[40, 65, 45, 80, 55, 70, 90, 60].map((h, i) => (
                             <div key={i} style={{height: `${h}%`}} className="w-8 bg-primary rounded-t-sm" />
                         ))}
                    </div>
                    <span className="text-muted-foreground font-medium z-10 bg-card/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm">Interactive Cashflow Chart</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Net Cash Flow</div>
                        <div className="text-xl font-bold flex items-center gap-2 mt-1">
                            +$12,450 
                            <TrendingUp className="w-4 h-4 text-green-500" />
                        </div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Avg Rent / Unit</div>
                        <div className="text-xl font-bold mt-1">$1,850</div>
                    </div>
                </div>
            </div>
        </section>
    )
}
