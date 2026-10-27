import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

export interface NeuButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'flat' | 'pressed';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const NeuButton: React.FC<NeuButtonProps> = ({
  children,
  variant = 'flat',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-2.5 text-sm rounded-xl gap-2 font-medium',
    lg: 'px-6 py-3.5 text-base rounded-2xl gap-2.5 font-semibold',
  }[size];

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-gradient-to-r from-vault-blue to-indigo-600 text-white 
          shadow-[6px_6px_14px_rgba(71,118,230,0.35),-4px_-4px_10px_rgba(255,255,255,0.7)]
          hover:brightness-105 active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3)]
        `;
      case 'danger':
        return `
          bg-gradient-to-r from-red-500 to-vault-red text-white 
          shadow-[6px_6px_14px_rgba(220,38,38,0.35),-4px_-4px_10px_rgba(255,255,255,0.7)]
          hover:brightness-105 active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3)]
        `;
      case 'success':
        return `
          bg-gradient-to-r from-emerald-500 to-vault-green text-white 
          shadow-[6px_6px_14px_rgba(22,163,74,0.35),-4px_-4px_10px_rgba(255,255,255,0.7)]
          hover:brightness-105 active:shadow-[inset_3px_3px_6px_rgba(0,0,0,0.3)]
        `;
      case 'secondary':
        return `
          bg-vault-lightSurface dark:bg-vault-darkSurface 
          text-vault-blue dark:text-vault-blueDark border border-vault-blue/20
          shadow-neu-flat dark:shadow-neu-dark-flat
          hover:shadow-neu-flat-sm dark:hover:shadow-neu-dark-flat-sm
          active:shadow-neu-pressed dark:active:shadow-neu-dark-pressed
        `;
      case 'pressed':
        return `
          bg-vault-lightSurface dark:bg-vault-darkSurface 
          text-vault-blue dark:text-vault-blueDark
          shadow-neu-pressed dark:shadow-neu-dark-pressed
        `;
      case 'flat':
      default:
        return `
          bg-vault-lightSurface dark:bg-vault-darkSurface 
          text-vault-lightText dark:text-vault-darkText
          shadow-neu-flat-sm dark:shadow-neu-dark-flat-sm 
          hover:shadow-neu-flat dark:hover:shadow-neu-dark-flat
          active:shadow-neu-pressed-sm dark:active:shadow-neu-dark-pressed
        `;
    }
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : undefined}
      whileTap={!disabled && !loading ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.15, ease: 'easeInOut' }}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        inline-flex items-center justify-center cursor-pointer select-none
        transition-all duration-200 outline-none
        ${sizeStyles}
        ${getVariantStyles()}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon && <span className="flex-shrink-0">{icon}</span>
      )}
      <span>{children}</span>
    </motion.button>
  );
};
