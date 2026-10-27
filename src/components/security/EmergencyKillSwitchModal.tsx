import React, { useState } from 'react';
import { AlertOctagon, ShieldAlert, CheckCircle2, Lock } from 'lucide-react';
import { NeuModal } from '../common/NeuModal';
import { NeuButton } from '../common/NeuButton';
import { db } from '../../services/dbService';

interface EmergencyKillSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
  onSuccess?: () => void;
}

export const EmergencyKillSwitchModal: React.FC<EmergencyKillSwitchModalProps> = ({
  isOpen,
  onClose,
  customerId,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [revokedCount, setRevokedCount] = useState<number | null>(null);

  const handleConfirmKill = () => {
    setLoading(true);
    setTimeout(() => {
      const res = db.emergencyKillSwitch(customerId);
      setRevokedCount(res.revokedCount);
      setLoading(false);
      if (onSuccess) onSuccess();
    }, 600);
  };

  const handleClose = () => {
    setRevokedCount(null);
    onClose();
  };

  return (
    <NeuModal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="md"
      title={
        <div className="flex items-center gap-2.5 text-vault-red">
          <AlertOctagon size={24} className="animate-pulse" />
          <span>Emergency Kill Switch</span>
        </div>
      }
      subtitle="Immediate revocation of all active document access permissions"
    >
      {revokedCount === null ? (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-xs text-vault-red leading-relaxed">
            <strong className="block font-bold mb-1">CRITICAL PRIVACY ACTION:</strong>
            Engaging the Kill Switch will immediately and irrevocably:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Invalidate all active QR tokens & display access codes.</li>
              <li>Purge & shred all raw file payloads stored in platform cache.</li>
              <li>Instantly close active shopkeeper viewing sessions.</li>
              <li>Broadcast high-priority security audit logs.</li>
            </ul>
          </div>

          <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted">
            Use this if you accidentally shared the wrong shop, left the premises, or suspect unauthorized handling.
          </p>

          <div className="flex items-center justify-end gap-3 pt-2">
            <NeuButton variant="flat" size="sm" onClick={handleClose} disabled={loading}>
              Cancel
            </NeuButton>
            <NeuButton
              variant="danger"
              size="md"
              icon={<ShieldAlert size={16} />}
              loading={loading}
              onClick={handleConfirmKill}
            >
              Confirm & Purge Everything
            </NeuButton>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-vault-green shadow-neu-pressed">
            <CheckCircle2 size={36} />
          </div>
          <div>
            <h4 className="text-base font-bold text-vault-lightText dark:text-vault-darkText">
              Kill Switch Executed Successfully
            </h4>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
              {revokedCount} active access tokens revoked. All sensitive file payloads have been wiped from platform storage.
            </p>
          </div>
          <NeuButton variant="primary" size="md" onClick={handleClose} className="w-full">
            Done
          </NeuButton>
        </div>
      )}
    </NeuModal>
  );
};
