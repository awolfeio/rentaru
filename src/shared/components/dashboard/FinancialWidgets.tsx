import { useState } from 'react';
import { cn } from '@/shared/lib/utils';
import { motion } from 'framer-motion';

type TimeRange = '1M' | '3M' | '6M' | 'YTD';

const RANGES: TimeRange[] = ['1M', '3M', '6M', 'YTD'];

export function TimeRangeToggle({
    value = '3M',
    onChange
}: {
    value?: string,
    onChange?: (val: TimeRange) => void
}) {
    const [selected, setSelected] = useState<TimeRange>((value as TimeRange) || '3M');

    const handleSelect = (range: TimeRange) => {
        setSelected(range);
        if (onChange) onChange(range);
    };

    return (
        <div className="flex gap-1 bg-muted p-1 rounded-lg">
            {RANGES.map((range) => (
                <button
                    key={range}
                    onClick={() => handleSelect(range)}
                    className={cn(
                        "relative px-3 py-1 rounded-md text-xs font-medium transition-colors z-10",
                        selected === range
                            ? "text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                    )}
                >
                    {selected === range && (
                        <motion.div
                            layoutId="time-range-indicator"
                            className="absolute inset-0 bg-primary rounded-md shadow-sm -z-10"
                            transition={{ type: "spring", bounce: 0.15, duration: 0.3 }}
                        />
                    )}
                    {range}
                </button>
            ))}
        </div>
    );
}

export function PlaceholderChart({ height = '200px' }: { height?: string }) {
    return (
        <div className={`flex-1 bg-muted/30 rounded-lg border border-dashed border-border flex items-center justify-center relative overflow-hidden group w-full`} style={{ minHeight: height }}>
            <div className="absolute inset-x-0 bottom-0 top-8 flex items-end justify-between px-8 pb-4 opacity-40">
                {/* Fake bars */}
                {[40, 65, 45, 80, 55, 70, 90, 60, 75, 50, 85, 95].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} className="w-full mx-1 bg-primary rounded-t-sm opacity-80" />
                ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent pointer-events-none" />
            <span className="text-muted-foreground font-medium z-10 bg-card/80 px-3 py-1 rounded-full shadow-sm backdrop-blur-sm border text-xs"> Interactive Financial Chart</span>
        </div>
    );
}
