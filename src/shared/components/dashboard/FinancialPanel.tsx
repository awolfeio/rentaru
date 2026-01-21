import { TrendingUp, DollarSign, TrendingDown, Activity, Info } from 'lucide-react';
import { TimeRangeToggle } from './FinancialWidgets';
import { FinancialReality3D } from './FinancialReality3D';
import { useMemo } from 'react';
import { calculateStabilityScore } from '@/shared/lib/stability-score';

export function FinancialPanel() {
    const stability = useMemo(() => calculateStabilityScore(), []);
    const { score, details } = stability;

    return (
        <section className="bg-card rounded-xl border border-border p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 text-green-600 rounded-md">
                        <DollarSign className="w-4 h-4" />
                    </div>
                    Cashflow Health Spectrum
                </h3>
                <TimeRangeToggle />
            </div>

            <div className="flex-1 flex flex-col gap-6">
                <FinancialReality3D />

                <div className="grid grid-cols-4 gap-3">
                    <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Net Cash Flow</div>
                        <div className="text-lg font-bold flex items-center gap-1.5 mt-1">
                            {details.netCashFlow > 0 ? '+' : ''}${details.netCashFlow.toLocaleString()}
                            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                        </div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Avg Rent</div>
                        <div className="text-lg font-bold mt-1">${details.avgRent.toLocaleString()}</div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg">
                        <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Expense Burn</div>
                        <div className="text-lg font-bold flex items-center gap-1.5 mt-1">
                            {details.expenseBurn.toFixed(1)}%
                            <TrendingDown className="w-3.5 h-3.5 text-amber-500" />
                        </div>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-lg relative group">
                        <div className="flex items-center gap-1.5 mb-1">
                            <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Stability</div>
                            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-600 text-[9px] font-bold rounded-sm border border-blue-200">BETA</span>
                            <div className="relative group/tooltip">
                                <Info className="w-3 h-3 text-muted-foreground cursor-help" />
                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-xs rounded shadow-lg opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-50 text-center pointer-events-none">
                                    Stability is a 0-100 score reflecting cash flow predictability and resilience. Higher is better.
                                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900"></div>
                                </div>
                            </div>
                        </div>
                        <div className="text-lg font-bold flex items-center gap-1.5 mt-1">
                            {score}
                            <Activity className={`w-3.5 h-3.5 ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-blue-500' : 'text-amber-500'}`} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

