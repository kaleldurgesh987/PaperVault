import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check, RefreshCw, ShieldAlert, Clock, Sparkles } from 'lucide-react';
import { NeuButton } from './NeuButton';
import { NeuCard } from './NeuCard';

interface QRCodeDisplayProps {
  tokenCode: string; // e.g. "PV-8921-XQ"
  tokenString: string;
  expiresAt: string;
  isRevoked?: boolean;
  onRevoke?: () => void;
  onRegenerate?: () => void;
  shopName?: string;
}

// Generate a deterministic 21x21 QR matrix using standard QR finder patterns + payload hash
function generateQrMatrix(text: string): boolean[][] {
  const size = 25;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Finder pattern helper (7x7 with 3x3 core)
  const drawFinder = (startX: number, startY: number) => {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = true;
        }
      }
    }
  };

  // 3 Finder patterns
  drawFinder(0, 0);                 // Top-Left
  drawFinder(size - 7, 0);          // Top-Right
  drawFinder(0, size - 7);          // Bottom-Left

  // Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // Hash-based data fills
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    hash = ((hash << 5) - hash + text.charCodeAt(i)) | 0;
  }

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Don't overwrite finders or timing
      const inTL = r < 8 && c < 8;
      const inTR = r < 8 && c >= size - 8;
      const inBL = r >= size - 8 && c < 8;
      const isTiming = (r === 6 && (c >= 8 && c < size - 8)) || (c === 6 && (r >= 8 && r < size - 8));
      
      if (!inTL && !inTR && !inBL && !isTiming) {
        const seed = Math.sin(hash + r * 31 + c * 17) * 10000;
        matrix[r][c] = (seed - Math.floor(seed)) > 0.45;
      }
    }
  }

  return matrix;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({
  tokenCode,
  tokenString,
  expiresAt,
  isRevoked = false,
  onRevoke,
  onRegenerate,
  shopName
}) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const diff = new Date(expiresAt).getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft('00:00:00 (EXPIRED)');
        setIsExpired(true);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
        setIsExpired(false);
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(tokenCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const matrix = generateQrMatrix(tokenString || tokenCode);
  const cellSize = 8;
  const qrDimension = matrix.length * cellSize;

  return (
    <NeuCard variant="flat" className="p-6 flex flex-col items-center max-w-sm w-full mx-auto relative overflow-hidden">
      {/* Status Banner */}
      <div className="w-full flex items-center justify-between mb-4">
        <span className="text-xs font-mono font-semibold uppercase tracking-wider text-vault-lightMuted dark:text-vault-darkMuted">
          One-Time QR Token
        </span>
        <div className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold flex items-center gap-1.5 ${
          isRevoked 
            ? 'bg-red-500/10 text-vault-red border border-red-500/30' 
            : isExpired
            ? 'bg-amber-500/10 text-vault-amber border border-amber-500/30'
            : 'bg-emerald-500/10 text-vault-green border border-emerald-500/30'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isRevoked ? 'bg-vault-red' : isExpired ? 'bg-vault-amber' : 'bg-vault-green animate-pulse'}`} />
          {isRevoked ? 'REVOKED' : isExpired ? 'EXPIRED' : 'ACTIVE'}
        </div>
      </div>

      {/* QR Code Container */}
      <div className="relative p-5 rounded-2xl bg-white dark:bg-slate-900 shadow-neu-pressed dark:shadow-neu-dark-pressed border border-slate-200/50 dark:border-slate-800">
        <svg
          width={qrDimension}
          height={qrDimension}
          viewBox={`0 0 ${qrDimension} ${qrDimension}`}
          className={`transition-all duration-300 ${isRevoked || isExpired ? 'grayscale opacity-30' : ''}`}
        >
          {matrix.map((row, r) =>
            row.map((cell, c) => {
              if (!cell) return null;
              return (
                <rect
                  key={`${r}-${c}`}
                  x={c * cellSize}
                  y={r * cellSize}
                  width={cellSize - 0.5}
                  height={cellSize - 0.5}
                  rx={1}
                  className="fill-slate-900 dark:fill-cyan-400"
                />
              );
            })
          )}
        </svg>

        {/* Center Security Shield Icon */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-10 h-10 rounded-xl bg-vault-lightSurface dark:bg-vault-darkSurface shadow-neu-flat-sm flex items-center justify-center border border-vault-blue/40">
            <Sparkles size={18} className="text-vault-blue dark:text-vault-cyan" />
          </div>
        </div>

        {/* Animated Scanner Laser Line when Active */}
        {!isRevoked && !isExpired && (
          <motion.div
            className="absolute left-3 right-3 h-0.5 bg-gradient-to-r from-transparent via-vault-cyan to-transparent shadow-[0_0_8px_#36B6C5]"
            animate={{ top: ['12%', '88%', '12%'] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}

        {/* Revoked / Expired Overlay */}
        {(isRevoked || isExpired) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/70 rounded-2xl backdrop-blur-xs p-4 text-center">
            <ShieldAlert size={36} className="text-vault-red mb-1 animate-bounce" />
            <p className="text-xs font-bold font-mono text-white">
              {isRevoked ? 'TOKEN REVOKED' : 'TOKEN EXPIRED'}
            </p>
            <p className="text-[10px] text-slate-300 mt-1">Access to file has been permanently closed</p>
          </div>
        )}
      </div>

      {/* Display Code */}
      <div className="mt-4 flex items-center gap-2">
        <span className="font-mono text-xl font-extrabold tracking-widest text-vault-blue dark:text-vault-blueDark">
          {tokenCode}
        </span>
        <button
          onClick={copyToClipboard}
          className="p-1.5 rounded-lg text-vault-lightMuted hover:text-vault-lightText dark:hover:text-vault-darkText hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-colors"
          title="Copy Access Code"
        >
          {copied ? <Check size={16} className="text-vault-green" /> : <Copy size={16} />}
        </button>
      </div>

      {shopName && (
        <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
          Authorized for: <strong className="text-vault-lightText dark:text-vault-darkText">{shopName}</strong>
        </p>
      )}

      {/* Countdown Timer */}
      <div className="w-full mt-4 p-2.5 rounded-xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm dark:shadow-neu-dark-pressed flex items-center justify-center gap-2">
        <Clock size={15} className={isExpired ? 'text-vault-red' : 'text-vault-blue dark:text-vault-cyan'} />
        <span className="text-xs font-mono font-semibold text-vault-lightText dark:text-vault-darkText">
          Auto-Purge In: {timeLeft}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2.5 w-full mt-4">
        {onRegenerate && (
          <NeuButton
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={13} />}
            onClick={onRegenerate}
          >
            Regenerate
          </NeuButton>
        )}
        {onRevoke && !isRevoked && (
          <NeuButton
            variant="danger"
            size="sm"
            icon={<ShieldAlert size={13} />}
            onClick={onRevoke}
            className={!onRegenerate ? 'col-span-2' : ''}
          >
            Revoke Now
          </NeuButton>
        )}
      </div>
    </NeuCard>
  );
};
