import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  Printer, 
  Download, 
  CheckCircle2, 
  Trash2, 
  Store, 
  FileText,
  ShieldCheck
} from 'lucide-react';
import { NeuCard } from '../../components/common/NeuCard';
import { NeuButton } from '../../components/common/NeuButton';
import { AnimatedLogo } from '../../components/brand/AnimatedLogo';
import { db } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { DigitalReceipt } from '../../types';

export const CustomerReceiptsPage: React.FC = () => {
  const { user } = useAuth();
  const [receipts, setReceipts] = useState<DigitalReceipt[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<DigitalReceipt | null>(null);

  const loadData = () => {
    const list = db.getReceipts();
    setReceipts(list.filter(r => r.customer_id === user?.id || user?.id === 'usr_cust_01'));
    if (list.length > 0 && !selectedReceipt) {
      setSelectedReceipt(list[0]);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('printvault:state_change', loadData);
    return () => window.removeEventListener('printvault:state_change', loadData);
  }, [user]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
          Digital Receipts & Audit Records
        </h1>
        <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
          Cryptographically signed print order settlements and platform deletion confirmations
        </p>
      </div>

      {receipts.length === 0 ? (
        <NeuCard variant="flat" className="p-12 text-center space-y-3">
          <Receipt size={36} className="mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
            No receipts generated yet
          </h3>
          <p className="text-xs text-vault-lightMuted">
            Receipts are automatically issued when a shop completes an authorized print order.
          </p>
        </NeuCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Receipts List */}
          <div className="lg:col-span-5 space-y-3">
            <h3 className="text-sm font-heading font-bold text-vault-lightText dark:text-vault-darkText mb-2">
              Completed Orders ({receipts.length})
            </h3>
            {receipts.map(r => (
              <NeuCard
                key={r.id}
                variant="flat-sm"
                className={`p-4 cursor-pointer transition-all ${
                  selectedReceipt?.id === r.id
                    ? 'border-vault-blue bg-vault-blue/5 shadow-neu-pressed-sm'
                    : 'hover:shadow-neu-flat'
                }`}
                onClick={() => setSelectedReceipt(r)}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-vault-blue">
                    {r.receipt_number}
                  </span>
                  <span className="text-xs font-bold text-vault-green">
                    ₹{r.amount_paid}
                  </span>
                </div>
                <p className="text-xs font-semibold text-vault-lightText dark:text-vault-darkText truncate mt-1">
                  {r.document_name}
                </p>
                <div className="flex items-center justify-between text-[11px] text-vault-lightMuted mt-1">
                  <span>{r.shop_name}</span>
                  <span className="font-mono">{new Date(r.completed_at).toLocaleDateString()}</span>
                </div>
              </NeuCard>
            ))}
          </div>

          {/* Right Detailed Receipt Card (Printable) */}
          <div className="lg:col-span-7">
            {selectedReceipt && (
              <div className="space-y-4">
                <div className="flex items-center justify-end gap-3">
                  <NeuButton
                    variant="primary"
                    size="sm"
                    icon={<Printer size={14} />}
                    onClick={handlePrint}
                  >
                    Print / Download PDF Receipt
                  </NeuButton>
                </div>

                <div 
                  id="printable-receipt"
                  className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-neu-flat-lg border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 space-y-6"
                >
                  {/* Receipt Header */}
                  <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
                    <div>
                      <AnimatedLogo size="sm" showText={true} />
                      <p className="text-[11px] font-mono text-vault-blue mt-1">
                        ZERO-RETENTION SECURE PRINTING PROTOCOL
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-vault-green border border-emerald-500/30">
                        OFFICIAL RECEIPT
                      </span>
                      <p className="text-xs font-mono font-bold mt-1 text-slate-600 dark:text-slate-400">
                        {selectedReceipt.receipt_number}
                      </p>
                    </div>
                  </div>

                  {/* Transaction Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-slate-400 font-mono text-[10px] uppercase">Print Shop</span>
                      <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {selectedReceipt.shop_name}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono">Verified Shop Partner</span>
                    </div>

                    <div className="text-right">
                      <span className="text-slate-400 font-mono text-[10px] uppercase">Completed Date</span>
                      <p className="font-mono font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                        {new Date(selectedReceipt.completed_at).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Order Specifications Table */}
                  <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden text-xs">
                    <div className="bg-slate-100 dark:bg-slate-800/60 p-3 font-mono font-bold text-slate-600 dark:text-slate-300 grid grid-cols-4">
                      <span className="col-span-2">Item & Settings</span>
                      <span className="text-center">Copies</span>
                      <span className="text-right">Price</span>
                    </div>
                    <div className="p-3 grid grid-cols-4 items-center border-t border-slate-200 dark:border-slate-800">
                      <div className="col-span-2">
                        <strong className="block truncate">{selectedReceipt.document_name}</strong>
                        <span className="text-[11px] text-slate-500">
                          {selectedReceipt.print_settings.paper_size} • {selectedReceipt.print_settings.color_mode} • {selectedReceipt.print_settings.sides} Sided
                        </span>
                      </div>
                      <div className="text-center font-mono">
                        {selectedReceipt.total_copies}
                      </div>
                      <div className="text-right font-mono font-bold text-vault-blue">
                        ₹{selectedReceipt.amount_paid}.00
                      </div>
                    </div>
                  </div>

                  {/* Platform Storage Deletion Certificate */}
                  <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs space-y-2">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold">
                      <Trash2 size={16} />
                      <span>CRYPTOGRAPHIC PLATFORM FILE PURGE CONFIRMATION</span>
                    </div>
                    <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                      The uploaded file copy has been permanently shredded from PrintVault platform-controlled storage. No digital replica remains on cloud servers.
                    </p>
                    <div className="p-2 rounded-xl bg-purple-500/15 font-mono text-[10px] break-all text-purple-700 dark:text-purple-300">
                      Audit Hash: {selectedReceipt.deletion_audit_hash}
                    </div>
                  </div>

                  {/* Footer Statement */}
                  <div className="text-center text-[10px] text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-4 font-mono">
                    PrintVault &bull; Protected Document Session
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
