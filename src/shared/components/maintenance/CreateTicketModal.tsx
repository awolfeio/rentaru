import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
    X, 
    Upload, 
    Home, 
    MapPin, 
    AlertTriangle, 
    Clock, 
    User, 
    Briefcase,
    CheckCircle2
} from 'lucide-react';
import { MOCK_PROPERTIES } from '@/shared/mockData/properties';
import { VENDORS } from '@/shared/mockData/maintenance';
import { TicketCategory, UrgencyLevel, MaintenanceTicket } from '@/shared/types/maintenance';
import { useToast } from '@/shared/components/ui/Toast';

interface CreateTicketModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (ticket: Partial<MaintenanceTicket>) => void;
    userRole?: 'tenant' | 'manager' | 'admin';
}

export function CreateMaintenanceTicketModal({ isOpen, onClose, onCreate, userRole = 'manager' }: CreateTicketModalProps) {
    const { toast } = useToast();
    
    // -- Form State --
    // 1. Location
    const [selectedPropertyId, setSelectedPropertyId] = useState('');
    const [selectedUnitId, setSelectedUnitId] = useState('');
    const [area, setArea] = useState('');
    
    // 2. Issue
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState<TicketCategory | ''>('');
    const [description, setDescription] = useState('');
    
    // 3. Severity & Access
    const [urgency, setUrgency] = useState<UrgencyLevel>('routine');
    const [accessPermission, setAccessPermission] = useState(false);
    const [preferredTime, setPreferredTime] = useState('anytime');

    // 4. Assignment (Manager only)
    const [assignedVendorId, setAssignedVendorId] = useState('');
    const [estimatedCost, setEstimatedCost] = useState('');
    const [notifyVendor, setNotifyVendor] = useState(true);

    // Derived
    const selectedProperty = MOCK_PROPERTIES.find(p => p.id === selectedPropertyId);
    
    // Reset form on open
    useEffect(() => {
        if (isOpen) {
            // Reset logic could go here
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Basic Validation
        if (!selectedPropertyId || !title || !category || !description) {
            toast({ type: 'error', title: 'Missing Fields', message: 'Please fill in all required fields.' });
            return;
        }

        const newTicket: Partial<MaintenanceTicket> = {
            propertyId: selectedPropertyId,
            propertyName: selectedProperty?.name || '',
            unitId: selectedUnitId === 'common' ? undefined : selectedUnitId,
            unitNumber: selectedUnitId === 'common' // Logic to find unit number would ideally look up unit
                        ? 'Common Area' 
                        : selectedProperty?.units.find(u => u.id === selectedUnitId)?.number || '',
            title,
            description,
            categoryId: category as TicketCategory,
            urgency,
            accessPermission,
            preferredTime: preferredTime as any,
            status: 'open',
            reportedBy: 'Current User', // Placeholder
            reporterType: userRole === 'tenant' ? 'tenant' : 'manager',
            
            // Manager extras
            vendorId: assignedVendorId,
            vendorName: VENDORS.find(v => v.id === assignedVendorId)?.name,
            estimatedCost: estimatedCost ? parseFloat(estimatedCost) : undefined,
            
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        onCreate(newTicket);
        toast({ type: 'success', title: 'Ticket Created', message: 'The maintenance request has been submitted.' });
        onClose();
        
        // Reset (simplified)
        setTitle('');
        setDescription('');
        setUrgency('routine');
    };

    return createPortal(
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 min-h-screen">
            <div className="bg-card w-full max-w-3xl rounded-xl border shadow-xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b">
                    <div>
                         <h2 className="text-lg font-bold">Create Maintenance Ticket</h2>
                         <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                            <span className="capitalize">{userRole} Mode</span>
                            <span>•</span>
                            Draft autosaved
                         </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X size={20} className="text-muted-foreground" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Section 1: Location & Scope */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Home size={14} /> Location & Scope
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Property <span className="text-rose-500">*</span></label>
                                <select 
                                    className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={selectedPropertyId}
                                    onChange={(e) => {
                                        setSelectedPropertyId(e.target.value);
                                        setSelectedUnitId(''); // Reset unit when property changes
                                    }}
                                >
                                    <option value="">Select Property...</option>
                                    {MOCK_PROPERTIES.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>
                            
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Unit <span className="text-rose-500">*</span></label>
                                <select 
                                    className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none disabled:opacity-50"
                                    value={selectedUnitId}
                                    onChange={(e) => setSelectedUnitId(e.target.value)}
                                    disabled={!selectedPropertyId}
                                >
                                    <option value="">Select Unit...</option>
                                    <option value="common">Common Area</option>
                                    {selectedProperty?.units.map(u => (
                                        <option key={u.id} value={u.id}>Unit {u.number} ({u.status})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1.5 sm:col-span-2">
                                <label className="text-sm font-medium">Area / Room</label>
                                <div className="flex flex-wrap gap-2">
                                    {['Kitchen', 'Bathroom', 'Bedroom', 'Living Room', 'Exterior', 'Appliance', 'HVAC'].map(room => (
                                        <button
                                            key={room}
                                            type="button"
                                            onClick={() => setArea(room)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                                                area === room 
                                                ? 'bg-primary text-primary-foreground border-primary' 
                                                : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800'
                                            }`}
                                        >
                                            {room}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="w-full h-px bg-border/50" />

                    {/* Section 2: Issue Details */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <AlertTriangle size={14} /> Issue Details
                        </h3>
                        <div className="space-y-4">
                             <div className="space-y-1.5">
                                <label className="text-sm font-medium">Issue Title <span className="text-rose-500">*</span></label>
                                <input 
                                    type="text" 
                                    placeholder="e.g., Water leaking under sink"
                                    className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium">Category <span className="text-rose-500">*</span></label>
                                    <select 
                                        className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value as TicketCategory)}
                                    >
                                        <option value="">Select Category...</option>
                                        <option value="plumbing">Plumbing</option>
                                        <option value="electrical">Electrical</option>
                                        <option value="hvac">HVAC</option>
                                        <option value="appliance">Appliance</option>
                                        <option value="general">General Repair</option>
                                    </select>
                                </div>
                                
                                {category && (
                                    <div className="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg text-xs gap-2">
                                        <div className="bg-blue-200 dark:bg-blue-800 p-1 rounded-full"><Briefcase size={12} /></div>
                                        <span>
                                            We'll suggest {category === 'plumbing' ? 'Rapid Plumbers' : category === 'electrical' ? 'Bright Spark' : 'preferred vendors'} for this.
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium">Description <span className="text-rose-500">*</span></label>
                                <textarea 
                                    rows={4}
                                    placeholder="Please describe the issue in detail..."
                                    className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                        </div>
                    </section>

                    <div className="w-full h-px bg-border/50" />

                    {/* Section 3: Severity & Access */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Clock size={14} /> Severity & Access
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label className="text-sm font-medium">Priority <span className="text-rose-500">*</span></label>
                                <div className="space-y-2">
                                    {(['routine', 'urgent', 'emergency'] as const).map((level) => (
                                        <label 
                                            key={level}
                                            className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                                urgency === level 
                                                ? level === 'emergency' ? 'border-rose-500 bg-rose-50 dark:bg-rose-900/10' : 'border-primary bg-primary/5' 
                                                : 'hover:bg-slate-50 dark:hover:bg-slate-900'
                                            }`}
                                        >
                                            <input 
                                                type="radio" 
                                                name="urgency" 
                                                checked={urgency === level}
                                                onChange={() => setUrgency(level)}
                                                className="mt-1"
                                            />
                                            <div>
                                                <div className={`font-medium text-sm capitalize ${level === 'emergency' ? 'text-rose-600' : ''}`}>
                                                    {level}
                                                </div>
                                                <div className="text-xs text-muted-foreground mt-0.5">
                                                    {level === 'routine' ? 'Standard repair timeframe.' :
                                                     level === 'urgent' ? 'Needs attention within 48h.' :
                                                     'Immediate threat to property/safety.'}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Access Permission</label>
                                    <label className="flex items-start gap-3 p-3 rounded-lg border hover:bg-slate-50 dark:hover:bg-slate-900 cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            checked={accessPermission}
                                            onChange={(e) => setAccessPermission(e.target.checked)}
                                            className="mt-1"
                                        />
                                        <div className="text-sm">
                                            <span className="font-medium">Enter without tenant present</span>
                                            <p className="text-xs text-muted-foreground mt-0.5">Allow maintenance staff to enter if tenant is not home.</p>
                                        </div>
                                    </label>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Preferred Time</label>
                                    <select 
                                        className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={preferredTime}
                                        onChange={(e) => setPreferredTime(e.target.value)}
                                    >
                                        <option value="anytime">Anytime (Fastest)</option>
                                        <option value="morning">Morning (8am - 12pm)</option>
                                        <option value="afternoon">Afternoon (12pm - 5pm)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Manager Only - Assignment */}
                    {userRole !== 'tenant' && (
                        <>
                             <div className="w-full h-px bg-border/50" />
                             <section className="space-y-4">
                                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <User size={14} /> Assignment (Manager)
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium">Assign Vendor</label>
                                        <select 
                                            className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={assignedVendorId}
                                            onChange={(e) => setAssignedVendorId(e.target.value)}
                                        >
                                            <option value="">Unassigned (Decide Later)</option>
                                            {VENDORS.map(v => (
                                                <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-sm font-medium">Estimated Cost ($)</label>
                                        <input 
                                            type="number" 
                                            placeholder="0.00"
                                            className="w-full px-3 py-2 rounded-lg border bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 outline-none"
                                            value={estimatedCost}
                                            onChange={(e) => setEstimatedCost(e.target.value)}
                                        />
                                    </div>
                                </div>
                             </section>
                        </>
                    )}

                    {/* Section 5: Attachments (Simplified Placeholder) */}
                    <div className="w-full h-px bg-border/50" />
                    <section className="space-y-4">
                        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <Upload size={14} /> Attachments
                        </h3>
                        <div className="border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                                <Upload size={18} className="text-muted-foreground" />
                            </div>
                            <p className="text-sm font-medium">Click to upload photos or videos</p>
                            <p className="text-xs text-muted-foreground mt-1">SVG, PNG, JPG or MP4 (max. 10MB)</p>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="p-6 border-t bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between">
                     <button className="text-sm font-medium text-emerald-600 hover:underline">
                        Open full ticket view
                     </button>
                     <div className="flex gap-3">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSubmit}
                            className="px-6 py-2 text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                        >
                            {assignedVendorId ? 'Create & Assign' : 'Create Ticket'}
                        </button>
                     </div>
                </div>

            </div>
        </div>,
        document.body
    );
}
