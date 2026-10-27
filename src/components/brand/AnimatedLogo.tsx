import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ 
  size = 'md', 
  showText = true,
  className = '' 
}) => {
  const iconDimensions = {
    sm: { w: 32, h: 32, text: 'text-lg', subtext: 'text-[9px]' },
    md: { w: 42, h: 42, text: 'text-2xl', subtext: 'text-xs' },
    lg: { w: 56, h: 56, text: 'text-3xl', subtext: 'text-sm' },
  }[size];

  return (
    <motion.div 
      className={`inline-flex items-center gap-3 cursor-pointer group ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Neumorphic Logo Container with subtle Cyber Accent */}
      <div 
        className="relative flex items-center justify-center p-2.5 rounded-2xl bg-vault-lightSurface dark:bg-vault-darkSurface shadow-neu-flat dark:shadow-neu-dark-flat group-hover:shadow-neu-flat-lg dark:group-hover:shadow-neu-dark-flat-lg transition-all duration-300"
      >
        <motion.svg
          width={iconDimensions.w}
          height={iconDimensions.h}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="shieldGrad" x1="10" y1="10" x2="90" y2="90" gradientUnits="userSpaceOnUse">
              <stop stopColor="#4776E6" />
              <stop offset="1" stopColor="#36B6C5" />
            </linearGradient>
            <linearGradient id="docGrad" x1="30" y1="20" x2="70" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="1" stopColor="#E2E8F0" stopOpacity="0.8" />
            </linearGradient>
            <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Shield Outline draws itself */}
          <motion.path
            d="M50 8L18 22V50C18 70 32 86 50 92C68 86 82 70 82 50V22L50 8Z"
            stroke="url(#shieldGrad)"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          {/* 2. Document icon appears inside shield */}
          <motion.g
            initial={{ opacity: 0, scale: 0.7, y: 5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
          >
            {/* Document sheet */}
            <path
              d="M34 28H56L68 40V72C68 74.2 66.2 76 64 76H34C31.8 76 30 74.2 30 72V32C30 29.8 31.8 28 34 28Z"
              fill="url(#docGrad)"
              className="dark:fill-slate-700"
              stroke="#4776E6"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Folded corner */}
            <path
              d="M56 28V40H68"
              fill="#CBD5E1"
              className="dark:fill-slate-600"
              stroke="#4776E6"
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {/* Document text lines */}
            <line x1="38" y1="46" x2="52" y2="46" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="38" y1="54" x2="60" y2="54" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
            <line x1="38" y1="62" x2="48" y2="62" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
          </motion.g>

          {/* 3. Small lock closes with spring animation */}
          <motion.g
            initial={{ y: -6, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              delay: 0.85, 
              type: "spring", 
              stiffness: 400, 
              damping: 15 
            }}
            whileHover={{ scale: 1.08 }}
          >
            {/* Lock Shackle */}
            <path
              d="M44 58V53C44 49.7 46.7 47 50 47C53.3 47 56 49.7 56 53V58"
              stroke="#10B981"
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Lock Body */}
            <rect
              x="41"
              y="58"
              width="18"
              height="15"
              rx="3"
              fill="#10B981"
              className="shadow-sm"
            />
            {/* Keyhole */}
            <circle cx="50" cy="64" r="1.5" fill="#FFFFFF" />
            <line x1="50" y1="65.5" x2="50" y2="68.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
          </motion.g>

          {/* 5. Soft brief glow around completed logo */}
          <motion.circle
            cx="50"
            cy="50"
            r="44"
            stroke="#36B6C5"
            strokeWidth="1.5"
            strokeOpacity="0.4"
            fill="none"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [0.9, 1.08, 1], opacity: [0, 0.7, 0] }}
            transition={{ delay: 1.2, duration: 0.8 }}
          />
        </motion.svg>
      </div>

      {/* 4. Brand Name & Tagline */}
      {showText && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.4 }}
          className="flex flex-col"
        >
          <div className="flex items-center gap-1.5">
            <span className={`font-heading font-extrabold tracking-tight ${iconDimensions.text} bg-gradient-to-r from-vault-blue via-indigo-600 to-vault-cyan dark:from-vault-blueDark dark:to-vault-cyberCyan bg-clip-text text-transparent`}>
              PrintVault
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-vault-blue/10 dark:bg-vault-blue/20 text-vault-blue dark:text-vault-blueDark border border-vault-blue/20">
              SECURE
            </span>
          </div>
          <span className={`font-sans text-vault-lightMuted dark:text-vault-darkMuted font-medium tracking-wide ${iconDimensions.subtext}`}>
            Your Documents. Your Control.
          </span>
        </motion.div>
      )}
    </motion.div>
  );
};
