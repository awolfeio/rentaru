import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Building2, MapPin, Check, ArrowRight, ArrowLeft, Home, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';

type Step = 'basics' | 'units' | 'review';

import { useToast } from '@/components/ui/Toast';

export default function AddProperty() {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('basics');
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        type: 'multi-family',
        units: 1,
    });

    const nextStep = () => {
        if (step === 'basics') setStep('units');
        else if (step === 'units') setStep('review');
    };

    const prevStep = () => {
        if (step === 'units') setStep('basics');
        else if (step === 'review') setStep('units');
    };

    const { toast } = useToast();

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            {/* Header / Stepper */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-4">Add New Property</h1>
                <div className="flex items-center justify-center gap-4 text-sm font-medium text-muted-foreground">
                    <StepIndicator current={step} step="basics" label="Basics" num={1} />
                    <div className="w-10 h-px bg-border" />
                    <StepIndicator current={step} step="units" label="Units" num={2} />
                    <div className="w-10 h-px bg-border" />
                    <StepIndicator current={step} step="review" label="Review" num={3} />
                </div>
            </div>

            {/* Card Surface */}
            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden min-h-[400px] flex flex-col">
                <div className="flex-1 p-8">
                    <AnimatePresence mode="wait">
                        {step === 'basics' && (
                            <motion.div
                                key="basics"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-lg mx-auto"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-semibold">Property Details</h2>
                                    <p className="text-muted-foreground text-sm">Where is this property located?</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Property Name</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="e.g. Sunset Apartments"
                                                className="w-full pl-9 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1.5">Address Line 1</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                                            <input
                                                type="text"
                                                placeholder="123 Main St"
                                                className="w-full pl-9 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">City</label>
                                            <input
                                                type="text"
                                                className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1.5">State</label>
                                            <input
                                                type="text"
                                                className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                                value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'units' && (
                            <motion.div
                                key="units"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-lg mx-auto"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-semibold">Configuration</h2>
                                    <p className="text-muted-foreground text-sm">What type of property is this?</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <TypeCard
                                        icon={Home}
                                        label="Single Family"
                                        active={formData.type === 'single-family'}
                                        onClick={() => setFormData({ ...formData, type: 'single-family', units: 1 })}
                                    />
                                    <TypeCard
                                        icon={Layers}
                                        label="Multi-Family"
                                        active={formData.type === 'multi-family'}
                                        onClick={() => setFormData({ ...formData, type: 'multi-family' })}
                                    />
                                </div>

                                {formData.type === 'multi-family' && (
                                    <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                                        <label className="block text-sm font-medium mb-1.5">Number of Units</label>
                                        <input
                                            type="number"
                                            min="2"
                                            className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                                            value={formData.units}
                                            onChange={(e) => setFormData({ ...formData, units: parseInt(e.target.value) || 0 })}
                                        />
                                        <p className="text-xs text-muted-foreground mt-2">
                                            We'll generate {formData.units} default units (Unit 1, Unit 2, etc.) which you can customize later.
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {step === 'review' && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6 max-w-lg mx-auto"
                            >
                                <div className="text-center mb-8">
                                    <h2 className="text-xl font-semibold">Review & Create</h2>
                                    <p className="text-muted-foreground text-sm">Double check the details before creating.</p>
                                </div>

                                <div className="bg-muted/30 rounded-xl p-6 space-y-4 border border-border/50">
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-sm text-muted-foreground">Property Name</span>
                                        <span className="font-medium">{formData.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-sm text-muted-foreground">Location</span>
                                        <span className="font-medium text-right">{formData.address}<br />{formData.city}, {formData.state}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-sm text-muted-foreground">Configuration</span>
                                        <span className="font-medium capitalize">{formData.type.replace('-', ' ')} • {formData.units} Unit(s)</span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-border bg-muted/10 flex justify-between items-center">
                    {step !== 'basics' ? (
                        <button
                            onClick={prevStep}
                            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back
                        </button>
                    ) : (
                        <button
                            onClick={() => navigate('/properties')}
                            className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                        >
                            Cancel
                        </button>
                    )}

                    {step === 'review' ? (
                        <button
                            onClick={() => {
                                toast({ type: 'success', title: 'Property Created', message: `${formData.name} has been added to your portfolio.` });
                                navigate('/properties');
                            }}
                            className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                        >
                            Create Property
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

function StepIndicator({ current, step, label, num }: { current: Step, step: Step, label: string, num: number }) {
    const steps: Step[] = ['basics', 'units', 'review'];
    const currentIndex = steps.indexOf(current);
    const stepIndex = steps.indexOf(step);
    const isActive = current === step;
    const isCompleted = currentIndex > stepIndex;

    return (
        <div className={cn("flex items-center gap-2", isActive ? "text-primary" : isCompleted ? "text-foreground" : "text-muted-foreground/50")}>
            <div className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border",
                isActive ? "border-primary bg-primary/10" : isCompleted ? "border-foreground bg-foreground text-background" : "border-current"
            )}>
                {isCompleted ? <Check className="w-3 h-3" /> : num}
            </div>
            <span>{label}</span>
        </div>
    );
}

function TypeCard({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
    return (
        <div
            onClick={onClick}
            className={cn(
                "cursor-pointer p-4 rounded-xl border-2 transition-all duration-200 flex flex-col items-center gap-3 text-center hover:border-primary/50 hover:bg-primary/5",
                active ? "border-primary bg-primary/5" : "border-border bg-card"
            )}
        >
            <div className={cn("p-3 rounded-full", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
                <Icon className="w-6 h-6" />
            </div>
            <span className={cn("font-medium", active ? "text-primary" : "text-foreground")}>{label}</span>
        </div>
    );
}
