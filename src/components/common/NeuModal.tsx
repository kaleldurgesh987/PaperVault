import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface NeuModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
}

export const NeuModal: React.FC<NeuModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = 'md',
  showCloseButton = true,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
  }[maxWidth];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className={`
              relative w-full ${widthClasses} z-10 my-8
              bg-vault-lightSurface dark:bg-vault-darkSurface
              rounded-3xl p-6 sm:p-8
              shadow-neu-flat-lg dark:shadow-neu-dark-flat-lg
              border border-white/60 dark:border-slate-700/60
            `}
          >
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-start justify-between mb-5 gap-4">
                <div>
                  {typeof title === 'string' ? (
                    <h3 className="text-xl font-heading font-bold text-vault-lightText dark:text-vault-darkText">
                      {title}
                    </h3>
                  ) : (
                    title
                  )}
                  {subtitle && (
                    <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
                      {subtitle}
                    </p>
                  )}
                </div>

                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-2 rounded-xl text-vault-lightMuted hover:text-vault-lightText dark:hover:text-vault-darkText shadow-neu-flat-sm dark:shadow-neu-dark-flat-sm active:shadow-neu-pressed-sm transition-all"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div>{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
