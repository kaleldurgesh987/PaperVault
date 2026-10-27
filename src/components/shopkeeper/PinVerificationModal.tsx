import React, { useState } from 'react';
import { KeyRound, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { NeuModal } from '../common/NeuModal';
import { NeuButton } from '../common/NeuButton';
import { PrintRequest } from '../../types';
import { db } from '../../services/dbService';

interface PinVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: PrintRequest;
  onSuccess: () => void;
}

export const PinVerificationModal: React.FC<PinVerificationModalProps> = ({
  isOpen,
  onClose,
  request,
  onSuccess
}) => {
  const [pin, setPin] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(request.pin_attempts_left ?? 3);
  const [loading, setLoading] = useState(false);

  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    if (!/^\d*$/.test(value)) return;

    const nextPin = [...pin];
    nextPin[index] = value;
    setPin(nextPin);
    setError(null);

    // Auto focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`pin-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredPin = pin.join('');
    if (enteredPin.length < 6) {
      setError('Please enter all 6 digits of the customer release PIN.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      // Validate against stored release_pin (seed is '849201' or request.release_pin)
      const correctPin = request.release_pin || '849201';

      if (enteredPin === correctPin) {
        // Record success event
        db.recordEvent({
          id: 'evt_' + Math.random().toString(36).substring(2, 9),
          request_id: request.id,
          document_id: request.document_id,
          actor_id: request.shop_id,
          actor_role: 'shopkeeper',
          event_type: 'PIN_ENTERED_SUCCESS',
          details: 'Valid 6-digit release PIN authenticated. Document decrypted for viewer.',
          timestamp: new Date().toISOString()
        });

        onSuccess();
        onClose();
      } else {
        const remaining = Math.max(0, attemptsLeft - 1);
        setAttemptsLeft(remaining);

        // Record failure security event
        db.recordSecurityEvent({
          id: 'sec_' + Date.now(),
          level: remaining === 0 ? 'HIGH' : 'MEDIUM',
          type: remaining === 0 ? 'EXCESSIVE_PIN_FAILS' : 'UNAUTHORIZED_ACCESS',
          shop_id: request.shop_id,
          details: `Invalid release PIN attempt for Request ${request.id}. Attempts left: ${remaining}`,
          timestamp: new Date().toISOString()
        });

        if (remaining === 0) {
          setError('Maximum PIN attempts reached. Request has been locked for security.');
          // Lock request
          const locked: PrintRequest = {
            ...request,
            status: 'CANCELLED',
            pin_attempts_left: 0,
            shop_notes: 'PIN locked due to 3 consecutive failures.'
          };
          db.updatePrintRequest(locked);
        } else {
          setError(`Incorrect PIN. ${remaining} attempt${remaining > 1 ? 's' : ''} remaining.`);
        }
      }
    }, 400);
  };

  return (
    <NeuModal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2 text-vault-blue dark:text-vault-blueDark">
          <KeyRound size={22} />
          <span>Enter Customer Release PIN</span>
        </div>
      }
      subtitle="Ask the customer for the single-use 6-digit authorization PIN"
    >
      <form onSubmit={handleVerify} className="space-y-5">
        <div className="p-3.5 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm text-center">
          <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mb-3">
            The customer displays this PIN on their device after granting consent:
          </p>

          {/* 6-box PIN input */}
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                id={`pin-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleDigitChange(idx, e.target.value)}
                onKeyDown={e => handleKeyDown(idx, e)}
                disabled={attemptsLeft === 0 || loading}
                className={`
                  w-10 h-12 sm:w-12 sm:h-14 text-center font-mono text-xl font-extrabold rounded-xl
                  bg-vault-lightSurface dark:bg-slate-900 text-vault-lightText dark:text-vault-darkText
                  shadow-neu-pressed dark:shadow-neu-dark-pressed
                  border border-slate-200 dark:border-slate-800
                  focus:border-vault-blue focus:ring-2 focus:ring-vault-blue/20 outline-none
                  ${error ? 'border-vault-red/50' : ''}
                `}
              />
            ))}
          </div>

        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs font-semibold text-vault-red">
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-3 pt-2">
          <NeuButton variant="flat" size="sm" type="button" onClick={onClose}>
            Cancel
          </NeuButton>
          <NeuButton
            variant="primary"
            size="md"
            type="submit"
            disabled={attemptsLeft === 0}
            loading={loading}
          >
            Authenticate & Open Document
          </NeuButton>
        </div>
      </form>
    </NeuModal>
  );
};
