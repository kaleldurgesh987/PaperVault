import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Trash2, 
  AlertTriangle, 
  Lock, 
  FileCheck, 
  RotateCcw,
  ShieldCheck,
  Flag
} from 'lucide-react';
import { NeuCard } from '../../components/common/NeuCard';
import { NeuButton } from '../../components/common/NeuButton';
import { EmergencyKillSwitchModal } from '../../components/security/EmergencyKillSwitchModal';
import { IncidentReportModal } from '../../components/security/IncidentReportModal';
import { db } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { SecurityEvent } from '../../types';

export const CustomerPrivacyCenterPage: React.FC = () => {
  const { user } = useAuth();

  const [killSwitchOpen, setKillSwitchOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [secEvents, setSecEvents] = useState<SecurityEvent[]>(() => db.getSecurityEvents());

  const loadData = () => {
    setSecEvents(db.getSecurityEvents());
  };

  useEffect(() => {
    loadData();
    window.addEventListener('printvault:state_change', loadData);
    return () => window.removeEventListener('printvault:state_change', loadData);
  }, []);

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
          Privacy Center & Security Control
        </h1>
        <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
          Direct cryptographic controls, emergency panic switch, and incident reporting
        </p>
      </div>

      {/* Emergency Kill Switch Highlighted Hero Card */}
      <NeuCard variant="flat" className="p-6 sm:p-8 border-2 border-vault-red/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-vault-red flex items-center justify-center shadow-neu-pressed-sm">
              <ShieldAlert size={28} className="animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-bold text-vault-red">
                Emergency Kill Switch
              </h3>
              <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted">
                Instantly revoke all active tokens & shred cached documents in platform storage
              </p>
            </div>
          </div>

          <NeuButton
            variant="danger"
            size="lg"
            icon={<ShieldAlert size={18} />}
            onClick={() => setKillSwitchOpen(true)}
          >
            Engage Kill Switch
          </NeuButton>
        </div>

        <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed pt-2 border-t border-slate-200 dark:border-slate-800">
          If you have walked away from a print shop, suspect unauthorized attempts, or sent the wrong file, pressing this button revokes all active QR access codes and force-purges all document binaries on the platform server immediately.
        </p>
      </NeuCard>

      {/* Trust & Transparency Guidelines */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <NeuCard variant="flat" className="p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-vault-green flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <h4 className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
            Verified Zero-Retention
          </h4>
          <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
            All document payloads are stored temporarily with random internal storage identifiers. Once printed or expired, storage copies are unlinked and destroyed with SHA-256 verification hashes.
          </p>
        </NeuCard>

        <NeuCard variant="flat" className="p-6 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-vault-blue/10 text-vault-blue flex items-center justify-center">
              <Flag size={20} />
            </div>
            <NeuButton
              variant="secondary"
              size="sm"
              onClick={() => setReportModalOpen(true)}
            >
              Report Misuse
            </NeuButton>
          </div>
          <h4 className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
            Privacy Incident Reporting
          </h4>
          <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
            Did you observe a shopkeeper taking extra unauthorized prints or photographing your document? File an encrypted audit ticket to freeze the shop's verification status.
          </p>
        </NeuCard>
      </div>

      {/* Security Events Stream */}
      <div className="space-y-4">
        <h3 className="text-base font-heading font-bold text-vault-lightText dark:text-vault-darkText">
          Security & Access Events Log
        </h3>

        <NeuCard variant="flat" className="p-4 space-y-2.5">
          {secEvents.length === 0 ? (
            <p className="text-xs text-center py-4 text-vault-lightMuted">
              No security anomalies detected. System operating normally.
            </p>
          ) : (
            secEvents.map(evt => (
              <div
                key={evt.id}
                className="p-3 rounded-xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      evt.level === 'CRITICAL' ? 'bg-red-500/20 text-vault-red' : 'bg-amber-500/20 text-vault-amber'
                    }`}>
                      {evt.level}
                    </span>
                    <span className="font-mono font-bold text-vault-lightText dark:text-vault-darkText">
                      {evt.type}
                    </span>
                  </div>
                  <p className="text-vault-lightMuted dark:text-vault-darkMuted text-[11px] mt-1">
                    {evt.details}
                  </p>
                </div>
                <span className="text-[10px] font-mono text-vault-lightMuted whitespace-nowrap">
                  {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))
          )}
        </NeuCard>
      </div>

      <EmergencyKillSwitchModal
        isOpen={killSwitchOpen}
        onClose={() => setKillSwitchOpen(false)}
        customerId={user?.id || 'usr_cust_01'}
        onSuccess={loadData}
      />

      <IncidentReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
        customerId={user?.id || 'usr_cust_01'}
      />
    </div>
  );
};
