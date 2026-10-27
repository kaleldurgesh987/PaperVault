import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FileText, 
  UploadCloud, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Trash2, 
  Lock, 
  ArrowRight, 
  AlertTriangle,
  QrCode,
  ShieldCheck,
  Eye
} from 'lucide-react';
import { NeuCard } from '../../components/common/NeuCard';
import { NeuButton } from '../../components/common/NeuButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { TrustTimeline } from '../../components/security/TrustTimeline';
import { EmergencyKillSwitchModal } from '../../components/security/EmergencyKillSwitchModal';
import { CustomerConsentModal } from '../../components/customer/CustomerConsentModal';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/dbService';
import { PrintRequest } from '../../types';

export const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState<PrintRequest[]>([]);
  const [events, setEvents] = useState(() => db.getEvents());
  const [killSwitchOpen, setKillSwitchOpen] = useState(false);
  const [consentRequest, setConsentRequest] = useState<PrintRequest | null>(null);

  // Refresh reactive data
  const loadData = () => {
    const all = db.getPrintRequests();
    setRequests(all.filter(r => r.customer_id === user?.id || user?.id === 'usr_cust_01'));
    setEvents(db.getEvents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('printvault:state_change', loadData);
    return () => window.removeEventListener('printvault:state_change', loadData);
  }, [user]);

  // Derived real stats
  const totalShared = requests.length;
  const activeRequests = requests.filter(r => r.status === 'PENDING' || r.status === 'ACCEPTED' || r.status === 'AWAITING_APPROVAL' || r.status === 'APPROVED' || r.status === 'PRINTING');
  const completedOrders = requests.filter(r => r.status === 'COMPLETED').length;
  const revokedOrExpired = requests.filter(r => r.status === 'CANCELLED' || r.status === 'EXPIRED').length;
  const purgedFromStorage = requests.filter(r => {
    const doc = db.getDocumentById(r.document_id);
    return doc?.deletion_status === 'PURGED_VERIFIED';
  }).length;

  const awaitingConsent = requests.find(r => r.status === 'AWAITING_APPROVAL');

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
            Welcome back, {user?.full_name?.split(' ')[0] || 'Customer'}
          </h1>
          <p className="text-xs sm:text-sm text-vault-lightMuted dark:text-vault-darkMuted mt-1">
            Zero-Retention Privacy Active • All active document access links auto-expire
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NeuButton
            variant="danger"
            size="md"
            icon={<ShieldAlert size={16} />}
            onClick={() => setKillSwitchOpen(true)}
          >
            Emergency Kill Switch
          </NeuButton>
          <NeuButton
            variant="primary"
            size="md"
            icon={<UploadCloud size={16} />}
            onClick={() => navigate('/customer/upload')}
          >
            Upload Document
          </NeuButton>
        </div>
      </div>

      {/* Critical Consent Action Banner if Shopkeeper is requesting access */}
      {awaitingConsent && (
        <NeuCard variant="flat" className="p-4 sm:p-5 bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border-l-4 border-amber-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-vault-amber text-white">
                <AlertTriangle size={20} className="animate-bounce" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
                  Consent Requested by Print Shop!
                </h4>
                <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted">
                  Apex Cyber Print scanned your QR token and needs your authorization to inspect the file.
                </p>
              </div>
            </div>
            <NeuButton
              variant="primary"
              size="sm"
              icon={<ShieldCheck size={15} />}
              onClick={() => setConsentRequest(awaitingConsent)}
            >
              Review & Authorize
            </NeuButton>
          </div>
        </NeuCard>
      )}

      {/* Metric Cards (Real Database Computed Stats) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <NeuCard variant="flat" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-vault-lightMuted dark:text-vault-darkMuted">
              Shared Docs
            </span>
            <FileText size={16} className="text-vault-blue" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
            {totalShared}
          </p>
          <span className="text-[10px] text-vault-lightMuted">Total life-of-account</span>
        </NeuCard>

        <NeuCard variant="flat" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-vault-lightMuted dark:text-vault-darkMuted">
              Active Shares
            </span>
            <Clock size={16} className="text-vault-amber" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-vault-amber">
            {activeRequests.length}
          </p>
          <span className="text-[10px] text-vault-amber font-mono">Temporary access active</span>
        </NeuCard>

        <NeuCard variant="flat" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-vault-lightMuted dark:text-vault-darkMuted">
              Completed
            </span>
            <CheckCircle2 size={16} className="text-vault-green" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-vault-green">
            {completedOrders}
          </p>
          <span className="text-[10px] text-vault-green font-mono">Finished & settled</span>
        </NeuCard>

        <NeuCard variant="flat" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-vault-lightMuted dark:text-vault-darkMuted">
              Revoked / Exp
            </span>
            <Lock size={16} className="text-vault-red" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-vault-red">
            {revokedOrExpired}
          </p>
          <span className="text-[10px] text-vault-lightMuted">Access terminated</span>
        </NeuCard>

        <NeuCard variant="flat" className="p-4 space-y-2 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-purple-600 dark:text-purple-400">
              Storage Shredded
            </span>
            <Trash2 size={16} className="text-purple-500" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-purple-600 dark:text-purple-400">
            {purgedFromStorage}
          </p>
          <span className="text-[10px] text-purple-500 font-mono">Payload zeroized</span>
        </NeuCard>
      </div>

      {/* Main Content 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Print Requests Table */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-vault-lightText dark:text-vault-darkText">
              Recent Print Requests
            </h3>
            <Link to="/customer/requests" className="text-xs text-vault-blue hover:underline flex items-center gap-1 font-semibold">
              View All <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {requests.length === 0 ? (
              <NeuCard variant="flat" className="p-8 text-center space-y-3">
                <FileText size={32} className="mx-auto text-slate-400" />
                <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted">
                  No documents shared yet. Click below to start your first secure print request.
                </p>
                <NeuButton
                  variant="primary"
                  size="sm"
                  onClick={() => navigate('/customer/upload')}
                >
                  Upload First Document
                </NeuButton>
              </NeuCard>
            ) : (
              requests.slice(0, 4).map(req => {
                const doc = db.getDocumentById(req.document_id);
                const shop = db.getShopById(req.shop_id);

                return (
                  <NeuCard key={req.id} variant="flat" className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-vault-blue">
                          {req.id.toUpperCase()}
                        </span>
                        <StatusBadge status={req.status} size="sm" />
                      </div>
                      <p className="text-xs font-bold text-vault-lightText dark:text-vault-darkText truncate max-w-xs">
                        {doc?.original_filename || 'Protected Document'}
                      </p>
                      <p className="text-[11px] text-vault-lightMuted dark:text-vault-darkMuted">
                        Shop: {shop?.name || 'Apex Cyber Print'} • {req.settings.copies} copy ({req.settings.color_mode})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {req.release_pin && req.status === 'APPROVED' && (
                        <span className="px-2 py-1 rounded-lg bg-vault-blue/10 text-vault-blue font-mono font-bold text-xs">
                          PIN: {req.release_pin}
                        </span>
                      )}
                      <NeuButton
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate('/customer/shares')}
                      >
                        Details
                      </NeuButton>
                    </div>
                  </NeuCard>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Live Trust Activity Timeline */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-vault-lightText dark:text-vault-darkText">
              Trust Activity Timeline
            </h3>
            <span className="text-[10px] font-mono text-vault-green font-bold">
              • LIVE AUDIT
            </span>
          </div>

          <NeuCard variant="flat" className="p-5 max-h-[460px] overflow-y-auto">
            <TrustTimeline events={events.slice(0, 6)} />
          </NeuCard>
        </div>
      </div>

      {/* Modals */}
      <EmergencyKillSwitchModal
        isOpen={killSwitchOpen}
        onClose={() => setKillSwitchOpen(false)}
        customerId={user?.id || 'usr_cust_01'}
        onSuccess={loadData}
      />

      {consentRequest && (
        <CustomerConsentModal
          isOpen={!!consentRequest}
          onClose={() => setConsentRequest(null)}
          request={consentRequest}
          shop={db.getShopById(consentRequest.shop_id)}
          onDecision={loadData}
        />
      )}
    </div>
  );
};
