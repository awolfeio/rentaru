import { useState } from 'react';
import { Bell, HelpCircle } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';
import { UtilityButton } from './UtilityButton';
import { AccountMenu } from './AccountMenu';
import { NotificationPanel } from './NotificationPanel';

export function GlobalUtilityBar() {
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

    return (
        <div className="sticky top-0 z-40 w-full h-14 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-end px-6 gap-3">
            <GlobalSearch />

            <div className="h-6 w-[1px] bg-border mx-1" />

            <UtilityButton
                icon={Bell}
                badge={3}
                title="Notifications"
                onClick={() => setIsNotificationsOpen(true)}
            />

            <UtilityButton
                icon={HelpCircle}
                title="Help & Support"
            />

            <div className="h-6 w-[1px] bg-border mx-1" />

            <AccountMenu />

            <NotificationPanel
                isOpen={isNotificationsOpen}
                onClose={() => setIsNotificationsOpen(false)}
            />
        </div>
    );
}
