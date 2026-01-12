export default function PlaceholderSettings({ title }: { title: string }) {
    return (
        <div className="flex flex-col items-center justify-center h-[400px] text-center space-y-4">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
                <span className="text-2xl font-bold">?</span>
            </div>
            <div>
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    This settings page is currently under development and will be available soon.
                </p>
            </div>
        </div>
    );
}
