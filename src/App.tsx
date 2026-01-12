import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastProvider } from '@/shared/components/ui/Toast';

// Layouts
import { AppLayout } from '@/app/layouts/AppLayout';
import { TenantLayout } from '@/tenant/layouts/TenantLayout';

// Routes
import { appRoutes } from '@/app/routes';
import { tenantRoutes } from '@/tenant/routes';

// Pages
import LoginPage from '@/app/pages/LoginPage';

function TenantApp() {
    return (
        <TenantLayout>
             <Routes>
                {tenantRoutes}
             </Routes>
        </TenantLayout>
    );
}

function OperatorApp() {
    const location = useLocation();
    
    const getPageKey = (pathname: string) => {
        if (pathname.includes('/settings')) return 'settings';
        return pathname;
    };

    return (
        <AppLayout>
             <AnimatePresence mode="wait">
                 <Routes location={location} key={getPageKey(location.pathname)}>
                    {appRoutes}
                 </Routes>
             </AnimatePresence>
        </AppLayout>
    );
}

import { DevContextSwitcher } from '@/shared/components/DevContextSwitcher';

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <DevContextSwitcher />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/app/*" element={<OperatorApp />} />
          <Route path="/tenant/*" element={<TenantApp />} />
          
          <Route path="/" element={<Navigate to="/app" replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App;
