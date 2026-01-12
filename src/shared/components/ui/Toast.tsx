import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, X, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { createPortal } from 'react-dom';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
}

interface ToastContextType {
    toast: (props: Omit<Toast, 'id'>) => void;
    success: (title: string, message?: string) => void;
    error: (title: string, message?: string) => void;
    info: (title: string, message?: string) => void;
    warning: (title: string, message?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((props: Omit<Toast, 'id'>) => {
        const id = Math.random().toString(36).substring(7);
        setToasts((prev) => [...prev, { ...props, id }]);

        // Auto dismiss
        setTimeout(() => {
            removeToast(id);
        }, 4000);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const success = (title: string, message?: string) => addToast({ type: 'success', title, message });
    const error = (title: string, message?: string) => addToast({ type: 'error', title, message });
    const info = (title: string, message?: string) => addToast({ type: 'info', title, message });
    const warning = (title: string, message?: string) => addToast({ type: 'warning', title, message });

    return (
        <ToastContext.Provider value={{ toast: addToast, success, error, info, warning }}>
            {children}
            {createPortal(
                <div className="fixed bottom-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
                    <AnimatePresence mode="popLayout">
                        {toasts.map((toast) => (
                            <ToastItem key={toast.id} toast={toast} onDismiss={() => removeToast(toast.id)} />
                        ))}
                    </AnimatePresence>
                </div>,
                document.body
            )}
        </ToastContext.Provider>
    );
}

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
    const colors = {
        success: "bg-background border-emerald-500/20 text-foreground",
        error: "bg-background border-rose-500/20 text-foreground",
        info: "bg-background border-blue-500/20 text-foreground",
        warning: "bg-background border-amber-500/20 text-foreground",
    };

    const icons = {
        success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
        error: <AlertCircle className="w-5 h-5 text-rose-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
        warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
                "pointer-events-auto min-w-[320px] max-w-[420px] p-4 rounded-xl border shadow-lg flex items-start gap-3 backdrop-blur-sm",
                colors[toast.type]
            )}
        >
            <div className="mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1">
                <h3 className="font-semibold text-sm">{toast.title}</h3>
                {toast.message && <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{toast.message}</p>}
            </div>
            <button
                onClick={onDismiss}
                className="text-muted-foreground hover:text-foreground transition-colors"
            >
                <X size={16} />
            </button>
        </motion.div>
    );
}
