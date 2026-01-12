import { useNavigate, useLocation } from 'react-router-dom';
import { Repeat } from 'lucide-react';

export function DevContextSwitcher() {
  // Only show in development
  if (!import.meta.env.DEV) return null;

  const navigate = useNavigate();
  const location = useLocation();

  const isTenant = location.pathname.startsWith('/tenant');
  
  const toggleContext = () => {
    if (isTenant) {
      navigate('/app');
    } else {
      navigate('/tenant');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999]">
      <button
        onClick={toggleContext}
        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-full shadow-lg border border-slate-700 hover:bg-slate-800 transition-all font-mono text-xs font-bold uppercase tracking-wider opacity-50 hover:opacity-100"
      >
        <Repeat size={14} />
        {isTenant ? 'Switch to App' : 'Switch to Tenant'}
      </button>
    </div>
  );
}
