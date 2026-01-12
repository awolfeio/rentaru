
import { useState } from 'react';
import { Bell, HelpCircle } from 'lucide-react';
import { UtilityButton } from '@/app/layouts/UtilityButton';
import { NotificationPanel } from '@/app/layouts/NotificationPanel';

export function TenantUtilityBar() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    return (
        <div className="sticky top-0 z-40 w-full h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-end px-6 gap-3">
             
             {/* Notification & Help Actions */}
             <div className="flex items-center gap-3">
                <UtilityButton
                    icon={Bell}
                    badge={2}
                    title="Notifications"
                    onClick={() => setIsNotificationsOpen(true)}
                />

                <UtilityButton
                    icon={HelpCircle}
                    title="Help & Support"
                />
            </div>

            <NotificationPanel
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
            />
        </div>
    );
}
