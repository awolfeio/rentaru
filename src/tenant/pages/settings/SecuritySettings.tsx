
import { useState } from 'react';
import { Shield, Key, Lock, Smartphone, Eye, EyeOff } from 'lucide-react';
import { Switch } from '@/shared/components/ui/Switch';
import { useToast } from '@/shared/components/ui/Toast';

function SectionHeader({ icon: Icon, title }: { icon: any; title: string }) {
    return (
        <h3 className="font-medium mb-4 flex items-center gap-2">
            <Icon size={18} className="text-muted-foreground" />
            {title}
        </h3>
    );
}

export default function SecuritySettings() {
    const { toast } = useToast();
    const [showCurrent, setShowCurrent] = useState(false);
    const [twoFAEnabled, setTwoFAEnabled] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);

    const handlePasswordUpdate = () => {
        setIsUpdating(true);
        setTimeout(() => {
            setIsUpdating(false);
            toast({ type: 'success', title: 'Password Updated', message: 'Your password has been changed successfully.' });
        }, 1000);
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-lg font-semibold">Login & Security</h2>
                <p className="text-sm text-muted-foreground">Manage your password, verification methods, and active sessions.</p>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Password */}
            <div>
                <SectionHeader icon={Key} title="Change Password" />
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Current Password</label>
                        <div className="relative">
                            <input
                                type={showCurrent ? 'text' : 'password'}
                                placeholder="••••••••"
                                className="w-full pr-10 bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(v => !v)}
                                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">New Password</label>
                            <input type="password" className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Confirm New Password</label>
                            <input type="password" className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                        </div>
                    </div>
                    <button
                        onClick={handlePasswordUpdate}
                        disabled={isUpdating}
                        className="bg-white border rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors disabled:opacity-50"
                    >
                        {isUpdating ? 'Updating...' : 'Update Password'}
                    </button>
                </div>
            </div>

            <div className="w-full h-px bg-border" />

            {/* 2FA */}
            <div>
                <SectionHeader icon={Smartphone} title="Two-Factor Authentication" />
                <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card">
                        <div className="space-y-1">
                            <p className="font-medium text-sm">Authenticator App</p>
                            <p className="text-xs text-muted-foreground">Use Google Authenticator, Authy, or similar.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className={twoFAEnabled
                                ? 'text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded'
                                : 'text-xs text-muted-foreground bg-muted px-2 py-1 rounded'
                            }>
                                {twoFAEnabled ? 'Enabled' : 'Not Configured'}
                            </span>
                            <button
                                onClick={() => setTwoFAEnabled(v => !v)}
                                className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md shadow-sm transition-colors"
                            >
                                {twoFAEnabled ? 'Disable' : 'Set Up'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Active Sessions */}
            <div>
                <SectionHeader icon={Lock} title="Active Sessions" />
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <Shield size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Windows PC — Chrome</p>
                                <p className="text-xs text-muted-foreground">Los Angeles, USA · Active now</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-emerald-600">Current Session</span>
                    </div>
                </div>
                <div className="mt-4">
                    <button className="text-sm font-medium text-rose-600 hover:underline">
                        Sign Out of All Other Devices
                    </button>
                </div>
            </div>
        </div>
    );
}
