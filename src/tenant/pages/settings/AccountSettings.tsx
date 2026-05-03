
import { useState } from 'react';
import { Camera, Mail, User, Phone, UserCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/shared/components/ui/Toast';

const INPUT = 'w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none';
const ICON_INPUT = 'w-full pl-9 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="space-y-1.5">
            <label className="text-sm font-medium">{label}</label>
            {children}
        </div>
    );
}

function IconField({ label, icon: Icon, ...props }: { label: string; icon: any } & React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <Field label={label}>
            <div className="relative">
                <Icon className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                <input className={ICON_INPUT} {...props} />
            </div>
        </Field>
    );
}

export default function AccountSettings() {
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = () => {
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast({ type: 'success', title: 'Changes Saved', message: 'Your profile has been updated.' });
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-lg font-semibold">My Account</h2>
                <p className="text-sm text-muted-foreground">Manage your personal information and contact details.</p>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Profile Photo */}
            <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold select-none">
                        JS
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white w-6 h-6" />
                    </div>
                </div>
                <div>
                    <h3 className="font-medium">Profile Photo</h3>
                    <p className="text-sm text-muted-foreground mb-2">Visible to your property manager.</p>
                    <button className="text-sm text-primary font-medium hover:underline">Change Photo</button>
                </div>
            </div>

            {/* Personal Info */}
            <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <IconField label="First Name" icon={User} type="text" defaultValue="John" />
                    <IconField label="Last Name"  icon={User} type="text" defaultValue="Smith" />
                </div>
                <Field label="Preferred Name">
                    <input type="text" placeholder="e.g. Johnny (optional)" className={INPUT} />
                </Field>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Contact Info */}
            <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Contact Information</h3>
                <IconField label="Email Address" icon={Mail}  type="email" defaultValue="john.smith@example.com" />
                <IconField label="Phone Number"  icon={Phone} type="tel"   defaultValue="+1 (310) 555-0101" />
                <p className="text-xs text-muted-foreground">
                    Phone changes may require SMS verification if used for payment or maintenance alerts.
                </p>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Emergency Contact */}
            <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Emergency Contact</h3>
                <div className="grid grid-cols-2 gap-4">
                    <IconField label="Contact Name"  icon={UserCircle} type="text" placeholder="Full name" />
                    <IconField label="Contact Phone" icon={Phone}      type="tel"  placeholder="+1 (555) 000-0000" />
                </div>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Helper note */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground">
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                This information may be shared with your property manager for lease, billing, and maintenance communication.
            </div>

            <div className="pt-2">
                <button
                    onClick={handleSave}
                    disabled={isLoading}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
}
