import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface NeuCardProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  variant?: 'flat' | 'flat-sm' | 'flat-lg' | 'pressed' | 'clay';
  hoverEffect?: boolean;
  className?: string;
  cyberGlow?: boolean;
}

export const NeuCard: React.FC<NeuCardProps> = ({
  children,
  variant = 'flat',
  hoverEffect = false,
  cyberGlow = false,
  className = '',
  ...props
}) => {
  const getShadowClass = () => {
    switch (variant) {
      case 'flat-sm':
        return 'shadow-neu-flat-sm dark:shadow-neu-dark-flat-sm';
      case 'flat-lg':
        return 'shadow-neu-flat-lg dark:shadow-neu-dark-flat-lg';
      case 'pressed':
        return 'shadow-neu-pressed dark:shadow-neu-dark-pressed';
      case 'clay':
        return 'shadow-clay-card dark:shadow-clay-card-dark';
      case 'flat':
      default:
        return 'shadow-neu-flat dark:shadow-neu-dark-flat';
    }
  };

  return (
    <motion.div
      whileHover={hoverEffect ? { y: -4, transition: { duration: 0.2 } } : undefined}
      className={`
        bg-vault-lightSurface dark:bg-vault-darkSurface 
        text-vault-lightText dark:text-vault-darkText 
        rounded-2xl transition-all duration-300
        ${getShadowClass()}
        ${cyberGlow ? 'border border-vault-cyan/30 dark:border-vault-cyberCyan/30 shadow-cyber-glow' : 'border border-white/40 dark:border-slate-700/40'}
        ${className}
      `}
      {...props}
    >
      {children}
    </motion.div>
  );
};
