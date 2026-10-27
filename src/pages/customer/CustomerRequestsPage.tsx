import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  Store, 
  Clock, 
  CheckCircle2, 
  Trash2, 
  Filter, 
  Eye, 
  Receipt,
  AlertTriangle
} from 'lucide-react';
import { NeuCard } from '../../components/common/NeuCard';
import { NeuButton } from '../../components/common/NeuButton';
import { StatusBadge } from '../../components/common/StatusBadge';
import { db } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { PrintRequest } from '../../types';

export const CustomerRequestsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [requests, setRequests] = useState<PrintRequest[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'>('ALL');

  const loadRequests = () => {
    const list = db.getPrintRequests();
    setRequests(list.filter(r => r.customer_id === user?.id || user?.id === 'usr_cust_01'));
  };

  useEffect(() => {
    loadRequests();
    window.addEventListener('printvault:state_change', loadRequests);
    return () => window.removeEventListener('printvault:state_change', loadRequests);
  }, [user]);

  const filtered = requests.filter(r => {
    if (filter === 'ACTIVE') return r.status !== 'COMPLETED' && r.status !== 'CANCELLED' && r.status !== 'EXPIRED';
    if (filter === 'COMPLETED') return r.status === 'COMPLETED';
    if (filter === 'CANCELLED') return r.status === 'CANCELLED' || r.status === 'EXPIRED';
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
            My Print Requests
          </h1>
          <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
            Track the full lifecycle of your temporary print requests
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm">
          {(['ALL', 'ACTIVE', 'COMPLETED', 'CANCELLED'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                filter === f
                  ? 'bg-vault-blue text-white shadow-sm'
                  : 'text-vault-lightMuted dark:text-vault-darkMuted hover:text-vault-lightText'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <NeuCard variant="flat" className="p-12 text-center space-y-3">
          <FileText size={36} className="mx-auto text-slate-400" />
          <h3 className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
            No requests found in this category
          </h3>
          <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted">
            Upload a document to issue your first secure print request.
          </p>
          <NeuButton
            variant="primary"
            size="sm"
            onClick={() => navigate('/customer/upload')}
          >
            Upload Document
          </NeuButton>
        </NeuCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(req => {
            const doc = db.getDocumentById(req.document_id);
            const shop = db.getShopById(req.shop_id);

            return (
              <NeuCard key={req.id} variant="flat" className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-extrabold text-vault-blue">
                      {req.id.toUpperCase()}
                    </span>
                    <StatusBadge status={req.status} size="sm" />
                    {doc?.deletion_status === 'PURGED_VERIFIED' && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-600 dark:text-purple-400">
                        PURGED FROM DISK
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
                    {doc?.original_filename || 'Sensitive Document'}
                  </h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-vault-lightMuted dark:text-vault-darkMuted">
                    <span className="flex items-center gap-1">
                      <Store size={14} className="text-vault-blue" />
                      {shop?.name || 'Apex Cyber Print'}
                    </span>
                    <span>
                      {req.settings.copies}x {req.settings.paper_size} ({req.settings.color_mode})
                    </span>
                    <span className="font-mono">
                      Cost: ₹{req.settings.estimated_cost}
                    </span>
                    <span className="font-mono">
                      Created: {new Date(req.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  {req.shop_notes && (
                    <p className="text-xs text-vault-amber font-mono bg-amber-500/10 p-2 rounded-lg">
                      Note: {req.shop_notes}
                    </p>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {req.status === 'COMPLETED' ? (
                    <NeuButton
                      variant="primary"
                      size="sm"
                      icon={<Receipt size={14} />}
                      onClick={() => navigate('/customer/receipts')}
                    >
                      View Receipt
                    </NeuButton>
                  ) : req.status === 'AWAITING_APPROVAL' ? (
                    <NeuButton
                      variant="primary"
                      size="sm"
                      icon={<AlertTriangle size={14} />}
                      onClick={() => navigate('/customer/shares')}
                    >
                      Authorize Access
                    </NeuButton>
                  ) : (
                    <NeuButton
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/customer/shares')}
                    >
                      View QR Token
                    </NeuButton>
                  )}
                </div>
              </NeuCard>
            );
          })}
        </div>
      )}
    </div>
  );
};
