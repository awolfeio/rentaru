import { TrendingUp, DollarSign } from 'lucide-react';
import { TimeRangeToggle, PlaceholderChart } from './FinancialWidgets';

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
                <TimeRangeToggle />
            </div>

            <div className="flex-1 flex flex-col gap-6">
                <PlaceholderChart />

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
