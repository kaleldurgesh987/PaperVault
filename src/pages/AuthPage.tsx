import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Store, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Building
} from 'lucide-react';
import { AnimatedLogo } from '../components/brand/AnimatedLogo';
import { NeuCard } from '../components/common/NeuCard';
import { NeuButton } from '../components/common/NeuButton';
import { NeuInput } from '../components/common/NeuInput';
import { useAuth } from '../context/AuthContext';

export const AuthPage: React.FC = () => {
  const { login, signup } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialRole = searchParams.get('role');
  const [activeTab, setActiveTab] = useState<'customer' | 'shopkeeper'>(
    initialRole === 'shopkeeper' ? 'shopkeeper' : 'customer'
  );
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [shopName, setShopName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignup) {
        const name = activeTab === 'shopkeeper' ? `${fullName} (${shopName || 'Print Shop'})` : fullName;
        await signup(name || email.split('@')[0], email, activeTab, phone);
      } else {
        await login(email, activeTab);
      }

      setLoading(false);
      navigate(activeTab === 'customer' ? '/customer' : '/shopkeeper');
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Authentication failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-vault-lightBg dark:bg-vault-darkBg flex items-center justify-center p-4 sm:p-6 transition-colors duration-300">
      <div className="max-w-md w-full space-y-6">
        {/* Brand Header */}
        <div className="text-center flex flex-col items-center">
          <AnimatedLogo size="md" showText={true} />
          <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-2">
            Secure Authentication Portal
          </p>
        </div>

        {/* Main Card */}
        <NeuCard variant="flat-lg" className="p-6 sm:p-8 space-y-6">
          {/* Role Tabs */}
          <div className="p-1 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm flex">
            <button
              type="button"
              onClick={() => {
                setActiveTab('customer');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'customer'
                  ? 'bg-vault-blue text-white shadow-sm'
                  : 'text-vault-lightMuted dark:text-vault-darkMuted hover:text-vault-lightText'
              }`}
            >
              <User size={15} />
              <span>Customer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('shopkeeper');
                setError(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                activeTab === 'shopkeeper'
                  ? 'bg-vault-cyan text-slate-900 shadow-sm'
                  : 'text-vault-lightMuted dark:text-vault-darkMuted hover:text-vault-lightText'
              }`}
            >
              <Store size={15} />
              <span>Shopkeeper</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <NeuInput
                label="Full Name"
                placeholder="e.g. Priya Sharma"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                leftIcon={<User size={16} />}
                required
              />
            )}

            {isSignup && activeTab === 'shopkeeper' && (
              <NeuInput
                label="Shop / Business Name"
                placeholder="e.g. Apex Cyber Print"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                leftIcon={<Building size={16} />}
                required
              />
            )}

            <NeuInput
              label="Email Address"
              type="email"
              placeholder={activeTab === 'customer' ? 'priya.sharma@example.com' : 'rahul@apexprint.in'}
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail size={16} />}
              required
            />

            <NeuInput
              label="Password"
              isPassword
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock size={16} />}
              required
            />

            {isSignup && (
              <NeuInput
                label="Mobile Number (Optional)"
                placeholder="+91 98765 43210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                leftIcon={<Phone size={16} />}
              />
            )}

            {error && (
              <p className="text-xs text-vault-red font-semibold pl-1">
                {error}
              </p>
            )}

            <NeuButton
              variant="primary"
              size="lg"
              type="submit"
              loading={loading}
              className="w-full mt-2"
            >
              {isSignup ? `Create ${activeTab === 'customer' ? 'Customer' : 'Shopkeeper'} Account` : `Sign In as ${activeTab === 'customer' ? 'Customer' : 'Shopkeeper'}`}
            </NeuButton>
          </form>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
            <span className="mx-3 text-[10px] font-mono uppercase text-vault-lightMuted dark:text-vault-darkMuted">
              or
            </span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          </div>

          <button
            type="button"
            onClick={() => setError('Google sign-in is not configured yet. Use email sign-in or create an account.')}
            className="w-full flex items-center justify-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-vault-lightText dark:text-vault-darkText bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-flat-sm hover:shadow-neu-pressed-sm transition-all"
          >
            <span aria-hidden="true" className="font-bold text-base text-vault-blue">G</span>
            Continue with Google
          </button>

          {/* Toggle Login / Signup */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignup(!isSignup);
                setError(null);
              }}
              className="text-xs font-semibold text-vault-blue dark:text-vault-blueDark hover:underline"
            >
              {isSignup
                ? 'Already have an account? Sign In'
                : 'Need an account? Sign Up now'}
            </button>
          </div>

        </NeuCard>
      </div>
    </div>
  );
};
