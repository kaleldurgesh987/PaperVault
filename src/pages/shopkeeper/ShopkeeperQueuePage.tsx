import React, { useState, useEffect } from 'react';
import { 
  Printer, 
  Eye, 
  CheckCircle2, 
  Trash2, 
  Clock, 
  KeyRound, 
  Sliders, 
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { NeuCard } from '../../components/common/NeuCard';
import { NeuButton } from '../../components/common/NeuButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { PinVerificationModal } from '../../components/shopkeeper/PinVerificationModal';
import { SimulatedPrinterModal } from '../../components/shopkeeper/SimulatedPrinterModal';
import { db } from '../../services/dbService';
import { PrintRequest, Shop } from '../../types';

export const ShopkeeperQueuePage: React.FC = () => {
  const [requests, setRequests] = useState<PrintRequest[]>([]);
  const [shop, setShop] = useState<Shop | undefined>(() => db.getShopById('shop_apex_01'));
  const [filter, setFilter] = useState<'ALL' | 'ACTIONABLE' | 'COMPLETED'>('ACTIONABLE');

  // Modals
  const [activePinReq, setActivePinReq] = useState<PrintRequest | null>(null);
  const [activePrintReq, setActivePrintReq] = useState<PrintRequest | null>(null);
  const [activeViewerReq, setActiveViewerReq] = useState<PrintRequest | null>(null);

  const loadData = () => {
    const list = db.getPrintRequests();
    setRequests(list);
    setShop(db.getShopById('shop_apex_01'));
  };

  useEffect(() => {
    loadData();
    window.addEventListener('printvault:state_change', loadData);
    return () => window.removeEventListener('printvault:state_change', loadData);
  }, []);

  const filtered = requests.filter(r => {
    if (filter === 'ACTIONABLE') return r.status !== 'COMPLETED' && r.status !== 'CANCELLED';
    if (filter === 'COMPLETED') return r.status === 'COMPLETED';
    return true;
  });

  const handleAccept = (req: PrintRequest) => {
    db.updatePrintRequest({
      ...req,
      status: 'ACCEPTED',
      updated_at: new Date().toISOString()
    });
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
            Print Queue Management
          </h1>
          <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
            Accept orders, authenticate release PINs, and execute zero-retention printing
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm">
          {(['ACTIONABLE', 'ALL', 'COMPLETED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-vault-cyan text-slate-900 font-bold shadow-sm'
                  : 'text-vault-lightMuted dark:text-vault-darkMuted hover:text-vault-lightText'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <NeuCard variant="flat" className="p-12 text-center space-y-3">
          <Printer size={36} className="mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
            No print jobs in this view
          </h3>
          <p className="text-xs text-vault-lightMuted">
            Scan a customer QR code to load an incoming request.
          </p>
        </NeuCard>
      ) : (
        <div className="space-y-4">
          {filtered.map(req => {
            const doc = db.getDocumentById(req.document_id);

            return (
              <NeuCard key={req.id} variant="flat" className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-vault-blue">
                      {req.id.toUpperCase()}
                    </span>
                    <StatusBadge status={req.status} size="sm" />
                    {doc?.deletion_status === 'PURGED_VERIFIED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400">
                        PURGED FROM PLATFORM
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
                    {doc?.original_filename || 'Sensitive Document'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-vault-lightMuted">
                    <span>{req.settings.copies} Copy ({req.settings.paper_size}, {req.settings.color_mode})</span>
                    <span className="font-mono text-vault-blue font-bold">₹{req.settings.estimated_cost}</span>
                    <span className="font-mono">Expires: {new Date(req.expires_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>

                {/* Status-Driven Controls */}
                <div className="flex items-center gap-2">
                  {req.status === 'PENDING' && (
                    <NeuButton
                      variant="primary"
                      size="sm"
                      onClick={() => handleAccept(req)}
                    >
                      Accept Job
                    </NeuButton>
                  )}

                  {req.status === 'ACCEPTED' && (
                    <NeuButton
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        db.updatePrintRequest({
                          ...req,
                          status: 'AWAITING_APPROVAL'
                        });
                        loadData();
                      }}
                    >
                      Request Consent
                    </NeuButton>
                  )}

                  {req.status === 'AWAITING_APPROVAL' && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-vault-amber bg-amber-500/10 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5">
                        <Clock size={13} className="animate-spin" /> Awaiting Customer
                      </span>
                    </div>
                  )}

                  {req.status === 'APPROVED' && (
                    <div className="flex items-center gap-2">
                      <NeuButton
                        variant="primary"
                        size="sm"
                        icon={<KeyRound size={14} />}
                        onClick={() => setActivePinReq(req)}
                      >
                        Enter PIN & Print
                      </NeuButton>
                    </div>
                  )}

                  {req.status === 'COMPLETED' && (
                    <span className="px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-vault-green bg-emerald-500/10">
                      Settled & Purged
                    </span>
                  )}
                </div>
              </NeuCard>
            );
          })}
        </div>
      )}

      {/* Pin Verification Modal */}
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

      {/* Print Spooler Modal */}
      {activePrintReq && (
        <SimulatedPrinterModal
          isOpen={!!activePrintReq}
          onClose={() => setActivePrintReq(null)}
          request={activePrintReq}
          shop={shop}
          onComplete={loadData}
        />
      )}
    </div>
  );
};
