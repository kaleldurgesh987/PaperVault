import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Store, 
  Printer, 
  ScanLine, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight,
  FileCheck,
  FileText
} from 'lucide-react';
import { NeuCard } from '../../components/common/NeuCard';
import { NeuButton } from '../../components/common/NeuButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PinVerificationModal } from '../../components/shopkeeper/PinVerificationModal';
import { SimulatedPrinterModal } from '../../components/shopkeeper/SimulatedPrinterModal';
import { PrivacyPledgeModal } from '../../components/shopkeeper/PrivacyPledgeModal';
import { db } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { PrintRequest, Shop } from '../../types';

export const ShopkeeperDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shop, setShop] = useState<Shop | undefined>(() => db.getShopById('shop_apex_01'));
  const [requests, setRequests] = useState<PrintRequest[]>([]);
  const [activePinReq, setActivePinReq] = useState<PrintRequest | null>(null);
  const [activePrintReq, setActivePrintReq] = useState<PrintRequest | null>(null);
  const [pledgeOpen, setPledgeOpen] = useState(false);

  const loadData = () => {
    const currentShop = db.getShopById('shop_apex_01') || db.getShops()[0];
    setShop(currentShop);
    const all = db.getPrintRequests();
    setRequests(all.filter(r => r.shop_id === currentShop?.id || true));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('printvault:state_change', loadData);
    return () => window.removeEventListener('printvault:state_change', loadData);
  }, []);

  const pending = requests.filter(r => r.status === 'PENDING' || r.status === 'ACCEPTED');
  const awaitingApproval = requests.filter(r => r.status === 'AWAITING_APPROVAL');
  const readyToPrint = requests.filter(r => r.status === 'APPROVED');
  const completed = requests.filter(r => r.status === 'COMPLETED');

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
              {shop?.name || 'Apex Cyber Print & Stationers'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/15 text-vault-green border border-emerald-500/30">
              {shop?.verification_status === 'verified' ? '★ VERIFIED' : 'PENDING'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-vault-lightMuted dark:text-vault-darkMuted mt-1">
            Shopkeeper Terminal &bull; GSTIN: {shop?.registration_number || 'GSTIN07AAAAA0000A1Z5'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <NeuButton
            variant="secondary"
            size="md"
            icon={<ScanLine size={16} />}
            onClick={() => navigate('/shopkeeper/scan')}
          >
            Scan Customer QR
          </NeuButton>
          <NeuButton
            variant="primary"
            size="md"
            icon={<Printer size={16} />}
            onClick={() => navigate('/shopkeeper/queue')}
          >
            View Print Queue ({pending.length + readyToPrint.length})
          </NeuButton>
        </div>
      </div>

      {/* Privacy Pledge Warning if unsigned */}
      {!shop?.privacy_pledge_signed && (
        <NeuCard variant="flat" className="p-4 bg-amber-500/10 border-l-4 border-amber-500 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-vault-amber flex-shrink-0" />
            <div>
              <h4 className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
                Privacy Pledge Unsigned
              </h4>
              <p className="text-xs text-vault-lightMuted">
                Sign the data handling commitment to maintain verified status.
              </p>
            </div>
          </div>
          <NeuButton variant="primary" size="sm" onClick={() => setPledgeOpen(true)}>
            Sign Pledge
          </NeuButton>
        </NeuCard>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <NeuCard variant="flat" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-vault-lightMuted">
              Incoming Queue
            </span>
            <Printer size={16} className="text-vault-blue" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-vault-blue">
            {pending.length}
          </p>
          <span className="text-[10px] text-vault-lightMuted">Awaiting accept/print</span>
        </NeuCard>

        <NeuCard variant="flat" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-vault-amber">
              Awaiting Consent
            </span>
            <Clock size={16} className="text-vault-amber" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-vault-amber">
            {awaitingApproval.length}
          </p>
          <span className="text-[10px] text-vault-amber">Waiting on customer mobile</span>
        </NeuCard>

        <NeuCard variant="flat" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-vault-green">
              Approved & Ready
            </span>
            <CheckCircle2 size={16} className="text-vault-green" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-vault-green">
            {readyToPrint.length}
          </p>
          <span className="text-[10px] text-vault-green">PIN release pending</span>
        </NeuCard>

        <NeuCard variant="flat" className="p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono uppercase font-bold text-purple-600 dark:text-purple-400">
              Completed Orders
            </span>
            <FileCheck size={16} className="text-purple-500" />
          </div>
          <p className="text-2xl font-heading font-extrabold text-purple-600 dark:text-purple-400">
            {completed.length}
          </p>
          <span className="text-[10px] text-purple-500 font-mono">Payloads purged from disk</span>
        </NeuCard>
      </div>

      {/* Active Print Queue Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-heading font-bold text-vault-lightText dark:text-vault-darkText">
            Print Queue & Active Customer Jobs
          </h3>
          <Link to="/shopkeeper/queue" className="text-xs text-vault-blue hover:underline flex items-center gap-1 font-semibold">
            Open Queue <ArrowRight size={13} />
          </Link>
        </div>

        <div className="space-y-3">
          {requests.slice(0, 5).map(req => {
            const doc = db.getDocumentById(req.document_id);

            return (
              <NeuCard key={req.id} variant="flat" className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-vault-blue">
                      {req.id.toUpperCase()}
                    </span>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <p className="text-xs font-bold text-vault-lightText dark:text-vault-darkText">
                    {doc?.original_filename || 'Sensitive Document'}
                  </p>
                  <p className="text-[11px] text-vault-lightMuted">
                    {req.settings.copies} copy • {req.settings.paper_size} • {req.settings.color_mode} &bull; Watermark: {req.settings.watermark_enabled ? 'ON' : 'OFF'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {req.status === 'APPROVED' ? (
                    <NeuButton
                      variant="primary"
                      size="sm"
                      icon={<Printer size={14} />}
                      onClick={() => setActivePinReq(req)}
                    >
                      Enter PIN & Print
                    </NeuButton>
                  ) : req.status === 'AWAITING_APPROVAL' ? (
                    <span className="text-xs font-mono text-vault-amber bg-amber-500/10 px-2.5 py-1 rounded-lg">
                      Customer consent pending...
                    </span>
                  ) : req.status === 'COMPLETED' ? (
                    <span className="text-xs font-mono text-vault-green bg-emerald-500/10 px-2.5 py-1 rounded-lg">
                      Completed & Purged
                    </span>
                  ) : (
                    <NeuButton
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/shopkeeper/queue')}
                    >
                      Review Job
                    </NeuButton>
                  )}
                </div>
              </NeuCard>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      {activePinReq && (
        <PinVerificationModal
          isOpen={!!activePinReq}
          onClose={() => setActivePinReq(null)}
          request={activePinReq}
          onSuccess={() => {
            setActivePrintReq(activePinReq);
            setActivePinReq(null);
          }}
        />
      )}

      {activePrintReq && (
        <SimulatedPrinterModal
          isOpen={!!activePrintReq}
          onClose={() => setActivePrintReq(null)}
          request={activePrintReq}
          shop={shop}
          onComplete={loadData}
        />
      )}

      {shop && (
        <PrivacyPledgeModal
          isOpen={pledgeOpen}
          onClose={() => setPledgeOpen(false)}
          shopId={shop.id}
          onSigned={loadData}
        />
      )}
    </div>
  );
};
