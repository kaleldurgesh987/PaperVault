import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ScanLine, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Clock, 
  ArrowRight,
  CheckCircle2,
  Lock,
  Printer
} from 'lucide-react';
import { NeuCard } from '../../components/common/NeuCard';
import { NeuButton } from '../../components/common/NeuButton';
import { NeuInput } from '../../components/common/NeuInput';
import { StatusBadge } from '../../components/common/StatusBadge';
import { db } from '../../services/dbService';
import { DocumentAccessToken, PrintRequest, DocumentRecord } from '../../types';

export const ShopkeeperScanPage: React.FC = () => {
  const navigate = useNavigate();

  const [code, setCode] = useState('PV-8921-XQ');
  const [error, setError] = useState<string | null>(null);
  const [matchedToken, setMatchedToken] = useState<DocumentAccessToken | null>(null);
  const [matchedRequest, setMatchedRequest] = useState<PrintRequest | null>(null);
  const [matchedDoc, setMatchedDoc] = useState<DocumentRecord | null>(null);
  const [requestSent, setRequestSent] = useState(false);

  const handleLookup = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);
    setMatchedToken(null);
    setMatchedRequest(null);
    setMatchedDoc(null);
    setRequestSent(false);

    const token = db.getTokenByCode(code);
    if (!token) {
      setError(`No valid token found matching "${code}". Check the code or scan again.`);
      return;
    }

    if (token.is_revoked) {
      setError('This token has been REVOKED by the customer or Emergency Kill Switch.');
      return;
    }

    if (new Date(token.expires_at).getTime() < Date.now()) {
      setError('This access token has EXPIRED. Ask the customer to regenerate.');
      return;
    }

    const req = db.getPrintRequestById(token.request_id);
    if (!req) {
      setError('Associated print request not found in database.');
      return;
    }

    const doc = db.getDocumentById(req.document_id);
    setMatchedToken(token);
    setMatchedRequest(req);
    setMatchedDoc(doc || null);
  };

  const handleSendConsentRequest = () => {
    if (!matchedRequest) return;

    // Transition to AWAITING_APPROVAL
    const updated: PrintRequest = {
      ...matchedRequest,
      status: 'AWAITING_APPROVAL',
      updated_at: new Date().toISOString()
    };
    db.updatePrintRequest(updated);

    // Record access event
    db.recordEvent({
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      request_id: matchedRequest.id,
      document_id: matchedRequest.document_id,
      actor_id: 'shop_apex_01',
      actor_role: 'shopkeeper',
      event_type: 'ACCESS_REQUESTED',
      details: `Shopkeeper scanned QR (${matchedToken?.display_code}). Sent live push prompt to customer for authorization.`,
      timestamp: new Date().toISOString()
    });

    // Notify customer
    db.addNotification({
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      user_id: matchedRequest.customer_id,
      role: 'customer',
      title: 'Shopkeeper Scanned Your QR Code',
      message: 'Apex Cyber Print has scanned your QR and is requesting authorization to inspect the file.',
      type: 'warning',
      is_read: false,
      related_request_id: matchedRequest.id,
      created_at: new Date().toISOString()
    });

    setRequestSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
          Scan or Enter Customer Access Code
        </h1>
        <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
          Authenticate incoming QR tokens and request customer authorization
        </p>
      </div>

      {/* Code Input Card */}
      <NeuCard variant="flat" className="p-6 sm:p-8 space-y-4">
        <form onSubmit={handleLookup} className="space-y-4">
          <NeuInput
            label="QR Access Code or Display Token"
            placeholder="e.g. PV-8921-XQ"
            value={code}
            onChange={e => setCode(e.target.value)}
            leftIcon={<ScanLine size={18} />}
            required
          />

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-vault-red text-xs font-semibold">
              <AlertTriangle size={16} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <NeuButton
              variant="primary"
              size="md"
              type="submit"
              icon={<Search size={16} />}
            >
              Verify Token
            </NeuButton>
          </div>
        </form>
      </NeuCard>

      {/* Result Card */}
      {matchedToken && matchedRequest && (
        <NeuCard variant="clay" className="p-6 sm:p-8 space-y-6 border border-vault-blue/30">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2.5 rounded-xl bg-vault-green/10 text-vault-green">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span className="font-mono text-xs font-bold text-vault-blue">
                  {matchedToken.display_code}
                </span>
                <h3 className="text-base font-bold text-vault-lightText dark:text-vault-darkText">
                  {matchedDoc?.original_filename || 'Sensitive Document'}
                </h3>
              </div>
            </div>

            <StatusBadge status={matchedRequest.status} size="sm" />
          </div>

          {/* Job Specifications */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm">
              <span className="text-vault-lightMuted font-mono text-[10px] block">Print Spec</span>
              <strong>{matchedRequest.settings.copies} Copy</strong> ({matchedRequest.settings.paper_size}, {matchedRequest.settings.color_mode})
            </div>
            <div className="p-3 rounded-xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm">
              <span className="text-vault-lightMuted font-mono text-[10px] block">Watermark Rule</span>
              <strong className="text-vault-blue">
                {matchedRequest.settings.watermark_enabled ? 'Active Overlay' : 'Standard'}
              </strong>
            </div>
          </div>

          {/* Action Gate */}
          {!requestSent ? (
            <div className="space-y-3">
              <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
                To prevent unauthorized document inspection, you must trigger a live push authorization to the customer's phone before decryption keys are provided.
              </p>
              <NeuButton
                variant="primary"
                size="lg"
                icon={<ShieldCheck size={18} />}
                onClick={handleSendConsentRequest}
                className="w-full"
              >
                Request Customer Inspection Consent
              </NeuButton>
            </div>
          ) : (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
              <CheckCircle2 size={32} className="mx-auto text-vault-green animate-bounce" />
              <div>
                <h4 className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
                  Consent Request Sent to Customer!
                </h4>
                <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
                  The customer has been prompted on their screen to approve your shop.
                </p>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <NeuButton
                  variant="primary"
                  size="md"
                  onClick={() => navigate('/shopkeeper/queue')}
                >
                  Go to Print Queue & Monitor Status
                </NeuButton>
              </div>
            </div>
          )}
        </NeuCard>
      )}
    </div>
  );
};
