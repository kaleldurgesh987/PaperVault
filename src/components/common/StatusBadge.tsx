import React from 'react';
import { PrintStatus, DeletionStatus } from '../../types';

interface StatusBadgeProps {
  status: PrintStatus | DeletionStatus | string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'PENDING':
        return {
          bg: 'bg-blue-500/10 text-vault-blue border-vault-blue/30',
          dot: 'bg-vault-blue',
          label: 'Pending Shop Review'
        };
      case 'ACCEPTED':
        return {
          bg: 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/30',
          dot: 'bg-sky-500',
          label: 'Accepted by Shop'
        };
      case 'AWAITING_APPROVAL':
        return {
          bg: 'bg-amber-500/15 text-vault-amber border-amber-500/40',
          dot: 'bg-vault-amber animate-pulse',
          label: 'Consent Needed'
        };
      case 'APPROVED':
        return {
          bg: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/30',
          dot: 'bg-indigo-500',
          label: 'Consent Approved'
        };
      case 'PRINTING':
        return {
          bg: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/40',
          dot: 'bg-vault-cyan animate-ping',
          label: 'Spooling & Printing'
        };
      case 'READY':
        return {
          bg: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/30',
          dot: 'bg-teal-500',
          label: 'Ready for Pickup'
        };
      case 'COMPLETED':
        return {
          bg: 'bg-emerald-500/15 text-vault-green border-emerald-500/40',
          dot: 'bg-vault-green',
          label: 'Completed'
        };
      case 'CANCELLED':
        return {
          bg: 'bg-red-500/10 text-vault-red border-red-500/30',
          dot: 'bg-vault-red',
          label: 'Cancelled / Revoked'
        };
      case 'EXPIRED':
        return {
          bg: 'bg-slate-500/10 text-slate-500 border-slate-500/30',
          dot: 'bg-slate-400',
          label: 'Expired'
        };
      case 'PURGED_VERIFIED':
        return {
          bg: 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30',
          dot: 'bg-purple-500',
          label: 'Platform Purged'
        };
      case 'ACTIVE':
        return {
          bg: 'bg-emerald-500/10 text-vault-green border-emerald-500/30',
          dot: 'bg-vault-green',
          label: 'Active'
        };
      default:
        return {
          bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/30',
          dot: 'bg-slate-400',
          label: status
        };
    }
  };

  const config = getBadgeConfig();
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-mono font-bold rounded-full border ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
