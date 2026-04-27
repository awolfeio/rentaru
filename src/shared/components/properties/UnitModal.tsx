import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  Hash,
  DollarSign,
  Ruler,
  Home,
  Bed,
  Bath,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/components/ui/Toast';

// --- Types ---

export interface UnitFormData {
  identifier: string;
  type: string;
  beds: number;
  baths: number;
  sqft: string;
  floor: string;
  status: 'vacant' | 'occupied' | 'offline';
  rentAmount: string;
  rentFrequency: 'monthly' | 'weekly';
  deposit: string;
  marketRent: string;
}

interface UnitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UnitFormData) => void;
  initialData?: Partial<UnitFormData>;
  propertyName?: string;
}

type Step = 'details' | 'financials' | 'review';

const STEP_ORDER: Step[] = ['details', 'financials', 'review'];
const STEP_LABELS = { details: 'Details', financials: 'Financials', review: 'Review' };

// --- Sub-components ---

function StepLine({ active }: { active: boolean }) {
  return (
    <div className={cn('h-1 flex-1 rounded-full transition-colors duration-300', active ? 'bg-primary' : 'bg-primary/10')} />
  );
}

function StatusCard({ value, label, current, onClick }: { value: string; label: string; current: string; onClick: (v: string) => void }) {
  const isSelected = value === current;
  return (
    <div
      onClick={() => onClick(value)}
      className={cn(
        'cursor-pointer border rounded-lg p-3 text-center transition-all text-sm',
        isSelected
          ? 'border-primary bg-primary/5 text-primary font-medium ring-1 ring-primary'
          : 'border-border hover:border-primary/50 text-muted-foreground'
      )}
    >
      {label}
    </div>
  );
}

// --- Main Modal ---

const DEFAULT_FORM: UnitFormData = {
  identifier: '',
  type: '1-bedroom',
  beds: 1,
  baths: 1,
  sqft: '',
  floor: '',
  status: 'vacant',
  rentAmount: '',
  rentFrequency: 'monthly',
  deposit: '',
  marketRent: '',
};

