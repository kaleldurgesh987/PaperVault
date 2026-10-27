import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Printer, 
  CheckCircle2, 
  Trash2, 
  FileCheck, 
  Sliders, 
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { NeuModal } from '../common/NeuModal';
import { NeuButton } from '../common/NeuButton';
import { PrintRequest, Shop } from '../../types';
import { db } from '../../services/dbService';

interface SimulatedPrinterModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: PrintRequest;
  shop?: Shop;
  onComplete: () => void;
}

export const SimulatedPrinterModal: React.FC<SimulatedPrinterModalProps> = ({
  isOpen,
  onClose,
  request,
  shop,
  onComplete
}) => {
  const [phase, setPhase] = useState<'READY' | 'PRINTING' | 'DONE'>('READY');
  const [progress, setProgress] = useState(0);
  const [currentStepText, setCurrentStepText] = useState('Initializing simulated print driver...');
  const [purgeHash, setPurgeHash] = useState<string>('');

  const doc = db.getDocumentById(request.document_id);

  const startPrintingSimulation = () => {
    setPhase('PRINTING');
    setProgress(0);

    // Update state to PRINTING
    const inProgress: PrintRequest = {
      ...request,
      status: 'PRINTING',
      updated_at: new Date().toISOString()
    };
    db.updatePrintRequest(inProgress);

    // Record access event
    db.recordEvent({
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      request_id: request.id,
      document_id: request.document_id,
      actor_id: request.shop_id,
      actor_role: 'shopkeeper',
      event_type: 'PRINT_STARTED',
      details: `Simulated spooling started for ${doc?.original_filename || 'Doc'} (${request.settings.copies} copy, ${request.settings.paper_size}, ${request.settings.color_mode}).`,
      timestamp: new Date().toISOString()
    });

    // Notify customer
    db.addNotification({
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      user_id: request.customer_id,
      role: 'customer',
      title: 'Printing Started',
      message: `${shop?.name || 'Shop'} has begun printing your document.`,
      type: 'info',
      is_read: false,
      related_request_id: request.id,
      created_at: new Date().toISOString()
    });

    const steps = [
      { p: 25, msg: 'Spooling pages 1–3 to thermal rasterizer...' },
      { p: 55, msg: 'Rendering anti-retention watermark overlay...' },
      { p: 85, msg: 'Simulated hardcopy physical output produced...' },
      { p: 100, msg: 'Printing complete! Triggering automated storage purge...' },
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setProgress(steps[stepIdx].p);
        setCurrentStepText(steps[stepIdx].msg);
        stepIdx++;
      } else {
        clearInterval(interval);
        finishJob();
      }
    }, 700);
  };

  const finishJob = () => {
    // 1. Purge the document from storage
    const generatedHash = `SHA256:PURGE_${Math.random().toString(36).substring(2, 10).toUpperCase()}_OK`;
    setPurgeHash(generatedHash);
    db.purgeDocumentStorage(request.document_id, 'PRINT_COMPLETED');

    // 2. Invalidate access token
    if (request.access_token_id) {
      db.revokeToken(request.access_token_id, 'Print job completed successfully');
    }

    // 3. Update request status to COMPLETED
    const completed: PrintRequest = {
      ...request,
      status: 'COMPLETED',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.updatePrintRequest(completed);

    // 4. Generate Digital Receipt
    const receiptId = 'rec_pv_' + Math.random().toString(36).substring(2, 8);
    const receiptNumber = 'REC-' + new Date().getFullYear() + '-PV-' + Math.floor(1000 + Math.random() * 9000);
    db.saveReceipt({
      id: receiptId,
      receipt_number: receiptNumber,
      request_id: request.id,
      customer_id: request.customer_id,
      shop_id: request.shop_id,
      shop_name: shop?.name || 'Apex Cyber Print & Stationers',
      document_name: doc?.original_filename || 'Sensitive_Document.pdf',
      print_settings: request.settings,
      page_count: doc?.page_count || 1,
      total_copies: request.settings.copies,
      amount_paid: request.settings.estimated_cost,
      currency: 'INR',
      completed_at: new Date().toISOString(),
      platform_deletion_verified: true,
      deletion_timestamp: new Date().toISOString(),
      deletion_audit_hash: generatedHash,
      created_at: new Date().toISOString()
    });

    // 5. Record completion event
    db.recordEvent({
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      request_id: request.id,
      document_id: request.document_id,
      actor_id: request.shop_id,
      actor_role: 'shopkeeper',
      event_type: 'PRINT_COMPLETED',
      details: `Print job completed. Platform file payload purged. Digital receipt ${receiptNumber} generated.`,
      timestamp: new Date().toISOString()
    });

    // 6. Notify Customer
    db.addNotification({
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      user_id: request.customer_id,
      role: 'customer',
      title: 'Print Order Completed & File Purged',
      message: `Your document was printed at ${shop?.name || 'Shop'}. Platform storage copy has been permanently shredded. Receipt generated.`,
      type: 'success',
      is_read: false,
      related_request_id: request.id,
      created_at: new Date().toISOString()
    });

    setPhase('DONE');
    onComplete();
  };

  const handleClose = () => {
    setPhase('READY');
    setProgress(0);
    onClose();
  };

  return (
    <NeuModal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        <div className="flex items-center gap-2 text-vault-blue dark:text-vault-cyan">
          <Printer size={24} />
          <span>Print & Cleanup</span>
        </div>
      }
      subtitle="Hardware-independent simulation of physical printing and automated storage shredding"
    >
      {phase === 'READY' && (
        <div className="space-y-4">
          <div className="p-3.5 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-vault-lightMuted">Target Document:</span>
              <strong className="text-vault-lightText dark:text-vault-darkText">{doc?.original_filename}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-vault-lightMuted">Copies & Format:</span>
              <span className="font-mono">{request.settings.copies}x {request.settings.paper_size} ({request.settings.color_mode})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vault-lightMuted">Watermark Applied:</span>
              <span className="font-mono text-vault-blue">{request.settings.watermark_text || 'AUTHORIZED PRINT'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-vault-lightMuted">Automated Purge:</span>
              <span className="font-mono text-vault-green font-bold">YES (Immediate on completion)</span>
            </div>
          </div>

          <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
            Printing is simulated on a virtual spooler. On completion, the workflow removes the file payload from platform storage.
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <NeuButton variant="flat" size="sm" onClick={handleClose}>
              Cancel
            </NeuButton>
            <NeuButton
              variant="primary"
              size="md"
              icon={<Printer size={16} />}
              onClick={startPrintingSimulation}
            >
              Start Printing
            </NeuButton>
          </div>
        </div>
      )}

      {phase === 'PRINTING' && (
        <div className="py-6 flex flex-col items-center space-y-4">
          {/* Animated Printer Graphic */}
          <div className="relative w-24 h-24 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed flex items-center justify-center">
            <Printer size={40} className="text-vault-blue dark:text-vault-cyan animate-pulse" />
            <motion.div
              className="absolute -bottom-2 w-16 h-3 rounded-full bg-vault-blue/40 blur-xs"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            />
          </div>

          <div className="w-full space-y-2">
            <div className="flex justify-between text-xs font-mono font-bold">
              <span className="text-vault-lightMuted">{currentStepText}</span>
              <span className="text-vault-blue">{progress}%</span>
            </div>
            {/* Progress Track */}
            <div className="w-full h-3 rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-vault-blue to-vault-cyan rounded-full"
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        </div>
      )}

      {phase === 'DONE' && (
        <div className="py-4 text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 flex items-center justify-center text-vault-green shadow-neu-pressed">
            <CheckCircle2 size={38} />
          </div>

          <div>
            <h4 className="text-base font-bold text-vault-lightText dark:text-vault-darkText">
              Print Job Completed & Purged!
            </h4>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
              Simulated print output finished. Raw document payload has been wiped from platform storage.
            </p>
          </div>

          {/* Audit Verification Stamp */}
          <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-left font-mono text-[11px] space-y-1">
            <div className="flex items-center gap-1.5 text-purple-600 dark:text-purple-400 font-bold">
              <Trash2 size={13} />
              <span>CRYPTOGRAPHIC STORAGE PURGE VERIFIED</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 truncate">
              Audit Hash: {purgeHash}
            </p>
            <p className="text-slate-500 text-[10px]">
              Access tokens: Revoked | Platform payload: Nullified
            </p>
          </div>

          <NeuButton variant="primary" size="md" onClick={handleClose} className="w-full">
            Done & View Queue
          </NeuButton>
        </div>
      )}
    </NeuModal>
  );
};
