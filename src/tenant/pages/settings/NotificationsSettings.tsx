
import { useState } from 'react';
import { Bell, Mail, Smartphone, Lock, Info } from 'lucide-react';
import { Switch } from '@/shared/components/ui/Switch';
import { cn } from '@/shared/lib/utils';

type Channel = 'email' | 'sms' | 'in_app';

interface NotifRow {
    id: string;
    label: string;
    description: string;
    required?: boolean;
    channels: { email: boolean; sms: boolean; in_app: boolean };
    enabled: boolean;
}

const INITIAL_PREFS: NotifRow[] = [
    // Payments
    { id: 'rent_reminder',   label: 'Rent Reminders',          description: 'Upcoming rent due date reminders.',                     enabled: true,  channels: { email: true,  sms: true,  in_app: true  } },
    { id: 'payment_confirm', label: 'Payment Confirmations',   description: 'Receipt when your payment is processed.',               enabled: true,  channels: { email: true,  sms: false, in_app: true  } },
    { id: 'failed_payment',  label: 'Failed Payment Alerts',   description: 'Critical alerts when a payment does not go through.',   enabled: true,  required: true, channels: { email: true, sms: true, in_app: true } },
    // Maintenance
    { id: 'maint_update',    label: 'Maintenance Updates',     description: 'Status changes on your maintenance requests.',          enabled: true,  channels: { email: true,  sms: true,  in_app: true  } },
    // Messages
    { id: 'mgr_message',     label: 'Manager Messages',        description: 'New messages from your property manager.',              enabled: true,  channels: { email: true,  sms: true,  in_app: true  } },
    // Lease
    { id: 'lease_doc',       label: 'Lease & Document Updates',description: 'Lease renewals, new documents, and signature requests.',enabled: true,  channels: { email: true,  sms: false, in_app: true  } },
    { id: 'announcement',    label: 'Property Announcements',  description: 'Building-wide notices from your property.',             enabled: true,  channels: { email: true,  sms: false, in_app: true  } },
    // Required
    { id: 'entry_notice',    label: 'Entry & Inspection Notices', description: 'Required notice when staff need to enter your unit.',enabled: true,  required: true, channels: { email: true, sms: true, in_app: true } },
    { id: 'security_alert',  label: 'Security Alerts',         description: 'Account security events and login alerts.',             enabled: true,  required: true, channels: { email: true, sms: true, in_app: true } },
];

function ChannelToggle({ active, onClick, icon: Icon, label, disabled }: {
    active: boolean; onClick: () => void; icon: any; label: string; disabled?: boolean;
}) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={cn(
                'flex items-center gap-1.5 px-2 py-1 rounded text-[10px] font-medium border transition-all',
                disabled
                    ? 'bg-muted/20 border-transparent text-muted-foreground/50 cursor-not-allowed'
                    : active
                        ? 'bg-primary/5 border-primary/20 text-primary'
                        : 'bg-muted/30 border-transparent text-muted-foreground hover:bg-muted/50',
            )}
        >
            <Icon className="w-3 h-3" />
            {label}
        </button>
    );
}

export default function TenantNotificationsSettings() {
    const [paused, setPaused] = useState(false);
    const [prefs, setPrefs] = useState<NotifRow[]>(INITIAL_PREFS);

    const toggle = (id: string) =>
        setPrefs(prev => prev.map(p => p.id === id && !p.required ? { ...p, enabled: !p.enabled } : p));

    const toggleChannel = (id: string, ch: Channel) =>
        setPrefs(prev => prev.map(p =>
            p.id === id && !p.required ? { ...p, channels: { ...p.channels, [ch]: !p.channels[ch] } } : p
        ));

    return (
        <div className="max-w-2xl space-y-6">
            <div>
                <h2 className="text-lg font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Choose how you receive rent reminders, maintenance updates, and messages.</p>
            </div>

            {/* Pause all */}
            <div className="bg-muted/30 p-4 rounded-lg border flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-background rounded-md border">
                        <Bell className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                        <div className="font-medium text-sm">Pause All Notifications</div>
                        <div className="text-xs text-muted-foreground">Temporarily silence all non-required alerts</div>
                    </div>
                </div>
                <Switch checked={paused} onCheckedChange={setPaused} />
            </div>

            {/* Required notice explanation */}
            <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/40 border text-xs text-muted-foreground">
                <Info size={14} className="shrink-0 mt-0.5" />
                Some notifications are required by law or for your account security and cannot be turned off.
            </div>

            {/* Notification rows */}
            <div className="space-y-3">
                {prefs.map(row => (
                    <div
                        key={row.id}
                        className={cn(
                            'flex items-start justify-between p-4 border rounded-lg transition-colors',
                            row.required
                                ? 'bg-muted/20 border-border/60'
                                : 'bg-card border-border hover:border-border/80',
                        )}
                    >
                        <div className="flex-1 mr-4">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{row.label}</span>
                                {row.required && (
                                    <span className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-muted-foreground px-1.5 py-0.5 rounded">
                                        <Lock size={9} /> Required
                                    </span>
                                )}
                                {!row.required && !row.enabled && (
                                    <span className="text-[10px] bg-muted text-muted-foreground px-1.5 rounded">OFF</span>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{row.description}</p>

                            {(row.enabled || row.required) && (
                                <div className="flex items-center gap-3 mt-3">
                                    <ChannelToggle active={row.channels.email}  onClick={() => toggleChannel(row.id, 'email')}  icon={Mail}        label="Email"  disabled={row.required} />
                                    <ChannelToggle active={row.channels.sms}    onClick={() => toggleChannel(row.id, 'sms')}    icon={Smartphone}  label="SMS"    disabled={row.required} />
                                    <ChannelToggle active={row.channels.in_app} onClick={() => toggleChannel(row.id, 'in_app')} icon={Bell}        label="In-App" disabled={row.required} />
                                </div>
                            )}
                        </div>
                        <Switch
                            checked={row.enabled}
                            onCheckedChange={() => toggle(row.id)}
                            disabled={row.required}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
