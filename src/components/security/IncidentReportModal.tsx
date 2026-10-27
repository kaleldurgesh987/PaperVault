import React, { useState } from 'react';
import { ShieldAlert, CheckCircle } from 'lucide-react';
import { NeuModal } from '../common/NeuModal';
import { NeuButton } from '../common/NeuButton';
import { NeuInput } from '../common/NeuInput';
import { db } from '../../services/dbService';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  customerId: string;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  isOpen,
  onClose,
  customerId
}) => {
  const [category, setCategory] = useState<'UNAUTHORIZED_RETENTION' | 'DEVICE_LEAK' | 'EXTRA_PRINTS_TAKEN' | 'SUSPICIOUS_BEHAVIOR' | 'OTHER'>('UNAUTHORIZED_RETENTION');
  const [shopName, setShopName] = useState('Apex Cyber Print & Stationers');
  const [description, setDescription] = useState('');
  const [ticketNum, setTicketNum] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedTicket = 'TKT-PV-' + Math.floor(100000 + Math.random() * 900000);
    db.saveIncident({
      id: 'inc_' + Math.random().toString(36).substring(2, 9),
      ticket_number: generatedTicket,
      customer_id: customerId,
      shop_id: 'shop_apex_01',
      incident_category: category,
      description,
      status: 'OPEN',
      created_at: new Date().toISOString()
    });

    db.recordSecurityEvent({
      id: 'sec_' + Date.now(),
      level: 'HIGH',
      type: 'UNAUTHORIZED_ACCESS',
      user_id: customerId,
      details: `Privacy incident report submitted: ${generatedTicket} (${category})`,
      timestamp: new Date().toISOString()
    });

    setTicketNum(generatedTicket);
  };

  const handleClose = () => {
    setTicketNum(null);
    setDescription('');
    onClose();
  };

  return (
    <NeuModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2 text-vault-red">
          <ShieldAlert size={22} />
          <span>Report Privacy Misuse</span>
        </div>
      }
      subtitle="Submit an encrypted audit ticket if you suspect unauthorized document retention"
    >
      {ticketNum ? (
        <div className="text-center py-4 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-vault-green shadow-neu-pressed">
            <CheckCircle size={32} />
          </div>
          <div>
            <h4 className="text-base font-bold text-vault-lightText dark:text-vault-darkText">
              Report Filed Successfully
            </h4>
            <p className="text-xs font-mono font-bold text-vault-blue mt-1">
              Ticket ID: {ticketNum}
            </p>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
              Our automated compliance engine will freeze new tokens for this shop pending review.
            </p>
          </div>
          <NeuButton variant="primary" size="md" onClick={handleClose} className="w-full">
            Close
          </NeuButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-vault-lightMuted dark:text-vault-darkMuted uppercase tracking-wider pl-1">
              Incident Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="mt-1 w-full rounded-xl px-4 py-2.5 text-xs bg-vault-lightSurface dark:bg-[#1a2230] text-vault-lightText dark:text-vault-darkText shadow-neu-pressed border border-slate-200 dark:border-slate-800 outline-none"
            >
              <option value="UNAUTHORIZED_RETENTION">Unauthorized Retention / WhatsApp Copy Kept</option>
              <option value="EXTRA_PRINTS_TAKEN">Extra Copies Printed Without Consent</option>
              <option value="DEVICE_LEAK">Screen Photographed or Desktop Saved</option>
              <option value="SUSPICIOUS_BEHAVIOR">Refusal to confirm cleanup</option>
              <option value="OTHER">Other Privacy Violation</option>
            </select>
          </div>

          <NeuInput
            label="Involved Print Shop"
            value={shopName}
            onChange={e => setShopName(e.target.value)}
            required
          />

          <div>
            <label className="text-xs font-semibold text-vault-lightMuted dark:text-vault-darkMuted uppercase tracking-wider pl-1">
              Incident Details
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe what occurred, what device was used, or what you observed..."
              rows={4}
              required
              className="mt-1 w-full rounded-xl p-3 text-xs bg-vault-lightSurface dark:bg-[#1a2230] text-vault-lightText dark:text-vault-darkText shadow-neu-pressed border border-slate-200 dark:border-slate-800 outline-none focus:ring-2 focus:ring-vault-red/20"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <NeuButton variant="flat" size="sm" type="button" onClick={handleClose}>
              Cancel
            </NeuButton>
            <NeuButton variant="danger" size="md" type="submit">
              Submit Audit Ticket
            </NeuButton>
          </div>
        </form>
      )}
    </NeuModal>
  );
};
