import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    MapPin,
    Check,
    ArrowRight,
    ArrowLeft,
    DollarSign,
    Ruler,
    Hash
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/components/ui/Toast';

type Step = 'details' | 'financials' | 'review';

export default function AddUnit() {
    const navigate = useNavigate();
    const { propertyId } = useParams();
    const [step, setStep] = useState<Step>('details');
    const { toast } = useToast();

    // Mock Property Data (would normally fetch this)
    const property = {
        name: "Highland Lofts",
        address: "123 Highland Ave, Seattle WA 98102",
        units: 24
    };

    const [formData, setFormData] = useState({
        // Step 1: Details
        identifier: '',
        type: '1-bedroom',
        beds: 1,
        baths: 1,
        sqft: '',
        status: 'vacant',
        floor: '',

        // Step 2: Financials
        rentAmount: '',
        rentFrequency: 'monthly',
        deposit: '',
        marketRent: '',
    });

    const nextStep = () => {
        if (step === 'details') setStep('financials');
        else if (step === 'financials') setStep('review');
    };

    const prevStep = () => {
        if (step === 'financials') setStep('details');
        else if (step === 'review') setStep('financials');
    };

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            {/* Property Context Header */}
            <div className="mb-8 p-4 bg-muted/30 border border-border/50 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <h2 className="font-semibold text-sm text-foreground">{property.name}</h2>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <MapPin size={12} /> {property.address}
                        </div>
                    </div>
                </div>
                <div className="text-xs font-medium text-muted-foreground px-3 py-1 bg-background border rounded-lg">
                    Adding to {property.units} existing units
                </div>
            </div>

            {/* Main Card */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col">

                {/* Progress Header */}
                <div className="border-b border-border p-6 bg-muted/10">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-xl font-bold tracking-tight">Add Unit</h1>
                        <span className="text-sm text-muted-foreground">Step {step === 'details' ? 1 : step === 'financials' ? 2 : 3} of 3</span>
                    </div>
                    <div className="flex gap-2">
                        <StepLine active={step === 'details' || step === 'financials' || step === 'review'} />
                        <StepLine active={step === 'financials' || step === 'review'} />
                        <StepLine active={step === 'review'} />
                    </div>
                </div>

                <div className="flex-1 p-8">
                    <AnimatePresence mode="wait">
                        {step === 'details' && (
                            <motion.div
                                key="details"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-2xl mx-auto"
                            >
                                <h2 className="text-lg font-semibold">Unit Details</h2>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium mb-1.5">Unit Identifier <span className="text-rose-500">*</span></label>
                                        <div className="relative">
                                            <Hash className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="e.g. 101, 4B, Penthouse"
                                                className="w-full pl-9 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                value={formData.identifier}
                                                onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                                                autoFocus
                                            />
                                        </div>
                                        <p className="text-xs text-muted-foreground mt-1">Must be unique within property.</p>
                                    </div>

                                    <div className="col-span-2 sm:col-span-1">
                                        <label className="block text-sm font-medium mb-1.5">Unit Type</label>
                                        <select
                                            className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        >
                                            <option value="studio">Studio</option>
                                            <option value="1-bedroom">1 Bedroom</option>
                                            <option value="2-bedroom">2 Bedroom</option>
                                            <option value="3-bedroom">3 Bedroom</option>
                                            <option value="custom">Custom</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Bedrooms</label>
                                        <input
                                            type="number"
                                            min="0"
                                            className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            value={formData.beds}
                                            onChange={(e) => setFormData({ ...formData, beds: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Bathrooms</label>
                                        <input
                                            type="number"
                                            min="0"
                                            step="0.5"
                                            className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            value={formData.baths}
                                            onChange={(e) => setFormData({ ...formData, baths: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Sq. Ft.</label>
                                        <div className="relative">
                                            <Ruler className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="number"
                                                className="w-full pl-9 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                value={formData.sqft}
                                                onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1.5">Initial Status</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        <StatusCard
                                            value="vacant"
                                            label="Vacant"
                                            current={formData.status}
                                            onClick={(v) => setFormData({ ...formData, status: v })}
                                        />
                                        <StatusCard
                                            value="occupied"
                                            label="Occupied"
                                            current={formData.status}
                                            onClick={(v) => setFormData({ ...formData, status: v })}
                                        />
                                        <StatusCard
                                            value="offline"
                                            label="Offline"
                                            current={formData.status}
                                            onClick={(v) => setFormData({ ...formData, status: v })}
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {formData.status === 'occupied' && "You'll be prompted to add a lease after creating this unit."}
                                        {formData.status === 'vacant' && "This unit will be listed as available for rent immediately."}
                                        {formData.status === 'offline' && "Use this for units under renovation or not for rent."}
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {step === 'financials' && (
                            <motion.div
                                key="financials"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-2xl mx-auto"
                            >
                                <h2 className="text-lg font-semibold">Rent & Financials</h2>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Base Rent Amount <span className="text-rose-500">*</span></label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full pl-9 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                value={formData.rentAmount}
                                                onChange={(e) => setFormData({ ...formData, rentAmount: e.target.value })}
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Rent Frequency</label>
                                        <select
                                            className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            value={formData.rentFrequency}
                                            onChange={(e) => setFormData({ ...formData, rentFrequency: e.target.value })}
                                        >
                                            <option value="monthly">Monthly</option>
                                            <option value="weekly">Weekly</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Security Deposit</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full pl-9 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                value={formData.deposit}
                                                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Market Rent (Estimate)</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full pl-9 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                value={formData.marketRent}
                                                onChange={(e) => setFormData({ ...formData, marketRent: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'review' && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-2xl mx-auto"
                            >
                                <h2 className="text-lg font-semibold">Review & Create</h2>

                                <div className="bg-muted/30 rounded-xl p-6 border border-border/50">
                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Unit Summary</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground block">Identifier</span>
                                            <span className="font-medium">{formData.identifier}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Configuration</span>
                                            <span className="font-medium capitalize">{formData.type.replace('-', ' ')} • {formData.beds} Bed, {formData.baths} Bath</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Size</span>
                                            <span className="font-medium">{formData.sqft ? `${formData.sqft} sq ft` : '—'}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Status</span>
                                            <span className={cn(
                                                "inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize",
                                                formData.status === 'vacant' && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400",
                                                formData.status === 'occupied' && "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400",
                                                formData.status === 'offline' && "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400",
                                            )}>{formData.status}</span>
                                        </div>
                                    </div>

                                    <div className="w-full h-px bg-border/50 my-6" />

                                    <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Financials</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-muted-foreground block">Base Rent</span>
                                            <span className="font-medium">${formData.rentAmount || '0'} / {formData.rentFrequency}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground block">Deposit</span>
                                            <span className="font-medium">${formData.deposit || '0'}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border bg-muted/10 flex justify-between items-center">
                    {step !== 'details' ? (
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate(-1)}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                    )}

                    {step === 'review' ? (
                        <button
                            onClick={() => {
                                toast({ type: 'success', title: 'Unit Created', message: `Unit ${formData.identifier} was successfully added.` });
                                navigate(`/app/properties/${propertyId}`);
                            }}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Add Unit
                            <Check className="w-4 h-4" />
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

function StepLine({ active }: { active: boolean }) {
    return (
        <div className={cn("h-1 flex-1 rounded-full transition-colors duration-300", active ? "bg-primary" : "bg-primary/10")} />
    );
}

function StatusCard({ value, label, current, onClick }: { value: string, label: string, current: string, onClick: (v: string) => void }) {
    const isSelected = value === current;
    return (
        <div
            onClick={() => onClick(value)}
            className={cn(
                "cursor-pointer border rounded-lg p-3 text-center transition-all",
                isSelected ? "border-primary bg-primary/5 text-primary font-medium ring-1 ring-primary" : "border-border hover:border-primary/50 text-muted-foreground"
            )}
        >
            {label}
        </div>
    );
}
