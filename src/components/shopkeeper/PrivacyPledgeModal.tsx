import React, { useState } from 'react';
import { ShieldCheck, FileCheck, CheckSquare, Square } from 'lucide-react';
import { NeuModal } from '../common/NeuModal';
import { NeuButton } from '../common/NeuButton';
import { db } from '../../services/dbService';

interface PrivacyPledgeModalProps {
  isOpen: boolean;
  onClose: () => void;
  shopId: string;
  onSigned: () => void;
}

export const PrivacyPledgeModal: React.FC<PrivacyPledgeModalProps> = ({
  isOpen,
  onClose,
  shopId,
  onSigned
}) => {
  const [agreed1, setAgreed1] = useState(false);
  const [agreed2, setAgreed2] = useState(false);
  const [agreed3, setAgreed3] = useState(false);
  const [agreed4, setAgreed4] = useState(false);

  const allAgreed = agreed1 && agreed2 && agreed3 && agreed4;

  const handleSign = () => {
    if (!allAgreed) return;

    const shop = db.getShopById(shopId);
    if (shop) {
      db.updateShop({
        ...shop,
        privacy_pledge_signed: true,
        privacy_pledge_date: new Date().toISOString(),
        privacy_policy_version: 'v2.4-2026'
      });
    }

    onSigned();
    onClose();
  };

  return (
    <NeuModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-vault-blue dark:text-vault-blueDark">
          <ShieldCheck size={24} />
          <span>Shopkeeper Privacy Commitment</span>
        </div>
      }
      subtitle="Sign the platform data handling covenant (Policy v2.4-2026)"
    >
      <div className="space-y-4">
        <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
          As a registered PrintVault partner shop, you must affirm your legal & ethical agreement to protect customer documents from unauthorized retention and secondary distribution:
        </p>

        <div className="space-y-3 p-3.5 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm text-xs">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <button
              type="button"
              onClick={() => setAgreed1(!agreed1)}
              className="mt-0.5 text-vault-blue flex-shrink-0"
            >
              {agreed1 ? <CheckSquare size={17} /> : <Square size={17} />}
            </button>
            <span className="text-vault-lightText dark:text-vault-darkText leading-tight">
              I will access customer documents exclusively for the purpose of completing the authorized print order.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <button
              type="button"
              onClick={() => setAgreed2(!agreed2)}
              className="mt-0.5 text-vault-blue flex-shrink-0"
            >
              {agreed2 ? <CheckSquare size={17} /> : <Square size={17} />}
            </button>
            <span className="text-vault-lightText dark:text-vault-darkText leading-tight">
              I will not photograph screens, export copies to personal drives, or retain WhatsApp/email attachments.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <button
              type="button"
              onClick={() => setAgreed3(!agreed3)}
              className="mt-0.5 text-vault-blue flex-shrink-0"
            >
              {agreed3 ? <CheckSquare size={17} /> : <Square size={17} />}
            </button>
            <span className="text-vault-lightText dark:text-vault-darkText leading-tight">
              I will immediately shred any test prints or misprints in the customer's presence.
            </span>
          </label>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <button
              type="button"
              onClick={() => setAgreed4(!agreed4)}
              className="mt-0.5 text-vault-blue flex-shrink-0"
            >
              {agreed4 ? <CheckSquare size={17} /> : <Square size={17} />}
            </button>
            <span className="text-vault-lightText dark:text-vault-darkText leading-tight">
              I understand this agreement is logged with my GSTIN/profile and accessible in customer audits.
            </span>
          </label>
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <NeuButton variant="flat" size="sm" onClick={onClose}>
            Cancel
          </NeuButton>
          <NeuButton
            variant="primary"
            size="md"
            icon={<FileCheck size={16} />}
            disabled={!allAgreed}
            onClick={handleSign}
          >
            Sign Privacy Pledge
          </NeuButton>
        </div>
      </div>
    </NeuModal>
  );
};
