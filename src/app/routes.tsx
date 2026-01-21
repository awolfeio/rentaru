import { Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import Dashboard from './pages/Dashboard';
import Properties from './pages/Properties';
import AddProperty from './pages/AddProperty';
import AddUnit from './pages/AddUnit';
import Tenants from './pages/Tenants';
import TenantProfile from './pages/TenantProfile';
import Leases from './pages/Leases';
import Maintenance from './pages/Maintenance';
import Accounting from './pages/Accounting';
import Documents from './pages/Documents';
import Messages from './pages/Messages';
import Reports from './pages/Reports';
import Payments from './pages/Payments';
import SingleProperty from './pages/SingleProperty';
import UnitDetails from './pages/UnitDetails';
import UsersPage from './pages/Users';

import SettingsLayout from './pages/settings/SettingsLayout';
import AccountSettings from './pages/settings/AccountSettings';
import BillingSettings from './pages/settings/BillingSettings';
import SecuritySettings from './pages/settings/SecuritySettings';
import PlaceholderSettings from './pages/settings/PlaceholderSettings';
import NotificationsSettings from './pages/settings/NotificationsSettings';

const Page = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(1px)', scale: 0.99 }}
    animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
    exit={{ opacity: 0, filter: 'blur(1px)', scale: 0.99 }}
    transition={{ duration: 0.25, ease: "easeOut" }}
    className="h-full"
  >
    {children}
  </motion.div>
)

export const appRoutes = (
  <>
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<Page><Dashboard /></Page>} />
    
    <Route path="properties" element={<Page><Properties /></Page>} />
    <Route path="properties/new" element={<Page><AddProperty /></Page>} />
    <Route path="properties/:id" element={<Page><SingleProperty /></Page>} />
    <Route path="properties/:propertyId/units/new" element={<Page><AddUnit /></Page>} />
    <Route path="properties/:propertyId/units/:unitId" element={<Page><UnitDetails /></Page>} />
    
    <Route path="tenants" element={<Page><Tenants /></Page>} />
    <Route path="tenants/:id" element={<Page><TenantProfile /></Page>} />
    
    <Route path="leases" element={<Page><Leases /></Page>} />
    <Route path="maintenance" element={<Page><Maintenance /></Page>} />
    <Route path="accounting" element={<Page><Accounting /></Page>} />
    <Route path="documents" element={<Page><Documents /></Page>} />
    <Route path="messages" element={<Page><Messages /></Page>} />
    <Route path="reports" element={<Page><Reports /></Page>} />
    <Route path="payments" element={<Page><Payments /></Page>} />
    <Route path="users" element={<Page><UsersPage /></Page>} />

    {/* Settings Routes */}
    <Route path="settings" element={<Page><SettingsLayout /></Page>}>
      <Route index element={<Navigate to="account" replace />} />
      <Route path="account" element={<AccountSettings />} />
      <Route path="billing" element={<BillingSettings />} />
      <Route path="security" element={<SecuritySettings />} />
      <Route path="notifications" element={<NotificationsSettings />} />
      <Route path="organization" element={<PlaceholderSettings title="Organization Profile" />} />
      <Route path="appearance" element={<PlaceholderSettings title="Appearance" />} />
    </Route>
  </>
);
