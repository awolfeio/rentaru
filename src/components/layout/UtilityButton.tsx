import React from 'react';
import { cn } from '@/lib/utils';

interface UtilityButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon: React.ElementType;
    badge?: string | number;
}

export function UtilityButton({ icon: Icon, badge, className, ...props }: UtilityButtonProps) {
    return (
        <button
            className={cn(
                "relative p-2 rounded-full hover:bg-muted transition-colors duration-200 text-muted-foreground hover:text-foreground",
                className
            )}
            {...props}
        >
            <Icon className="w-5 h-5" />
            {badge !== undefined && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-primary text-[10px] font-bold text-white rounded-full flex items-center justify-center ring-2 ring-background translate-x-[6px]">
                    {badge}
                </span>
            )}
        </button>
    );
}
