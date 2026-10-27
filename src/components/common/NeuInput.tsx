import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface NeuInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  isPassword?: boolean;
}

export const NeuInput: React.FC<NeuInputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightElement,
  isPassword = false,
  className = '',
  type = 'text',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-xs font-semibold text-vault-lightMuted dark:text-vault-darkMuted uppercase tracking-wider pl-1">
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 text-vault-lightMuted dark:text-vault-darkMuted pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          type={inputType}
          className={`
            w-full rounded-xl px-4 py-3 text-sm
            bg-vault-lightSurface dark:bg-[#1a2230]
            text-vault-lightText dark:text-vault-darkText
            shadow-neu-pressed dark:shadow-neu-dark-pressed
            placeholder:text-slate-400 dark:placeholder:text-slate-500
            border border-slate-200/50 dark:border-slate-800/80
            focus:border-vault-blue/50 dark:focus:border-vault-blueDark/50
            focus:outline-none focus:ring-2 focus:ring-vault-blue/20 dark:focus:ring-vault-blueDark/20
            transition-all duration-200
            ${leftIcon ? 'pl-10' : ''}
            ${isPassword || rightElement ? 'pr-11' : ''}
            ${error ? 'border-vault-red/60 focus:ring-vault-red/20' : ''}
            ${className}
          `}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 p-1 text-vault-lightMuted hover:text-vault-lightText dark:hover:text-vault-darkText transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}

        {!isPassword && rightElement && (
          <div className="absolute right-3 flex items-center">
            {rightElement}
          </div>
        )}
      </div>

      {error ? (
        <p className="text-xs text-vault-red pl-1 font-medium">{error}</p>
      ) : hint ? (
        <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted pl-1">{hint}</p>
      ) : null}
    </div>
  );
};
