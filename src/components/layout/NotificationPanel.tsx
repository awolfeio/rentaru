import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, CheckCircle2, AlertCircle, Clock, Info, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type NotificationPriority = 'high' | 'medium' | 'low';
export type NotificationType = 'payment' | 'maintenance' | 'lease' | 'message' | 'property' | 'system';

interface NotificationAction {
    label: string;
    deepLink: string;
}

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    description?: string;
    priority: NotificationPriority;
    isRead: boolean;
    createdAt: string;
    action?: NotificationAction;
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'payment',
        title: 'Rent payment received',
        description: 'Unit 4B - John Smith has paid $2,400 for January rent.',
        priority: 'high',
        isRead: false,
        createdAt: '2 mins ago',
        action: { label: 'View Transaction', deepLink: '/accounting' }
    },
    {
        id: '2',
        type: 'maintenance',
        title: 'New maintenance request',
        description: 'Unit 12A - Leaking faucet in master bathroom.',
        priority: 'high',
        isRead: false,
        createdAt: '15 mins ago',
        action: { label: 'Assign Vendor', deepLink: '/maintenance' }
    },
    {
        id: '3',
        type: 'lease',
        title: 'Lease expiring soon',
        description: 'Unit 7C - Sarah Johnson\'s lease expires in 30 days.',
        priority: 'medium',
        isRead: false,
        createdAt: '2 hours ago',
        action: { label: 'Renew Lease', deepLink: '/leases' }
    },
    {
        id: '4',
        type: 'message',
        title: 'New message from tenant',
        description: 'Mike Miller: "Hi, I sent the signed parking agreement."',
        priority: 'medium',
        isRead: true,
        createdAt: '5 hours ago',
        action: { label: 'Reply', deepLink: '/messages' }
    },
    {
        id: '5',
        type: 'system',
        title: 'Integration connected',
        description: 'Stripe account successfully connected for Rentiru.',
        priority: 'low',
        isRead: true,
        createdAt: '1 day ago',
    }
];

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const clearNotification = (id: string) => {
        setNotifications((prev: Notification[]) => prev.filter(n => n.id !== id));
    };

    const markAllRead = () => {
        setNotifications((prev: Notification[]) => prev.map(n => ({ ...n, isRead: true })));
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-[100]"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        ref={panelRef}
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed right-0 top-0 h-screen w-full max-w-[420px] bg-background border-l border-border shadow-2xl z-[101] flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Bell className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold leading-none">Notifications</h2>
                                    <p className="text-xs text-muted-foreground mt-1">You have {notifications.filter((n: Notification) => !n.isRead).length} unread events</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
                            <AnimatePresence initial={false}>
                                {notifications.length > 0 ? (
                                    notifications.map((notification: Notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onClear={() => clearNotification(notification.id)}
                                        />
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-50">
                                        <Bell className="w-12 h-12 mb-4 text-muted-foreground/20" />
                                        <p className="text-sm font-medium">All caught up!</p>
                                        <p className="text-xs text-muted-foreground">No new notifications at this time.</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        <div className="p-4 border-t border-border bg-muted/10">
                            <button
                                onClick={markAllRead}
                                className="w-full py-2 text-sm font-medium text-primary hover:bg-primary/5 rounded-lg transition-colors"
                            >
                                Mark all as read
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}

function NotificationItem({ notification, onClear }: { notification: Notification; onClear: () => void }) {
    const Icon = getIcon(notification.type);
    const priorityColor = getPriorityColor(notification.priority);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
                "group relative p-4 rounded-xl border transition-all duration-200",
                notification.isRead ? "bg-background border-border" : "bg-primary/5 border-primary/10 shadow-sm"
            )}
        >
            {!notification.isRead && (
                <div className="absolute top-3 left-3 w-2 h-2 rounded-full bg-primary z-10" />
            )}

            <div className="flex gap-4">
                <div className={cn("mt-0.5 p-2 rounded-lg h-fit", getCategoryBg(notification.type))}>
                    <Icon className={cn("w-4 h-4", getCategoryColor(notification.type))} />
                </div>

                <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                        <span className={cn("text-[10px] font-bold uppercase tracking-wider", priorityColor)}>
                            {notification.priority} Priority
                        </span>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {notification.createdAt}
                            </span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onClear();
                                }}
                                className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-all translate-x-[2px]"
                                title="Clear notification"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    </div>

                    <h3 className="text-sm font-semibold text-foreground leading-tight">
                        {notification.title}
                    </h3>

                    {notification.description && (
                        <p className="text-xs text-muted-foreground leading-normal">
                            {notification.description}
                        </p>
                    )}

                    {notification.action && (
                        <div className="pt-2">
                            <a
                                href={notification.action.deepLink}
                                className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline group/link"
                            >
                                {notification.action.label}
                                <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function getIcon(type: NotificationType) {
    switch (type) {
        case 'payment': return CheckCircle2;
        case 'maintenance': return AlertCircle;
        case 'lease': return Clock;
        case 'message': return Info;
        case 'property': return Bell;
        default: return Bell;
    }
}

function getCategoryColor(type: NotificationType) {
    switch (type) {
        case 'payment': return "text-emerald-500";
        case 'maintenance': return "text-amber-500";
        case 'lease': return "text-blue-500";
        case 'message': return "text-indigo-500";
        case 'property': return "text-purple-500";
        default: return "text-gray-500";
    }
}

function getCategoryBg(type: NotificationType) {
    switch (type) {
        case 'payment': return "bg-emerald-500/10";
        case 'maintenance': return "bg-amber-500/10";
        case 'lease': return "bg-blue-500/10";
        case 'message': return "bg-indigo-500/10";
        case 'property': return "bg-purple-500/10";
        default: return "bg-gray-500/10";
    }
}

function getPriorityColor(priority: NotificationPriority) {
    switch (priority) {
        case 'high': return "text-red-500";
        case 'medium': return "text-amber-500";
        case 'low': return "text-muted-foreground";
    }
}
