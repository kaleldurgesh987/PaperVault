import React, { useState, useEffect } from 'react';
import { 
  Store, 
  ShieldCheck, 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Building, 
  MapPin, 
  Phone, 
  Mail
} from 'lucide-react';
import { NeuCard } from '../../components/common/NeuCard';
import { NeuButton } from '../../components/common/NeuButton';
import { PrivacyPledgeModal } from '../../components/shopkeeper/PrivacyPledgeModal';
import { db } from '../../services/dbService';
import { Shop } from '../../types';

export const ShopkeeperProfilePage: React.FC = () => {
  const [shop, setShop] = useState<Shop | undefined>(() => db.getShopById('shop_apex_01'));
  const [pledgeOpen, setPledgeOpen] = useState(false);

  const loadData = () => {
    const s = db.getShopById('shop_apex_01');
    setShop(s);
  };

  useEffect(() => {
    loadData();
    window.addEventListener('printvault:state_change', loadData);
    return () => window.removeEventListener('printvault:state_change', loadData);
  }, []);

  if (!shop) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
          Print Shop Profile & Trust Accreditation
        </h1>
        <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
          Government business verification and binding zero-retention privacy covenant
        </p>
      </div>

      {/* Main Profile Info Card */}
      <NeuCard variant="flat" className="p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-vault-cyan/20 text-slate-800 dark:text-cyan-300 flex items-center justify-center font-extrabold text-2xl shadow-neu-pressed">
              <Store size={32} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-heading font-bold text-vault-lightText dark:text-vault-darkText">
                  {shop.name}
                </h2>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold ${
                  shop.verification_status === 'verified'
                    ? 'bg-emerald-500/15 text-vault-green border border-emerald-500/30'
                    : 'bg-amber-500/15 text-vault-amber border border-amber-500/30'
                }`}>
                  {shop.verification_status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-vault-lightMuted font-mono mt-0.5">
                Registration: {shop.registration_number}
              </p>
            </div>
          </div>

        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm space-y-2">
            <div className="flex items-center gap-2 text-vault-lightMuted font-mono uppercase text-[10px] font-bold">
              <MapPin size={13} /> Location & Address
            </div>
            <p className="font-semibold text-vault-lightText dark:text-vault-darkText">
              {shop.address}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm space-y-2">
            <div className="flex items-center gap-2 text-vault-lightMuted font-mono uppercase text-[10px] font-bold">
              <Phone size={13} /> Contact Telephone & Email
            </div>
            <p className="font-semibold text-vault-lightText dark:text-vault-darkText">
              {shop.phone} &bull; {shop.email}
            </p>
          </div>
        </div>
      </NeuCard>

      {/* Privacy Pledge Status Card */}
      <NeuCard variant="flat" className="p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-vault-blue/10 text-vault-blue">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-base font-bold text-vault-lightText dark:text-vault-darkText">
                Shopkeeper Privacy Commitment
              </h3>
              <p className="text-xs text-vault-lightMuted font-mono">
                Platform Standard Policy {shop.privacy_policy_version || 'v2.4-2026'}
              </p>
            </div>
          </div>

          <NeuButton
            variant="secondary"
            size="sm"
            icon={<FileCheck size={14} />}
            onClick={() => setPledgeOpen(true)}
          >
            {shop.privacy_pledge_signed ? 'Review Signed Terms' : 'Sign Privacy Pledge'}
          </NeuButton>
        </div>

        {shop.privacy_pledge_signed ? (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-slate-700 dark:text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-vault-green font-bold">
              <CheckCircle2 size={16} />
              <span>Covenant Signed on {new Date(shop.privacy_pledge_date || Date.now()).toLocaleDateString()}</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              This shop has agreed never to retain customer documents outside temporary spooling, to shred misprints, and to accept liability for device leaks.
            </p>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-vault-amber">
            Signing the privacy commitment is required to receive trusted customer badges.
          </div>
        )}
      </NeuCard>

      <PrivacyPledgeModal
        isOpen={pledgeOpen}
        onClose={() => setPledgeOpen(false)}
        shopId={shop.id}
        onSigned={loadData}
      />
    </div>
  );
};
