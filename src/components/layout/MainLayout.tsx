import { Sidebar } from './Sidebar';
import { GlobalUtilityBar } from './GlobalUtilityBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background font-sans antialiased text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden pl-64">
        <GlobalUtilityBar />
        <main className="flex-1 overflow-y-auto bg-muted/20">
          <div className="container mx-auto p-8 max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
