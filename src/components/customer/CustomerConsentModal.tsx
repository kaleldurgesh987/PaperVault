import React from 'react';
import { ShieldCheck, XCircle, AlertCircle, Clock, Store } from 'lucide-react';
import { NeuModal } from '../common/NeuModal';
import { NeuButton } from '../common/NeuButton';
import { PrintRequest, Shop } from '../../types';
import { db } from '../../services/dbService';

interface CustomerConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: PrintRequest;
  shop?: Shop;
  onDecision: (approved: boolean) => void;
}

export const CustomerConsentModal: React.FC<CustomerConsentModalProps> = ({
  isOpen,
  onClose,
  request,
  shop,
  onDecision
}) => {
  const doc = db.getDocumentById(request.document_id);

  const handleApprove = () => {
    // Transition request to APPROVED
    const updated: PrintRequest = {
      ...request,
      status: 'APPROVED',
      updated_at: new Date().toISOString()
    };
    db.updatePrintRequest(updated);

    // Record access event
    db.recordEvent({
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      request_id: request.id,
      document_id: request.document_id,
      actor_id: request.customer_id,
      actor_role: 'customer',
      event_type: 'CUSTOMER_CONSENT_GRANTED',
      details: `Customer consented to one-time inspection by ${shop?.name || 'Shop'}. Authorized for printing.`,
      timestamp: new Date().toISOString()
    });

    // Notify shopkeeper
    db.addNotification({
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      user_id: shop?.owner_id || 'usr_shop_01',
      role: 'shopkeeper',
      title: 'Consent Granted by Customer',
      message: `Customer approved access for ${doc?.original_filename || 'Document'}. You can now view and print.`,
      type: 'success',
      is_read: false,
      related_request_id: request.id,
      created_at: new Date().toISOString()
    });

    onDecision(true);
    onClose();
  };

  const handleReject = () => {
    const updated: PrintRequest = {
      ...request,
      status: 'CANCELLED',
      shop_notes: 'Customer explicitly declined authorization request.',
      updated_at: new Date().toISOString()
    };
    db.updatePrintRequest(updated);

    if (request.access_token_id) {
      db.revokeToken(request.access_token_id, 'Customer declined consent');
    }

    // Record access event
    db.recordEvent({
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      request_id: request.id,
      document_id: request.document_id,
      actor_id: request.customer_id,
      actor_role: 'customer',
      event_type: 'CUSTOMER_CONSENT_DENIED',
      details: `Customer rejected document access request for ${shop?.name || 'Shop'}. Token invalidated.`,
      timestamp: new Date().toISOString()
    });

    onDecision(false);
    onClose();
  };

  return (
    <NeuModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-vault-blue dark:text-vault-blueDark">
          <ShieldCheck size={24} />
          <span>Authorize Document Access</span>
        </div>
      }
      subtitle="A verified print shop is requesting temporary permission to inspect your file"
    >
      <div className="space-y-4">
        {/* Shop Info Card */}
        <div className="p-3.5 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-vault-blue/10 text-vault-blue">
            <Store size={20} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
              {shop?.name || 'Apex Cyber Print & Stationers'}
            </h4>
            <p className="text-[11px] text-vault-lightMuted dark:text-vault-darkMuted mt-0.5">
              {shop?.address || 'Sector 18 Commercial Complex, Noida'}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-vault-green border border-emerald-500/20">
                VERIFIED SHOP
              </span>
              <span className="text-[11px] text-vault-lightMuted">
                {shop?.completed_orders || 142} orders completed
              </span>
            </div>
          </div>
        </div>

        {/* Document & Permissions Details */}
        <div className="p-3.5 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-flat-sm space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-vault-lightMuted">Requested Document:</span>
            <span className="font-semibold text-vault-lightText dark:text-vault-darkText truncate max-w-[200px]">
              {doc?.original_filename || 'HDFC_Bank_Statement.pdf'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-vault-lightMuted">Purpose:</span>
            <span className="font-semibold text-vault-lightText dark:text-vault-darkText">
              Print Job Verification & Spooling
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-vault-lightMuted">Viewer Watermark:</span>
            <span className="font-mono text-vault-blue font-bold">
              {request.settings.watermark_enabled ? 'ENABLED (Anti-Retention)' : 'Standard'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-vault-lightMuted">Access Expiry:</span>
            <span className="font-mono text-vault-amber font-bold flex items-center gap-1">
              <Clock size={12} /> 15 Minutes
            </span>
          </div>
        </div>

        {/* Security Warning */}
        <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-vault-amber">
          <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />
          <span>
            Only approve if you are currently at this shop counter. Once approved, the shopkeeper can view your file once with the 6-digit release PIN.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <NeuButton
            variant="danger"
            size="md"
            icon={<XCircle size={16} />}
            onClick={handleReject}
          >
            Reject Access
          </NeuButton>
          <NeuButton
            variant="success"
            size="md"
            icon={<ShieldCheck size={16} />}
            onClick={handleApprove}
          >
            Approve Access
          </NeuButton>
        </div>
      </div>
    </NeuModal>
  );
};
