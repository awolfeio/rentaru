
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { MainLayout } from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import Tenants from './pages/Tenants'
import Leases from './pages/Leases'
import Maintenance from './pages/Maintenance'
import Accounting from './pages/Accounting'
import Documents from './pages/Documents'
import Messages from './pages/Messages'
import Reports from './pages/Reports'
import Payments from './pages/Payments'
import SingleProperty from './pages/SingleProperty'

const Page = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, filter: 'blur(5px)' }}
    animate={{ opacity: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, filter: 'blur(5px)' }}
    transition={{ duration: 0.25, ease: "easeInOut" }}
    className="h-full" // Ensure it takes full height/width if needed
  >
    {children}
  </motion.div>
)

function AnimatedRoutes() {
  const location = useLocation()
  
  return (
    <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Page><Dashboard /></Page>} />
          <Route path="/properties" element={<Page><Properties /></Page>} />
          <Route path="/properties/:id" element={<Page><SingleProperty /></Page>} />
          <Route path="/tenants" element={<Page><Tenants /></Page>} />
          <Route path="/leases" element={<Page><Leases /></Page>} />
          <Route path="/maintenance" element={<Page><Maintenance /></Page>} />
          <Route path="/accounting" element={<Page><Accounting /></Page>} />
          <Route path="/documents" element={<Page><Documents /></Page>} />
          <Route path="/messages" element={<Page><Messages /></Page>} />
          <Route path="/reports" element={<Page><Reports /></Page>} />
          <Route path="/payments" element={<Page><Payments /></Page>} />
        </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <AnimatedRoutes />
      </MainLayout>
    </BrowserRouter>
  )
}

export default App
