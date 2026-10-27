import React from 'react';
import { 
  Upload, 
  Scan, 
  CheckCircle, 
  Eye, 
  Printer, 
  Lock, 
  Trash2,
  Clock
} from 'lucide-react';
import { DocumentAccessEvent } from '../../types';

interface TrustTimelineProps {
  events: DocumentAccessEvent[];
}

export const TrustTimeline: React.FC<TrustTimelineProps> = ({ events }) => {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'TOKEN_GENERATED':
        return <Upload size={14} className="text-vault-blue" />;
      case 'ACCESS_REQUESTED':
        return <Scan size={14} className="text-vault-amber" />;
      case 'CUSTOMER_CONSENT_GRANTED':
        return <CheckCircle size={14} className="text-vault-green" />;
      case 'DOCUMENT_VIEWED':
        return <Eye size={14} className="text-vault-cyan" />;
      case 'PRINT_STARTED':
      case 'PRINT_COMPLETED':
        return <Printer size={14} className="text-indigo-500" />;
      case 'ACCESS_REVOKED_MANUAL':
      case 'EMERGENCY_KILL_SWITCH':
      case 'ACCESS_EXPIRED':
        return <Lock size={14} className="text-vault-red" />;
      case 'STORAGE_FILE_PURGED':
        return <Trash2 size={14} className="text-purple-500" />;
      default:
        return <Clock size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
      {events.map((evt, idx) => (
        <div key={evt.id || idx} className="relative group">
          {/* Circle indicator */}
          <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-vault-lightSurface dark:bg-vault-darkSurface shadow-neu-flat-sm flex items-center justify-center border border-white/60 dark:border-slate-700">
            {getEventIcon(evt.event_type)}
          </div>

          <div className="p-3 rounded-xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-flat-sm dark:shadow-neu-dark-flat-sm border border-white/30 dark:border-slate-800/80">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-vault-lightText dark:text-vault-darkText">
                {evt.event_type.replace(/_/g, ' ')}
              </span>
              <span className="text-[10px] font-mono text-vault-lightMuted dark:text-vault-darkMuted">
                {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
            </div>

            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
              {evt.details}
            </p>

            <div className="mt-2 flex items-center gap-2 text-[10px] font-mono text-vault-blue dark:text-vault-cyan">
              <span>Actor: {evt.actor_role.toUpperCase()} ({evt.actor_id})</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
