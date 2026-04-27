import React, { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown, Check, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface FilterDropdownProps {
  label: string;
  options: { value: string; label: string }[];
  selected: string[];
  onChange: (next: string[]) => void;
}

export const FilterDropdown = ({ label, options, selected, onChange }: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (val: string) =>
    onChange(selected.includes(val) ? selected.filter(v => v !== val) : [...selected, val]);

  const hasActive = selected.length > 0;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className={cn(
          "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors",
          hasActive
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
        )}
      >
        <Filter size={13} />
        {label}
        {hasActive && (
          <span className="ml-0.5 flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-[10px] font-bold">
            {selected.length}
          </span>
        )}
        <ChevronDown size={13} className={cn("transition-transform duration-150", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full mt-1.5 z-30 min-w-[170px] bg-card border rounded-xl shadow-lg py-1.5 overflow-hidden"
          >
            {options.map(opt => {
              const checked = selected.includes(opt.value);
              return (
                <button
                  key={opt.value}
                  onClick={() => toggle(opt.value)}
                  className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left"
                >
                  <span className={cn(
                    "flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-colors",
                    checked
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border bg-background"
                  )}>
                    {checked && <Check size={10} strokeWidth={3} />}
                  </span>
                  <span className={cn("font-medium", checked ? "text-foreground" : "text-muted-foreground")}>
                    {opt.label}
                  </span>
                </button>
              );
            })}
            {selected.length > 0 && (
              <>
                <div className="h-px bg-border mx-3 my-1" />
                <button
                  onClick={() => onChange([])}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-muted-foreground hover:text-rose-500 transition-colors"
                >
                  <X size={11} /> Clear
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
