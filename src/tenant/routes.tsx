import { Route, Navigate } from 'react-router-dom';
import TenantHome from './pages/Home';
import TenantPayments from './pages/Payments';
import TenantDocuments from './pages/Documents';
import TenantMaintenance from './pages/Maintenance';

export const tenantRoutes = (
  <>
    <Route index element={<Navigate to="home" replace />} />
    <Route path="home" element={<TenantHome />} />
    <Route path="payments" element={<TenantPayments />} />
    <Route path="documents" element={<TenantDocuments />} />
    <Route path="maintenance" element={<TenantMaintenance />} />
  </>
);
