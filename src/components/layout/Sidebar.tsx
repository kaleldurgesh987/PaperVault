import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UploadCloud, 
  FileText, 
  QrCode, 
  ShieldAlert, 
  Receipt, 
  ScanLine, 
  Printer, 
  Store, 
  Sliders,
  ChevronRight,
  ShieldCheck,
  AlertOctagon
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/dbService';

interface SidebarLink {
  to: string;
  label: string;
  icon: React.ReactNode;
  badge?: string | number;
  badgeColor?: string;
}

export const Sidebar: React.FC = () => {
  const { role, user } = useAuth();
  
  // Real stats for badges
  const requests = db.getPrintRequests();
  const customerRequestsCount = requests.filter(r => r.customer_id === user?.id).length;
  const awaitingConsentCount = requests.filter(r => r.status === 'AWAITING_APPROVAL').length;
  const pendingQueueCount = requests.filter(r => r.status === 'PENDING' || r.status === 'ACCEPTED').length;

  const customerLinks: SidebarLink[] = [
    { to: '/customer', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { to: '/customer/upload', label: 'Upload & AI Scan', icon: <UploadCloud size={18} /> },
    { to: '/customer/requests', label: 'Print Requests', icon: <FileText size={18} />, badge: customerRequestsCount },
    { to: '/customer/shares', label: 'Active Shares & Consent', icon: <QrCode size={18} />, badge: awaitingConsentCount > 0 ? `${awaitingConsentCount} Req` : undefined, badgeColor: 'bg-amber-500' },
    { to: '/customer/privacy', label: 'Privacy Center & Kill Switch', icon: <ShieldAlert size={18} /> },
    { to: '/customer/receipts', label: 'Digital Receipts', icon: <Receipt size={18} /> },
  ];

  const shopkeeperLinks: SidebarLink[] = [
    { to: '/shopkeeper', label: 'Overview', icon: <LayoutDashboard size={18} /> },
    { to: '/shopkeeper/scan', label: 'Scan QR Code', icon: <ScanLine size={18} /> },
    { to: '/shopkeeper/queue', label: 'Print Queue', icon: <Printer size={18} />, badge: pendingQueueCount > 0 ? pendingQueueCount : undefined },
    { to: '/shopkeeper/profile', label: 'Shop Profile & Pledge', icon: <Store size={18} /> },
  ];

  const links: SidebarLink[] = role === 'shopkeeper' ? shopkeeperLinks : customerLinks;

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block p-4 border-r border-white/40 dark:border-slate-800/80 bg-vault-lightSurface/50 dark:bg-vault-darkSurface/50 min-h-[calc(100vh-65px)]">
      {/* Role Pill Header */}
      <div className="mb-6 p-3 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm dark:shadow-neu-dark-pressed flex items-center gap-3">
        <div className={`p-2 rounded-xl text-white ${role === 'shopkeeper' ? 'bg-vault-cyan text-slate-900' : 'bg-vault-blue'}`}>
          {role === 'shopkeeper' ? <Store size={18} /> : <ShieldCheck size={18} />}
        </div>
        <div className="overflow-hidden">
          <p className="text-xs font-bold text-vault-lightText dark:text-vault-darkText capitalize truncate">
            {role === 'shopkeeper' ? 'Shopkeeper Portal' : 'Customer Vault'}
          </p>
          <span className="text-[10px] font-mono text-vault-lightMuted dark:text-vault-darkMuted">
            {role === 'shopkeeper' ? 'Terminal v2.4' : 'Zero-Retention Active'}
          </span>
        </div>
      </div>

      {/* Nav List */}
      <nav className="space-y-1.5">
        {links.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/customer' || item.to === '/shopkeeper'}
            className={({ isActive }) => `
              flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200
              ${isActive
                ? 'bg-vault-lightSurface dark:bg-[#1e2637] text-vault-blue dark:text-vault-cyan shadow-neu-pressed dark:shadow-neu-dark-pressed border-l-4 border-vault-blue dark:border-vault-cyan'
                : 'text-vault-lightMuted dark:text-vault-darkMuted hover:text-vault-lightText dark:hover:text-vault-darkText hover:shadow-neu-flat-sm dark:hover:shadow-neu-dark-flat-sm'
              }
            `}
          >
            <div className="flex items-center gap-3">
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.label}</span>
            </div>

            {item.badge && (
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono text-white font-bold ${item.badgeColor || 'bg-vault-blue'}`}>
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Security Tip Box */}
      <div className="mt-8 p-3.5 rounded-2xl bg-gradient-to-br from-vault-blue/10 to-vault-cyan/10 border border-vault-blue/20 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-vault-blue dark:text-vault-cyan mb-1">
          <AlertOctagon size={14} />
          <span>Security Protocol</span>
        </div>
        <p className="text-[11px] text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
          {role === 'shopkeeper'
            ? 'Documents are strictly view-once. Platform wipes cached payloads after job completion.'
            : 'All access tokens auto-expire. Engage Kill Switch anytime to invalidate all active print links.'}
        </p>
      </div>
    </aside>
  );
};
