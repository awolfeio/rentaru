
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MainLayout } from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import AddProperty from './pages/AddProperty'
import AddUnit from './pages/AddUnit'
import Tenants from './pages/Tenants'
import Leases from './pages/Leases'
import Maintenance from './pages/Maintenance'
import Accounting from './pages/Accounting'
import Documents from './pages/Documents'
import Messages from './pages/Messages'
import Reports from './pages/Reports'
import Payments from './pages/Payments'
import SingleProperty from './pages/SingleProperty'
import { ToastProvider } from './components/ui/Toast'

import SettingsLayout from './pages/settings/SettingsLayout';
import AccountSettings from './pages/settings/AccountSettings';
import BillingSettings from './pages/settings/BillingSettings';
import SecuritySettings from './pages/settings/SecuritySettings';
import PlaceholderSettings from './pages/settings/PlaceholderSettings';
import LoginPage from './pages/LoginPage';

const Page = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(5px)' }}
    animate={{ opacity: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, filter: 'blur(5px)' }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
    className="h-full"
  >
    {children}
  </motion.div>
)

function AnimatedRoutes() {
  const location = useLocation()

  const getPageKey = (pathname: string) => {
    if (pathname.startsWith('/settings')) return '/settings';
    return pathname;
  };

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={getPageKey(location.pathname)}>
        <Route path="/" element={<Page><Dashboard /></Page>} />
        {/* ... existing routes ... */}
        <Route path="/properties" element={<Page><Properties /></Page>} />
        <Route path="/properties/new" element={<Page><AddProperty /></Page>} />
        <Route path="/properties/:id" element={<Page><SingleProperty /></Page>} />
        <Route path="/properties/:propertyId/units/new" element={<Page><AddUnit /></Page>} />
        <Route path="/tenants" element={<Page><Tenants /></Page>} />
        <Route path="/leases" element={<Page><Leases /></Page>} />
        <Route path="/maintenance" element={<Page><Maintenance /></Page>} />
        <Route path="/accounting" element={<Page><Accounting /></Page>} />
        <Route path="/documents" element={<Page><Documents /></Page>} />
        <Route path="/messages" element={<Page><Messages /></Page>} />
        <Route path="/reports" element={<Page><Reports /></Page>} />
        <Route path="/payments" element={<Page><Payments /></Page>} />

        {/* Settings Routes */}
        <Route path="/settings" element={<Page><SettingsLayout /></Page>}>
          <Route index element={<Navigate to="account" replace />} />
          <Route path="account" element={<AccountSettings />} />
          <Route path="billing" element={<BillingSettings />} />
          <Route path="security" element={<SecuritySettings />} />
          <Route path="notifications" element={<PlaceholderSettings title="Notifications" />} />
          <Route path="organization" element={<PlaceholderSettings title="Organization Profile" />} />
          <Route path="appearance" element={<PlaceholderSettings title="Appearance" />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/*" element={
            <MainLayout>
              <AnimatedRoutes />
            </MainLayout>
          } />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  )
}

export default App
