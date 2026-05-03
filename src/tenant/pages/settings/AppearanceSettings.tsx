
import { useState } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { Switch } from '@/shared/components/ui/Switch';
import { cn } from '@/shared/lib/utils';
import { useToast } from '@/shared/components/ui/Toast';

type Theme = 'light' | 'dark' | 'system';

const THEMES: { value: Theme; label: string; icon: any; description: string }[] = [
    { value: 'light',  label: 'Light',  icon: Sun,     description: 'Always use the light theme.' },
    { value: 'dark',   label: 'Dark',   icon: Moon,    description: 'Always use the dark theme.' },
    { value: 'system', label: 'System', icon: Monitor, description: 'Match your device preference.' },
];

export default function AppearanceSettings() {
    const { toast } = useToast();
    const [theme, setTheme] = useState<Theme>('system');
    const [reduceMotion, setReduceMotion] = useState(false);
    const [largerText, setLargerText] = useState(false);

    const handleSave = () => {
        toast({ type: 'success', title: 'Appearance Saved', message: 'Your display preferences have been updated.' });
    };

    return (
        <div className="space-y-6 max-w-2xl">
            <div>
                <h2 className="text-lg font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">Customize how the app looks and feels.</p>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Theme */}
            <div>
                <h3 className="font-medium mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-3">
                    {THEMES.map(({ value, label, icon: Icon, description }) => (
                        <button
                            key={value}
                            onClick={() => setTheme(value)}
                            className={cn(
                                'flex flex-col items-center gap-3 p-5 border rounded-xl transition-all text-center',
                                theme === value
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-border hover:bg-muted/30',
                            )}
                        >
                            <div className={cn(
                                'p-3 rounded-lg',
                                theme === value ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground',
                            )}>
                                <Icon size={20} />
                            </div>
                            <div>
                                <p className={cn('text-sm font-medium', theme === value && 'text-primary')}>{label}</p>
                                <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="w-full h-px bg-border" />

            {/* Accessibility */}
            <div className="space-y-5">
                <h3 className="font-medium">Accessibility</h3>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Reduce Motion</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Minimizes animations and transitions throughout the app.</p>
                    </div>
                    <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} />
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium">Larger Text</p>
                        <p className="text-xs text-muted-foreground mt-0.5">Increases base font size for easier reading.</p>
                    </div>
                    <Switch checked={largerText} onCheckedChange={setLargerText} />
                </div>
            </div>

            <div className="pt-2">
                <button
                    onClick={handleSave}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    Save Preferences
                </button>
            </div>
        </div>
    );
}
