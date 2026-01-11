import { motion, AnimatePresence } from 'framer-motion';
import { 
    X, Bell, Clock, ExternalLink, 
    CreditCard, Wrench, FileText, User, 
    MessageSquare, AlertTriangle, CheckCircle2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type NotificationPriority = 'success' | 'high' | 'medium' | 'low' | 'info';

export type NotificationType = 
   // Financial
   | "rent_payment_received"
   | "rent_payment_failed"
   | "refund_issued"
   // Maintenance
   | "maintenance_request_created"
   | "maintenance_priority_escalated"
   | "maintenance_completed"
   | "vendor_assigned"
   // Lease
   | "lease_expiring"
   | "lease_signed"
   | "lease_renewed"
   | "lease_terminated"
   // Onboarding
   | "application_submitted"
   | "background_check_completed"
   | "application_approved"
   | "application_denied"
   // Communication
   | "message_received"
   | "document_uploaded"
   // System
   | "system_alert"
   | "permission_changed";

export interface NotificationAction {
    label: string;
    deepLink?: string;
    actionType?: string;
}

export interface Notification {
    id: string;
    type: NotificationType;
    priority: NotificationPriority;
    title: string;
    description: string;
    isRead: boolean;
    createdAt: string;
    actions?: NotificationAction[];
}

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        type: 'rent_payment_received',
        priority: 'success',
        title: 'Rent payment received',
        description: 'Unit 4B - John Smith has paid $2,400 for January rent.',
        isRead: false,
        createdAt: '2 mins ago',
        actions: [{ label: 'View Transaction', deepLink: '/accounting' }]
    },
    {
        id: '2',
        type: 'maintenance_request_created',
        priority: 'high',
        title: 'Urgent maintenance request',
        description: 'Unit 12A - Active water leak reported in master bath.',
        isRead: false,
        createdAt: '15 mins ago',
        actions: [{ label: 'Assign Vendor', deepLink: '/maintenance' }]
    },
    {
        id: '3',
        type: 'lease_expiring',
        priority: 'medium',
        title: 'Lease expiring soon',
        description: 'Unit 7C - Sarah Johnson\'s lease expires in 30 days.',
        isRead: false,
        createdAt: '2 hours ago',
        actions: [{ label: 'Start Renewal', deepLink: '/leases' }]
    },
    {
        id: '4',
        type: 'message_received',
        priority: 'medium',
        title: 'New message from tenant',
        description: 'Mike Miller: "Hi, I sent the signed parking agreement."',
        isRead: true,
        createdAt: '5 hours ago',
        actions: [{ label: 'Reply', deepLink: '/messages' }]
    },
    {
        id: '5',
        type: 'system_alert',
        priority: 'low',
        title: 'System Update',
        description: 'Rentaru Platform v2.1.0 has been deployed successfully.',
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
    const priorityBg = getPriorityBg(notification.priority);

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
                <div className={cn("mt-0.5 p-2 rounded-lg h-fit", priorityBg)}>
                    <Icon className={cn("w-4 h-4", priorityColor)} />
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className={cn("text-sm font-semibold leading-tight pr-4", priorityColor)}>
                            {notification.title}
                        </h3>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClear();
                            }}
                            className="p-1 rounded-md hover:bg-muted text-muted-foreground transition-all shrink-0"
                            title="Clear notification"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>

                    {notification.description && (
                        <p className="text-xs text-muted-foreground leading-normal mt-1">
                            {notification.description}
                        </p>
                    )}

                    <div className="mt-3 flex items-end justify-between gap-4">
                        <div className="flex flex-wrap gap-2">
                            {notification.actions && notification.actions.map((action, idx) => (
                                <a
                                    key={idx}
                                    href={action.deepLink}
                                    className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-primary/5 hover:bg-primary/10 text-xs font-medium text-primary transition-colors group/link"
                                >
                                    {action.label}
                                    <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                </a>
                            ))}
                        </div>

                        <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0 pb-1">
                            <Clock className="w-3 h-3" />
                            {getTimeAgo(notification.createdAt)}
                        </span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

// Helper to keep 'createdAt' display simple or use the string as is if it's "2 mins ago"
function getTimeAgo(dateString: string) {
    return dateString;
}

function getIcon(type: NotificationType) {
    // Specific overrides
    if (type === 'lease_expiring') return Clock;
    
    // Category mapping
    if (type.startsWith('rent') || type === 'refund_issued') return CreditCard;
    if (type.startsWith('maintenance') || type === 'vendor_assigned') return Wrench;
    if (type.startsWith('lease')) return FileText;
    if (type.startsWith('application') || type === 'background_check_completed') return User;
    if (type === 'message_received') return MessageSquare;
    if (type === 'document_uploaded') return FileText;
    if (type === 'system_alert') return AlertTriangle;
    
    return Bell; // Default
}

function getPriorityColor(priority: NotificationPriority) {
    switch (priority) {
        case 'success': return "text-emerald-600 dark:text-emerald-400";
        case 'high': return "text-rose-600 dark:text-rose-400";
        case 'medium': return "text-amber-600 dark:text-amber-400";
        case 'info': return "text-blue-600 dark:text-blue-400";
        case 'low': return "text-slate-500 dark:text-slate-400";
        default: return "text-slate-500";
    }
}

function getPriorityBg(priority: NotificationPriority) {
    switch (priority) {
        case 'success': return "bg-emerald-500/10";
        case 'high': return "bg-rose-500/10";
        case 'medium': return "bg-amber-500/10";
        case 'info': return "bg-blue-500/10";
        case 'low': return "bg-slate-500/10";
        default: return "bg-slate-500/10";
    }
}
