import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  ShieldCheck, 
  Clock, 
  Trash2, 
  AlertTriangle, 
  KeyRound, 
  Store,
  Lock
} from 'lucide-react';
import { NeuCard } from '../../components/common/NeuCard';
import { NeuButton } from '../../components/common/NeuButton';
import { QRCodeDisplay } from '../../components/common/QRCodeDisplay';
import { StatusBadge } from '../../components/common/StatusBadge';
import { CustomerConsentModal } from '../../components/customer/CustomerConsentModal';
import { db } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { PrintRequest, DocumentAccessToken } from '../../types';

export const CustomerActiveSharesPage: React.FC = () => {
  const { user } = useAuth();

  const [requests, setRequests] = useState<PrintRequest[]>([]);
  const [tokens, setTokens] = useState<DocumentAccessToken[]>([]);
  const [consentRequest, setConsentRequest] = useState<PrintRequest | null>(null);

  const loadData = () => {
    const allReqs = db.getPrintRequests().filter(r => r.customer_id === user?.id || user?.id === 'usr_cust_01');
    setRequests(allReqs);
    setTokens(db.getTokens());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('printvault:state_change', loadData);
    return () => window.removeEventListener('printvault:state_change', loadData);
  }, [user]);

  const activeReqs = requests.filter(r => r.status !== 'COMPLETED' && r.status !== 'CANCELLED');

  const handleRevoke = (req: PrintRequest) => {
    if (window.confirm('Revoke access for this document immediately?')) {
      if (req.access_token_id) {
        db.revokeToken(req.access_token_id, 'Customer revoked access from dashboard');
      }
      db.updatePrintRequest({
        ...req,
        status: 'CANCELLED',
        shop_notes: 'Access explicitly revoked by customer.'
      });
      // Purge storage
      db.purgeDocumentStorage(req.document_id, 'CUSTOMER_REVOCATION');
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
          Active Shares & Consent Center
        </h1>
        <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
          Manage live QR access tokens, review shop consent requests, and view print release PINs
        </p>
      </div>

      {activeReqs.length === 0 ? (
        <NeuCard variant="flat" className="p-12 text-center space-y-3">
          <QrCode size={36} className="mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
            No active shares currently open
          </h3>
          <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted">
            All previous document tokens have expired or been revoked.
          </p>
        </NeuCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {activeReqs.map(req => {
            const doc = db.getDocumentById(req.document_id);
            const shop = db.getShopById(req.shop_id);
            const token = tokens.find(t => t.id === req.access_token_id || t.request_id === req.id);
            const displayCode = token?.display_code || 'PV-8921-XQ';

            return (
              <NeuCard key={req.id} variant="flat" className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-extrabold text-vault-blue">
                      {req.id.toUpperCase()}
                    </span>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                  <NeuButton
                    variant="danger"
                    size="sm"
                    icon={<Trash2 size={13} />}
                    onClick={() => handleRevoke(req)}
                  >
                    Revoke Access
                  </NeuButton>
                </div>

                {/* Consent Alert Prompt */}
                {req.status === 'AWAITING_APPROVAL' && (
                  <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <AlertTriangle size={18} className="text-vault-amber flex-shrink-0 animate-bounce" />
                      <div>
                        <p className="text-xs font-bold text-vault-lightText dark:text-vault-darkText">
                          Shopkeeper scanned QR! Authorization required.
                        </p>
                        <span className="text-[10px] text-vault-amber font-mono">
                          Action required to release PIN
                        </span>
                      </div>
                    </div>
                    <NeuButton
                      variant="primary"
                      size="sm"
                      onClick={() => setConsentRequest(req)}
                    >
                      Authorize
                    </NeuButton>
                  </div>
                )}

                {/* QR Code and Meta display */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                  <QRCodeDisplay
                    tokenCode={displayCode}
                    tokenString={displayCode}
                    expiresAt={req.expires_at}
                    isRevoked={token?.is_revoked || req.status === 'CANCELLED'}
                    shopName={shop?.name}
                  />

                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm space-y-1">
                      <span className="text-[10px] font-mono uppercase text-vault-lightMuted font-bold">
                        Single-Use Release PIN:
                      </span>
                      <p className="font-mono text-xl font-extrabold text-vault-blue">
                        {req.release_pin || '849201'}
                      </p>
                      <p className="text-[10px] text-vault-lightMuted">
                        Share this PIN with the shopkeeper only after they are ready to print.
                      </p>
                    </div>

                    <div className="space-y-1 text-xs">
                      <p className="font-semibold text-vault-lightText dark:text-vault-darkText truncate">
                        {doc?.original_filename || 'Bank_Statement.pdf'}
                      </p>
                      <p className="text-vault-lightMuted">
                        Shop: <strong>{shop?.name || 'Apex Cyber Print'}</strong>
                      </p>
                      <p className="text-vault-lightMuted">
                        Format: {req.settings.copies} copy ({req.settings.paper_size}, {req.settings.color_mode})
                      </p>
                    </div>
                  </div>
                </div>
              </NeuCard>
            );
          })}
        </div>
      )}

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