export function UnitModal({ isOpen, onClose, onSubmit, initialData, propertyName }: UnitModalProps) {
  const { toast } = useToast();
  const isEditMode = !!initialData;

  const [step, setStep] = useState<Step>('details');
  const [form, setForm] = useState<UnitFormData>({ ...DEFAULT_FORM, ...initialData });

  // Re-populate form when modal opens (handles switching between units)
  useEffect(() => {
    if (isOpen) {
      setStep('details');
      setForm({ ...DEFAULT_FORM, ...initialData });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const stepIndex = STEP_ORDER.indexOf(step);
  const isFirst = stepIndex === 0;
  const isLast = step === 'review';

  const next = () => !isLast && setStep(STEP_ORDER[stepIndex + 1]);
  const prev = () => !isFirst && setStep(STEP_ORDER[stepIndex - 1]);

  const set = (patch: Partial<UnitFormData>) => setForm(f => ({ ...f, ...patch }));

  const handleSubmit = () => {
    if (!form.identifier || !form.type) {
      toast({ type: 'error', title: 'Missing Fields', message: 'Please fill in all required fields.' });
      return;
    }
    onSubmit(form);
    toast({
      type: 'success',
      title: isEditMode ? 'Unit Updated' : 'Unit Created',
      message: isEditMode
        ? `Unit ${form.identifier} has been updated.`
        : `Unit ${form.identifier} has been added successfully.`,
    });
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card w-full max-w-2xl rounded-xl border shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-muted/10">
          <div>
            <h2 className="text-lg font-bold">
              {isEditMode ? `Edit Unit · #${initialData?.identifier || ''}` : 'Add Unit'}
            </h2>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
              {propertyName && <><Home size={11} /><span>{propertyName}</span><span>•</span></>}
              <span>Step {stepIndex + 1} of 3 — {STEP_LABELS[step]}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4 flex gap-2">
          <StepLine active={stepIndex >= 0} />
          <StepLine active={stepIndex >= 1} />
          <StepLine active={stepIndex >= 2} />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.div
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Unit Details</h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Identifier */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Unit Identifier <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Hash className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                      <input
                        type="text"
                        placeholder="e.g. 101, 4B, Penthouse"
                        className="w-full pl-9 bg-slate-50 dark:bg-slate-900 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        value={form.identifier}
                        onChange={e => set({ identifier: e.target.value })}
                        autoFocus
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">Must be unique within this property.</p>
                  </div>

                  {/* Type */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Unit Type</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      value={form.type}
                      onChange={e => set({ type: e.target.value })}
                    >
                      <option value="studio">Studio</option>
                      <option value="1-bedroom">1 Bedroom</option>
                      <option value="2-bedroom">2 Bedroom</option>
                      <option value="3-bedroom">3 Bedroom</option>
                      <option value="custom">Custom</option>
                    </select>
                  </div>
                </div>

                {/* Beds / Baths / Sqft / Floor */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-1"><Bed size={13} /> Bedrooms</label>
                    <input
                      type="number" min="0"
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      value={form.beds}
                      onChange={e => set({ beds: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-1"><Bath size={13} /> Bathrooms</label>
                    <input
                      type="number" min="0" step="0.5"
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      value={form.baths}
                      onChange={e => set({ baths: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium flex items-center gap-1"><Ruler size={13} /> Sq. Ft.</label>
                    <input
                      type="number"
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      value={form.sqft}
                      onChange={e => set({ sqft: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Floor</label>
                    <input
                      type="number"
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      value={form.floor}
                      onChange={e => set({ floor: e.target.value })}
                    />
                  </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Status</label>
                  <div className="grid grid-cols-3 gap-3">
                    <StatusCard value="vacant"   label="Vacant"   current={form.status} onClick={v => set({ status: v as any })} />
                    <StatusCard value="occupied" label="Occupied" current={form.status} onClick={v => set({ status: v as any })} />
                    <StatusCard value="offline"  label="Offline"  current={form.status} onClick={v => set({ status: v as any })} />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {form.status === 'occupied' && "You'll be prompted to add a lease after saving."}
                    {form.status === 'vacant'   && 'This unit will be listed as available immediately.'}
                    {form.status === 'offline'  && 'Use for units under renovation or not for rent.'}
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
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Rent & Financials</h3>

                <div className="grid grid-cols-2 gap-4">
                  {/* Rent Amount */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Base Rent <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number" placeholder="0.00"
                        className="w-full pl-9 bg-slate-50 dark:bg-slate-900 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        value={form.rentAmount}
                        onChange={e => set({ rentAmount: e.target.value })}
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Frequency */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Frequency</label>
                    <select
                      className="w-full bg-slate-50 dark:bg-slate-900 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                      value={form.rentFrequency}
                      onChange={e => set({ rentFrequency: e.target.value as any })}
                    >
                      <option value="monthly">Monthly</option>
                      <option value="weekly">Weekly</option>
                    </select>
                  </div>

                  {/* Deposit */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Security Deposit</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number" placeholder="0.00"
                        className="w-full pl-9 bg-slate-50 dark:bg-slate-900 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        value={form.deposit}
                        onChange={e => set({ deposit: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Market Rent */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Market Rent (estimate)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number" placeholder="0.00"
                        className="w-full pl-9 bg-slate-50 dark:bg-slate-900 border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        value={form.marketRent}
                        onChange={e => set({ marketRent: e.target.value })}
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
                transition={{ duration: 0.18 }}
                className="space-y-6"
              >
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Review & {isEditMode ? 'Save' : 'Create'}</h3>

                <div className="bg-muted/30 rounded-xl p-6 border border-border/50 space-y-6">
                  {/* Unit Details Summary */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Unit Details</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Identifier</span>
                        <span className="font-medium">{form.identifier || '—'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Configuration</span>
                        <span className="font-medium capitalize">{form.type.replace('-', ' ')} · {form.beds}bd / {form.baths}ba</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Size</span>
                        <span className="font-medium">{form.sqft ? `${form.sqft} sq ft` : '—'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Floor</span>
                        <span className="font-medium">{form.floor || '—'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Status</span>
                        <span className={cn(
                          'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize',
                          form.status === 'vacant'   && 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400',
                          form.status === 'occupied' && 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400',
                          form.status === 'offline'  && 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400',
                        )}>{form.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-border/50" />

                  {/* Financials Summary */}
                  <div>
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Financials</h4>
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm">
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Base Rent</span>
                        <span className="font-medium">${form.rentAmount || '0'} / {form.rentFrequency}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Security Deposit</span>
                        <span className="font-medium">${form.deposit || '0'}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-xs mb-0.5">Market Rent</span>
                        <span className="font-medium">{form.marketRent ? `$${form.marketRent}` : '—'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t bg-muted/10 flex items-center justify-between">
          {!isFirst ? (
            <button
              onClick={prev}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft size={15} /> Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          )}

          {isLast ? (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              {isEditMode ? 'Save Changes' : 'Add Unit'} <Check size={15} />
            </button>
          ) : (
            <button
              onClick={next}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors shadow-sm"
            >
              Continue <ArrowRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
