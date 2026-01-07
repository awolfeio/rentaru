import { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export function GlobalSearch() {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                inputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    return (
        <div className="relative group flex items-center">
            <div className={cn(
                "relative flex items-center transition-all duration-300 ease-out h-9 rounded-full px-3 gap-2 border bg-muted/30 hover:bg-muted/50",
                isFocused ? "w-64 border-primary ring-2 ring-primary/20 bg-background" : "w-48 border-transparent"
            )}>
                <Search className={cn(
                    "w-4 h-4 transition-colors duration-200",
                    isFocused ? "text-primary" : "text-muted-foreground"
                )} />
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Search... (⌘K)"
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="bg-transparent border-none outline-none text-sm w-full placeholder:text-muted-foreground/50"
                />
                <AnimatePresence>
                    {!isFocused && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-medium text-muted-foreground pointer-events-none"
                        >
                            ⌘K
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
