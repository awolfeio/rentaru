
import { useState } from 'react';
import { CreditCard, Building2, Trash2, Plus, Check, Info, Zap } from 'lucide-react';
import { Switch } from '@/shared/components/ui/Switch';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/components/ui/Toast';

interface PaymentMethod {
    id: string;
    type: 'bank_account' | 'credit_card' | 'debit_card';
    brand: string;
    last4: string;
    expiry?: string;
    isDefault: boolean;
}

const MOCK_METHODS: PaymentMethod[] = [
    { id: 'pm1', type: 'bank_account',  brand: 'Bank of America', last4: '4821', isDefault: true },
    { id: 'pm2', type: 'debit_card',    brand: 'Visa',            last4: '4242', expiry: '09/27', isDefault: false },
];

const TYPE_ICON = {
    bank_account: Building2,
    credit_card:  CreditCard,
    debit_card:   CreditCard,
};

const FEE_INFO = [
    { label: 'ACH / Bank Transfer', fee: 'Free' },
    { label: 'Debit Card',          fee: '$3.95 flat fee' },
    { label: 'Credit Card',         fee: '2.9% of payment' },
];

function SectionHeader({ title, description }: { title: string; description?: string }) {
    return (
        <div className="mb-4">
            <h3 className="font-medium">{title}</h3>
            {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
        </div>
    );
}

export default function PaymentSettings() {
    const { toast } = useToast();
    const [methods, setMethods] = useState<PaymentMethod[]>(MOCK_METHODS);
    const [autopayEnabled, setAutopayEnabled] = useState(true);
    const [amountType, setAmountType] = useState<'full_balance' | 'rent_only'>('full_balance');
    const [timing, setTiming] = useState<'on_due_date' | 'days_before'>('on_due_date');
    const [paperless, setPaperless] = useState(true);

    const setDefault = (id: string) =>
        setMethods(prev => prev.map(m => ({ ...m, isDefault: m.id === id })));

    const removeMethod = (id: string) => {
        if (methods.find(m => m.id === id)?.isDefault) {
            toast({ type: 'error', title: 'Cannot Remove', message: 'Set another method as default first.' });
            return;
        }
        setMethods(prev => prev.filter(m => m.id !== id));
    };

    return (
        <div className="space-y-8 max-w-2xl">
            <div>
                <h2 className="text-lg font-semibold">Payment Settings</h2>
                <p className="text-sm text-muted-foreground">Manage payment methods, autopay, and billing preferences.</p>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Payment Methods */}
            <div>
                <SectionHeader title="Payment Methods" description="Saved methods used for rent and autopay." />
                <div className="space-y-3">
                    {methods.map(m => {
                        const Icon = TYPE_ICON[m.type];
                        return (
                            <div key={m.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-muted rounded-lg">
                                        <Icon size={18} className="text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{m.brand} ···· {m.last4}</p>
                                        <p className="text-xs text-muted-foreground capitalize">
                                            {m.type.replace('_', ' ')}
                                            {m.expiry && ` · Exp ${m.expiry}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {m.isDefault ? (
                                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                                            <Check size={10} /> Default
                                        </span>
                                    ) : (
                                        <button
                                            onClick={() => setDefault(m.id)}
                                            className="text-xs text-primary hover:underline font-medium"
                                        >
                                            Set Default
                                        </button>
                                    )}
                                    <button
                                        onClick={() => removeMethod(m.id)}
                                        className="p-1.5 text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}

                    <button className="w-full flex items-center justify-center gap-2 p-3 border border-dashed rounded-lg text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors">
                        <Plus size={16} /> Add Payment Method
                    </button>
                </div>

                {/* Fee disclosure */}
                <div className="mt-4 p-3 bg-muted/30 rounded-lg border">
                    <p className="text-xs font-medium mb-2 flex items-center gap-1.5 text-muted-foreground">
                        <Info size={12} /> Processing Fees
                    </p>
                    <div className="space-y-1">
                        {FEE_INFO.map(f => (
                            <div key={f.label} className="flex justify-between text-xs text-muted-foreground">
                                <span>{f.label}</span>
                                <span className="font-medium">{f.fee}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Autopay */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <SectionHeader
                        title="Autopay"
                        description="Automatically pay rent on your schedule."
                    />
                    <Switch checked={autopayEnabled} onCheckedChange={setAutopayEnabled} />
                </div>

                {autopayEnabled && (
                    <div className="space-y-5 animate-in fade-in slide-in-from-top-1 duration-200">
                        {/* Preview */}
                        <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                            <Zap size={18} className="text-primary shrink-0" />
                            <p className="text-sm text-primary font-medium">
                                Your next automatic payment of <strong>$1,450.00</strong> will be processed on <strong>Feb 1, 2026</strong>.
                            </p>
                        </div>

                        {/* Amount type */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Payment Amount</p>
                            {[
                                { value: 'full_balance', label: 'Full Balance', desc: 'Pays any outstanding balance' },
                                { value: 'rent_only',    label: 'Rent Only',    desc: 'Pays scheduled rent, excludes fees' },
                            ].map(opt => (
                                <label
                                    key={opt.value}
                                    className={cn(
                                        'flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                                        amountType === opt.value ? 'border-primary/40 bg-primary/5' : 'hover:bg-muted/30',
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="amount_type"
                                        value={opt.value}
                                        checked={amountType === opt.value}
                                        onChange={() => setAmountType(opt.value as typeof amountType)}
                                        className="mt-0.5 accent-primary"
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{opt.label}</p>
                                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>

                        {/* Timing */}
                        <div className="space-y-2">
                            <p className="text-sm font-medium">Payment Timing</p>
                            {[
                                { value: 'on_due_date',  label: 'On the Due Date',     desc: 'Charged on the 1st of each month' },
                                { value: 'days_before',  label: '3 Days Before Due',   desc: 'Helps avoid late fees for processing delays' },
                            ].map(opt => (
                                <label
                                    key={opt.value}
                                    className={cn(
                                        'flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors',
                                        timing === opt.value ? 'border-primary/40 bg-primary/5' : 'hover:bg-muted/30',
                                    )}
                                >
                                    <input
                                        type="radio"
                                        name="timing"
                                        value={opt.value}
                                        checked={timing === opt.value}
                                        onChange={() => setTiming(opt.value as typeof timing)}
                                        className="mt-0.5 accent-primary"
                                    />
                                    <div>
                                        <p className="text-sm font-medium">{opt.label}</p>
                                        <p className="text-xs text-muted-foreground">{opt.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="w-full h-px bg-border" />

            {/* Receipts */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium">Paperless Receipts</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Receive payment receipts by email only, no postal mail.</p>
                </div>
                <Switch checked={paperless} onCheckedChange={setPaperless} />
            </div>

            <div className="pt-2">
                <button
                    onClick={() => toast({ type: 'success', title: 'Saved', message: 'Payment preferences updated.' })}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    Save Changes
                </button>
            </div>
        </div>
    );
}
