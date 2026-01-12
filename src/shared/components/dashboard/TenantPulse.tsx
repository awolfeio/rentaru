export function TenantPulse() {
    return (
        <section className="bg-card rounded-xl border border-border p-6 shadow-sm h-full">
            <h3 className="font-semibold text-lg mb-4">Tenant Pulse</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-100 dark:border-red-900/30">
                    <div className="text-2xl font-bold text-red-600">4.2%</div>
                    <div className="text-xs font-medium text-red-800/70 dark:text-red-300">Late Payment Rate</div>
                </div>
                <div className="p-3 bg-muted/20 rounded-lg border border-border">
                    <div className="text-2xl font-bold text-foreground">1.2</div>
                    <div className="text-xs font-medium text-muted-foreground">Requests / Unit</div>
                </div>
            </div>

            <div>
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">At Risk</h4>
                <div className="space-y-3">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">OJ</div>
                         <div className="flex-1">
                            <div className="text-sm font-medium">Oliver Johnson</div>
                            <div className="text-xs text-muted-foreground">Chronic late payer</div>
                        </div>
                    </div>
                     <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="w-8 h-8 rounded-full bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">MC</div>
                         <div className="flex-1">
                            <div className="text-sm font-medium">Maria Cruz</div>
                            <div className="text-xs text-muted-foreground">Lease ending + Balance</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
