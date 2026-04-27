import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, DollarSign, Calendar, FileText, User, CheckCircle2, Search } from 'lucide-react';
import { ManualPaymentMethod, Payment } from '../types';
import { MOCK_TENANTS } from '@/shared/mockData/tenants';
import { useToast } from '@/shared/components/ui/Toast';
import { cn } from '@/shared/lib/utils';

interface RecordManualPaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (paymentData: Partial<Payment>) => void;
  preselectedTenantId?: string | null;
}

export function RecordManualPaymentDrawer({ isOpen, onClose, onSubmit, preselectedTenantId }: RecordManualPaymentDrawerProps) {
  const { toast } = useToast();
  // Form State
  const [selectedTenant, setSelectedTenant] = useState<any>(null);
  const [tenantSearch, setTenantSearch] = useState('');
  const [isTenantDropdownOpen, setIsTenantDropdownOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [method, setMethod] = useState<ManualPaymentMethod>('check');
  const [reference, setReference] = useState('');
  const [notes, setNotes] = useState('');

  const filteredTenants = MOCK_TENANTS.filter(t => t.name.toLowerCase().includes(tenantSearch.toLowerCase()));
  const propertyContext = selectedTenant ? `${selectedTenant.propertyName} - ${selectedTenant.unitNumber}` : '';

  useEffect(() => {
    if (isOpen) {
      if (preselectedTenantId) {
        const tenant = MOCK_TENANTS.find(t => t.id === preselectedTenantId);
        if (tenant) {
          setSelectedTenant(tenant);
          setTenantSearch(tenant.name);
        }
      } else {
        setSelectedTenant(null);
        setTenantSearch('');
      }
    }
  }, [isOpen, preselectedTenantId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;
    onSubmit({
      id: `pay_${Date.now()}`,
      tenantName: selectedTenant.name,
      propertyName: selectedTenant.propertyName,
      unitNumber: selectedTenant.unitNumber,
      amount: parseFloat(amount) || 0,
      date,
      method,
      origin: 'manual',
      status: 'paid',
      type: 'rent',
      manualRef: reference,
      notes,
      editable: true
    });
    
    toast({ type: 'success', title: 'Payment Recorded', message: 'Manual payment recorded successfully.' });
    
    // Reset form
    if (!preselectedTenantId) {
      setSelectedTenant(null);
      setTenantSearch('');
    }
    setAmount('');
    setMethod('check');
    setReference('');
    setNotes('');
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
      />
      
      {/* Drawer */}
      <motion.div 
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="relative w-full max-w-md bg-card border-l h-full shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b bg-card">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-primary" />
            <h2 className="text-lg font-bold">Record Manual Payment</h2>
          </div>
          <button type="button" onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="px-6 py-3 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-900/30">
            <p className="text-xs text-blue-800 dark:text-blue-300">
                Online ACH and card payments are recorded automatically. Only record a payment manually if it was received outside the app.
            </p>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form id="manual-payment-form" onSubmit={handleSubmit} className="space-y-6">
            
            {/* Step 1: Context */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 border-b border-border pb-2">
                <User size={16} className="text-muted-foreground"/> 1. Tenant & Context
              </h3>
              
              <div className="space-y-3">
                <div className="relative">
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Tenant Name *</label>
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input 
                      readOnly={!!preselectedTenantId}
                      required={!selectedTenant}
                      type="text" 
                      value={isTenantDropdownOpen ? tenantSearch : (selectedTenant ? selectedTenant.name : tenantSearch)}
                      onChange={(e) => {
                        if (preselectedTenantId) return;
                        setTenantSearch(e.target.value);
                        if (!isTenantDropdownOpen) setIsTenantDropdownOpen(true);
                        if (selectedTenant) setSelectedTenant(null);
                      }}
                      onFocus={() => {
                        if (!preselectedTenantId) setIsTenantDropdownOpen(true);
                      }}
                      onBlur={() => {
                        if (preselectedTenantId) return;
                        setIsTenantDropdownOpen(false);
                        setTenantSearch('');
                      }}
                      placeholder="Search tenant..." 
                      className={cn(
                        "w-full pl-8 pr-3 py-2 text-sm rounded-md border outline-none focus:ring-1 focus:ring-primary",
                        preselectedTenantId 
                          ? "bg-slate-100 dark:bg-slate-800/50 text-muted-foreground cursor-not-allowed" 
                          : "bg-slate-50 dark:bg-slate-900"
                      )}
                    />
                  </div>
                  <AnimatePresence>
                    {isTenantDropdownOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute z-10 w-full mt-1 bg-card border rounded-md shadow-lg max-h-48 overflow-y-auto"
                      >
                        {filteredTenants.length > 0 ? filteredTenants.map(t => (
                          <div 
                            key={t.id}
                            className="px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer flex flex-col"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => {
                              setSelectedTenant(t);
                              setTenantSearch('');
                              setIsTenantDropdownOpen(false);
                            }}
                          >
                            <span className="font-medium">{t.name}</span>
                            <span className="text-xs text-muted-foreground">{t.propertyName} - {t.unitNumber}</span>
                          </div>
                        )) : (
                          <div className="px-3 py-2 text-sm text-muted-foreground text-center">No tenants found.</div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Property & Unit</label>
                  <input 
                    readOnly
                    type="text" 
                    value={propertyContext}
                    placeholder="Auto-filled from tenant" 
                    className="w-full px-3 py-2 text-sm rounded-md border bg-slate-100 dark:bg-slate-800/50 text-muted-foreground outline-none cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Details */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold flex items-center gap-2 border-b border-border pb-2">
                <FileText size={16} className="text-muted-foreground"/> 2. Payment Details
              </h3>
              
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Amount Received *</label>
                    <div className="relative">
                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input 
                            required
                            type="number" 
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00" 
                            className="w-full pl-8 pr-3 py-2 text-sm rounded-md border bg-slate-50 dark:bg-slate-900 outline-none focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    </div>
                    <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-1">Date Received *</label>
                    <div className="relative">
                        <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input 
                            required
                            type="date" 
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="relative w-full pl-8 pr-3 py-2 text-sm rounded-md border bg-slate-50 dark:bg-slate-900 outline-none focus:ring-1 focus:ring-primary [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                        />
                    </div>
                    </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Payment Method *</label>
                  <select 
                    value={method}
                    onChange={(e) => setMethod(e.target.value as ManualPaymentMethod)}
                    className="w-full px-3 py-2 text-sm rounded-md border bg-slate-50 dark:bg-slate-900 outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="cash">Cash</option>
                    <option value="check">Check</option>
                    <option value="money_order">Money Order</option>
                    <option value="external_bank_transfer">External Bank Transfer (Zelle, Wire, etc.)</option>
                    <option value="external_digital_wallet">External Digital Wallet (Venmo, PayPal)</option>
                    <option value="third_party">Third-Party Payer</option>
                  </select>
                </div>

                <AnimatePresence mode="popLayout">
                  {method === 'check' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Check Number</label>
                      <input 
                        type="text" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="e.g. 1042" 
                        className="w-full px-3 py-2 text-sm rounded-md border bg-slate-50 dark:bg-slate-900 outline-none focus:ring-1 focus:ring-primary"
                      />
                    </motion.div>
                  )}
                  {method === 'money_order' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Money Order Number</label>
                      <input 
                        type="text" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="e.g. MO-99283" 
                        className="w-full px-3 py-2 text-sm rounded-md border bg-slate-50 dark:bg-slate-900 outline-none focus:ring-1 focus:ring-primary"
                      />
                    </motion.div>
                  )}
                  {(method === 'external_bank_transfer' || method === 'external_digital_wallet') && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Reference / Transaction ID</label>
                      <input 
                        type="text" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="e.g. txn_123456" 
                        className="w-full px-3 py-2 text-sm rounded-md border bg-slate-50 dark:bg-slate-900 outline-none focus:ring-1 focus:ring-primary"
                      />
                    </motion.div>
                  )}
                  {method === 'third_party' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                      <label className="block text-xs font-medium text-muted-foreground mb-1">Payer Name</label>
                      <input 
                        type="text" 
                        value={reference}
                        onChange={(e) => setReference(e.target.value)}
                        placeholder="e.g. State Housing Authority" 
                        className="w-full px-3 py-2 text-sm rounded-md border bg-slate-50 dark:bg-slate-900 outline-none focus:ring-1 focus:ring-primary"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                <div>
                  <label className="block text-xs font-medium text-muted-foreground mb-1">Notes (Optional)</label>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any internal notes here..." 
                    className="w-full px-3 py-2 text-sm rounded-md border bg-slate-50 dark:bg-slate-900 outline-none focus:ring-1 focus:ring-primary min-h-[80px]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Summary / Allocation preview */}
             <div className="space-y-4">
               <h3 className="text-sm font-semibold flex items-center gap-2 border-b border-border pb-2">
                <CheckCircle2 size={16} className="text-muted-foreground"/> 3. Apply Payment
              </h3>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-border/50 text-sm text-muted-foreground">
                  By default, this payment will be applied to the oldest open balance.
              </div>
             </div>

          </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border bg-slate-50/50 dark:bg-slate-900/50 flex gap-3">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            Cancel
          </button>
          <button 
            type="submit"
            form="manual-payment-form"
            className="flex-[2] px-4 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-colors"
          >
            Record Payment
          </button>
        </div>
      </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
