import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    CreditCard,
    ShieldCheck,
    LogOut,
    ChevronDown,
    Building,
    ArrowLeftRight
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';

export function AccountMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigate = (path: string) => {
        setIsOpen(false);
        navigate(path);
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: 10, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20,
                staggerChildren: 0.05
            }
        },
        exit: { opacity: 0, y: 10, scale: 0.95, transition: { duration: 0.2 } }
    } as const;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-all duration-200 group"
            >
                <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center overflow-hidden">
                    <span className="text-primary font-bold text-xs">J</span>
                </div>
                <ChevronDown className={cn(
                    "w-4 h-4 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180"
                )} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute right-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                        {/* Identity Section */}
                        <div className="p-4 border-b border-border bg-muted/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold text-lg">
                                    J
                                </div>
                                <div>
                                    <p className="text-sm font-semibold">John Doe</p>
                                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">john.doe@example.com</p>
                                    <span className="inline-flex mt-1 px-2 py-0.5 rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase">
                                        Admin
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="py-2">
                            {/* Organization Section */}
                            <div className="px-2 py-1">
                                <p className="px-3 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Organization</p>
                                <div className="mt-1 space-y-1">
                                    <MenuButton icon={Building} label="Skyline Properties" active />
                                    <MenuButton icon={ArrowLeftRight} label="Switch Organization" />
                                </div>
                            </div>

                            <div className="my-1 border-t border-border mx-2" />

                            {/* Account Settings */}
                            <div className="px-2 py-1">
                                <div className="space-y-1">
                                    <MenuButton icon={Settings} label="Account Settings" onClick={() => handleNavigate('/app/settings/account')} />
                                    <MenuButton icon={CreditCard} label="Billing & Plan" onClick={() => handleNavigate('/app/settings/billing')} />
                                    <MenuButton icon={ShieldCheck} label="Security & Compliance" onClick={() => handleNavigate('/app/settings/security')} />
                                </div>
                            </div>

                            <div className="my-1 border-t border-border mx-2" />

                            {/* Legal & Exit */}
                            <div className="px-2 py-1">
                                <div className="space-y-1">
                                    <MenuButton icon={LogOut} label="Sign Out" variant="destructive" onClick={() => handleNavigate('/login')} />
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

interface MenuButtonProps {
    icon: React.ElementType;
    label: string;
    active?: boolean;
    variant?: 'default' | 'destructive';
    onClick?: () => void;
}

function MenuButton({ icon: Icon, label, active, variant = 'default', onClick }: MenuButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                variant === 'destructive'
                    ? "text-red-500 hover:bg-red-50"
                    : active
                        ? "bg-primary/5 text-primary font-medium"
                        : "text-foreground/70 hover:bg-muted hover:text-foreground"
            )}>
            <Icon className={cn("w-4 h-4", active ? "text-primary" : "text-current opacity-70")} />
            <span className="flex-1 text-left">{label}</span>
            {active && <div className="w-1 h-1 rounded-full bg-primary" />}
        </button>
    );
}
