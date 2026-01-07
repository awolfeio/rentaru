import { useState } from 'react';
import { Camera, Mail, User, Phone } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

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
                <p className="text-sm text-muted-foreground">Manage your personal information and preferences.</p>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Profile Photo */}
            <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer">
                    <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                        J
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <Camera className="text-white w-6 h-6" />
                    </div>
                </div>
                <div>
                    <h3 className="font-medium">Profile Photo</h3>
                    <p className="text-sm text-muted-foreground mb-2">This will be displayed on your profile.</p>
                    <button className="text-sm text-primary font-medium hover:underline">Change Photo</button>
                </div>
            </div>

            <div className="grid gap-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">First Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                defaultValue="John"
                                className="w-full pl-9 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Last Name</label>
                        <div className="relative">
                            <User className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                defaultValue="Doe"
                                className="w-full pl-9 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Email Address</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <input
                            type="email"
                            defaultValue="john.doe@example.com"
                            className="w-full pl-9 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
                        <input
                            type="tel"
                            defaultValue="+1 (555) 123-4567"
                            className="w-full pl-9 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="pt-4">
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
