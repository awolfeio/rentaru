import { Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import TenantHome from './pages/Home';
import TenantPayments from './pages/Payments';
import TenantDocuments from './pages/Documents';
import TenantMaintenance from './pages/Maintenance';
import TenantUnit from './pages/Unit';
import TenantVehicles from './pages/Vehicles';
import TenantAmenities from './pages/Amenities';
import TenantMessages from './pages/Messages';
import TenantSettingsLayout from './pages/settings/SettingsLayout';
import AccountSettings from './pages/settings/AccountSettings';
import SecuritySettings from './pages/settings/SecuritySettings';
import NotificationsSettings from './pages/settings/NotificationsSettings';
import PaymentSettings from './pages/settings/PaymentSettings';
import DocumentsSettings from './pages/settings/DocumentsSettings';
import AppearanceSettings from './pages/settings/AppearanceSettings';

const Page = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 16 }}
    transition={{ duration: 0.2, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export const tenantRoutes = (
  <>
    <Route index element={<Navigate to="home" replace />} />
    <Route path="home" element={<Page><TenantHome /></Page>} />
    <Route path="payments" element={<Page><TenantPayments /></Page>} />
    <Route path="documents" element={<Page><TenantDocuments /></Page>} />
    <Route path="maintenance" element={<Page><TenantMaintenance /></Page>} />
    <Route path="unit" element={<Page><TenantUnit /></Page>} />
    <Route path="amenities" element={<Page><TenantAmenities /></Page>} />
    <Route path="vehicles" element={<Page><TenantVehicles /></Page>} />
    <Route path="messages" element={<Page><TenantMessages /></Page>} />
    <Route path="settings" element={<Page><TenantSettingsLayout /></Page>}>
      <Route index element={<Navigate to="account" replace />} />
      <Route path="account"       element={<AccountSettings />} />
      <Route path="security"      element={<SecuritySettings />} />
      <Route path="notifications" element={<NotificationsSettings />} />
      <Route path="payments"      element={<PaymentSettings />} />
      <Route path="documents"     element={<DocumentsSettings />} />
      <Route path="appearance"    element={<AppearanceSettings />} />
    </Route>
  </>
);
