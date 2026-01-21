
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, Mail, Smartphone, AlertTriangle, Check, Info } from 'lucide-react';
import { Switch } from '@/shared/components/ui/Switch';
import { cn } from '@/shared/lib/utils';
import { 
    NOTIFICATION_CATEGORIES, 
    MOCK_NOTIFICATION_PREFERENCES, 
    NotificationChannel, 
    NotificationPreference 
} from '@/shared/lib/notifications-data';

export default function NotificationsSettings() {
    const [preferences, setPreferences] = useState<NotificationPreference[]>(MOCK_NOTIFICATION_PREFERENCES);
    const [activeTab, setActiveTab] = useState<'categories' | 'channels'>('categories');

    // Group categories for rendering
    const groups = Array.from(new Set(NOTIFICATION_CATEGORIES.map(c => c.group)));

    const toggleCategory = (categoryId: string) => {
        setPreferences(prev => prev.map(p => 
            p.categoryId === categoryId ? { ...p, enabled: !p.enabled } : p
        ));
    };

    const toggleChannel = (categoryId: string, channel: NotificationChannel) => {
        setPreferences(prev => prev.map(p => 
            p.categoryId === categoryId ? { 
                ...p, 
                channels: { ...p.channels, [channel]: !p.channels[channel] } 
            } : p
        ));
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">Notification Preferences</h2>
                <p className="text-muted-foreground text-sm">
                    Customize how and when you want to be notified.
                </p>
            </div>

            {/* Quick Toggles / Global Settings MVP */}
            <div className="bg-muted/30 p-4 rounded-lg border border-border mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-md border border-border">
                        <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <div className="font-medium text-sm">Pause All Notifications</div>
                        <div className="text-xs text-muted-foreground">Temporarily silence all non-urgent alerts</div>
                    </div>
                </div>
                <Switch checked={false} onCheckedChange={() => {}} />
            </div>

            {/* Tabs (Visual implementation for MVP) */}
            <div className="border-b border-border mb-6">
                <div className="flex gap-6">
                    <button 
                        onClick={() => setActiveTab('categories')}
                        className={cn(
                            "pb-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === 'categories' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        By Category
                    </button>
                    <button 
                        onClick={() => setActiveTab('channels')}
                        className={cn(
                            "pb-3 text-sm font-medium border-b-2 transition-colors",
                            activeTab === 'channels' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Channel Settings
                    </button>
                </div>
            </div>

            {/* Content */}
            {activeTab === 'categories' && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {groups.map(group => {
                        const groupCats = NOTIFICATION_CATEGORIES.filter(c => c.group === group);
                        return (
                            <div key={group} className="space-y-3">
                                <h3 className="text-sm font-semibold capitalize text-muted-foreground tracking-wider mb-3 flex items-center gap-2">
                                    {group === 'maintenance' && <AlertTriangle className="w-3.5 h-3.5" />}
                                    {group} Alerts
                                </h3>
                                <div className="grid gap-3">
                                    {groupCats.map(cat => {
                                        const pref = preferences.find(p => p.categoryId === cat.id);
                                        if (!pref) return null;

                                        return (
                                            <div key={cat.id} className="flex items-start justify-between p-4 bg-card border border-border rounded-lg hover:border-border/80 transition-colors">
                                                <div className="flex-1 mr-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-medium text-sm">{cat.label}</span>
                                                        {!pref.enabled && <span className="text-[10px] bg-muted text-muted-foreground px-1.5 rounded">OFF</span>}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground leading-relaxed">{cat.description}</p>
                                                    
                                                    {/* Channel Micro-Toggles (Only if category is enabled) */}
                                                    {pref.enabled && (
                                                        <div className="flex items-center gap-3 mt-3">
                                                            <ChannelToggle 
                                                                active={!!pref.channels.app} 
                                                                onClick={() => toggleChannel(cat.id, 'app')} 
                                                                icon={Bell} 
                                                                label="In-App"
                                                            />
                                                            <ChannelToggle 
                                                                active={!!pref.channels.email} 
                                                                onClick={() => toggleChannel(cat.id, 'email')} 
                                                                icon={Mail} 
                                                                label="Email"
                                                            />
                                                            {pref.channels.sms !== undefined && (
                                                                <ChannelToggle 
                                                                    active={!!pref.channels.sms} 
                                                                    onClick={() => toggleChannel(cat.id, 'sms')} 
                                                                    icon={Smartphone} 
                                                                    label="SMS"
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <Switch 
                                                    checked={pref.enabled} 
                                                    onCheckedChange={() => toggleCategory(cat.id)} 
                                                />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {activeTab === 'channels' && (
                <div className="text-center py-12 text-muted-foreground animate-in fade-in zoom-in-95">
                    <div className="bg-muted/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Info className="w-8 h-8 opacity-50" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">Global Channel Rules</h3>
                    <p className="max-w-md mx-auto text-sm">
                        Configure default behaviors, quiet hours, and delivery digests for each channel (Email, SMS, Push). 
                        <br/><span className="text-xs mt-2 block opacity-70">(Coming in Phase 2)</span>
                    </p>
                </div>
            )}
        </div>
    );
}

function ChannelToggle({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button 
            onClick={onClick}
            className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium border transition-all",
                active 
                    ? "bg-primary/5 border-primary/20 text-primary" 
                    : "bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50"
            )}
            title={`Toggle ${label}`}
        >
            <Icon className="w-3 h-3" />
            {label}
        </button>
    );
}
