import { Shield, Key, Lock, Smartphone, Fingerprint } from 'lucide-react';

export default function SecuritySettings() {
    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-lg font-semibold">Security</h2>
                <p className="text-sm text-muted-foreground">Manage your password and security preferences.</p>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Password */}
            <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Key size={18} className="text-muted-foreground" />
                    Change Password
                </h3>
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Current Password</label>
                        <input type="password" className="w-full bg-background border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none" placeholder="••••••••" />
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
                    <button className="bg-white border rounded-lg px-4 py-2 text-sm font-medium hover:bg-slate-50 transition-colors">
                        Update Password
                    </button>
                </div>
            </div>

            <div className="w-full h-px bg-border" />

            {/* 2FA */}
            <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Smartphone size={18} className="text-muted-foreground" />
                    Two-Factor Authentication
                </h3>
                <div className="space-y-3">
                    {/* Authenticator App */}
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-muted/10 transition-colors">
                        <div className="space-y-1">
                            <p className="font-medium text-sm">Authenticator App</p>
                            <p className="text-xs text-muted-foreground">Use an app like Google Authenticator or Authy.</p>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">Not Configured</span>
                            <button className="text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md shadow-sm transition-colors">
                                Setup
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Passkeys */}
            <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Fingerprint size={18} className="text-muted-foreground" />
                    Passkeys
                </h3>
                {/* Passkeys List/Add */}
                <div className="flex items-center justify-between p-4 border border-border rounded-lg bg-card hover:bg-muted/10 transition-colors">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <p className="font-medium text-sm">Passkeys</p>
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-1.5 py-0.5 rounded">NEW</span>
                        </div>
                        <p className="text-xs text-muted-foreground">Sign in securely with your face, fingerprint, or device.</p>
                    </div>
                    <button className="text-sm font-medium text-foreground border border-input bg-background hover:bg-muted px-3 py-1.5 rounded-md shadow-sm transition-colors">
                        Add Passkey
                    </button>
                </div>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Sessions */}
            <div>
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Lock size={18} className="text-muted-foreground" />
                    Active Sessions
                </h3>
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <Shield size={16} />
                            </div>
                            <div>
                                <p className="text-sm font-medium">Windows PC - Chrome</p>
                                <p className="text-xs text-muted-foreground">Seattle, USA • Active now</p>
                            </div>
                        </div>
                        <span className="text-xs font-medium text-emerald-600">Current Session</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
