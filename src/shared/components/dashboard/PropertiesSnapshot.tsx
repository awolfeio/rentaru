import { ChevronRight, Activity } from 'lucide-react';

export function PropertiesSnapshot() {
    return (
        <section className="bg-card rounded-xl border border-border p-6 shadow-sm h-full">
            <h3 className="font-semibold text-lg mb-4">Properties</h3>
            
            <div className="overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Property</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground w-20">Units</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Occupancy</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground w-24">Stability</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <tr className="group hover:bg-muted/30 transition-colors cursor-pointer">
                            <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                Oak Street Apartments
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">12</td>
                            <td className="px-4 py-3 text-green-600 font-medium">92%</td>
                            <td className="px-4 py-3 font-bold text-blue-600 flex items-center gap-1.5">
                                78
                                <Activity className="w-3.5 h-3.5" />
                            </td>
                        </tr>
                         <tr className="group hover:bg-muted/30 transition-colors cursor-pointer">
                            <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                Burnside Duplex
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">2</td>
                            <td className="px-4 py-3 text-green-600 font-medium">100%</td>
                            <td className="px-4 py-3 font-bold text-green-600 flex items-center gap-1.5">
                                96
                                <Activity className="w-3.5 h-3.5" />
                            </td>
                        </tr>
                        <tr className="group hover:bg-muted/30 transition-colors cursor-pointer">
                            <td className="px-4 py-3 font-medium text-foreground flex items-center gap-2">
                                <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors" />
                                Pineview Heights
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">24</td>
                            <td className="px-4 py-3 text-amber-600 font-medium">85%</td>
                            <td className="px-4 py-3 font-bold text-amber-600 flex items-center gap-1.5">
                                58
                                <Activity className="w-3.5 h-3.5" />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
             <div className="mt-4 text-center">
                <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">View All Properties</button>
            </div>
        </section>
    )
}
