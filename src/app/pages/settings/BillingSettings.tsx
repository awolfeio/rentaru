import { Switch } from '@/shared/components/ui/Switch'; // We'll need a Switch component, assume it exists or use basic HTML for now if not
import { CreditCard, Check, AlertCircle } from 'lucide-react';

export default function BillingSettings() {
    return (
        <div className="space-y-6 max-w-3xl">
            <div>
                <h2 className="text-lg font-semibold">Billing & Plan</h2>
                <p className="text-sm text-muted-foreground">Manage your subscription and payment methods.</p>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Current Plan */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded">PRO</span>
                            <span className="text-sm text-muted-foreground">Monthly Plan</span>
                        </div>
                        <h3 className="text-2xl font-bold">$29<span className="text-base font-normal text-muted-foreground">/mo</span></h3>
                        <p className="text-sm text-muted-foreground mt-2">Next billing date: <strong>Feb 1, 2026</strong></p>
                    </div>
                    <button className="text-sm font-medium text-primary hover:underline bg-background border border-primary/20 px-3 py-1.5 rounded-lg shadow-sm">
                        Manage Subscription
                    </button>
                </div>
            </div>

            {/* Invoices */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Payment History</h3>
                    <button className="text-sm text-primary hover:underline">Download All</button>
                </div>
                <div className="border border-border rounded-lg divide-y divide-border">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-muted rounded-full text-muted-foreground">
                                    <CreditCard size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-medium">Invoice #{2024000 + i} - Pro Plan</p>
                                    <p className="text-xs text-muted-foreground">Jan {15 - i}, 2026</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">$29.00</span>
                                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                    <Check size={12} /> Paid
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
