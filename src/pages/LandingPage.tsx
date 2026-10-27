import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  QrCode, 
  Trash2, 
  FileText, 
  AlertTriangle, 
  EyeOff, 
  KeyRound, 
  ArrowRight, 
  CheckCircle2, 
  Store, 
  UserCheck, 
  Sparkles,
  ChevronRight,
  HelpCircle,
  Clock,
  Printer
} from 'lucide-react';
import { AnimatedLogo } from '../components/brand/AnimatedLogo';
import { NeuButton } from '../components/common/NeuButton';
import { NeuCard } from '../components/common/NeuCard';
import { useTheme } from '../context/ThemeContext';
import { Sun, Moon } from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const faqs = [
    {
      q: 'Why is emailing or WhatsApping documents to print shops dangerous?',
      a: 'When you send an Aadhaar card, PAN, or bank statement over WhatsApp or email, an unencrypted copy remains stored on the shopkeeper’s phone gallery, browser download folder, or desktop forever. These orphaned files are vulnerable to identity theft, secondary leakage, and employee misuse.'
    },
    {
      q: 'How does PrintVault prevent data leaks?',
      a: 'PrintVault replaces permanent attachments with single-use, time-bound QR tokens. The shopkeeper can only view the watermarked file after you approve access from your phone and enter a release PIN. The moment printing finishes, the platform wipes the file copy from storage.'
    },
    {
      q: 'Does PrintVault guarantee a shopkeeper cannot photograph the screen?',
      a: 'No, and we are transparent about this. No software can physically block a smartphone camera or an external camera photographing a display. However, PrintVault applies dynamic identifying watermarks, restricts raw file downloads, requires signed privacy pledges, and maintains a tamper-evident audit trail.'
    },
    {
      q: 'What is the Emergency Kill Switch?',
      a: 'If you leave a print shop, suspect strange behavior, or accidentally shared the wrong shop, clicking the Emergency Kill Switch instantly invalidates all active tokens and shreds cached document payloads on the platform.'
    }
  ];

  return (
    <div className="min-h-screen bg-vault-lightBg dark:bg-vault-darkBg text-vault-lightText dark:text-vault-darkText selection:bg-vault-blue selection:text-white transition-colors duration-300">
      {/* Floating Neumorphic Navbar */}
      <header className="sticky top-4 z-50 max-w-6xl mx-auto px-4">
        <div className="backdrop-blur-md bg-vault-lightSurface/90 dark:bg-vault-darkSurface/90 rounded-2xl px-5 py-3 shadow-neu-flat dark:shadow-neu-dark-flat border border-white/60 dark:border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <AnimatedLogo size="sm" showText={true} />
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-vault-lightMuted dark:text-vault-darkMuted">
            <a href="#how-it-works" className="hover:text-vault-blue transition-colors">How It Works</a>
            <a href="#problem" className="hover:text-vault-blue transition-colors">The Threat</a>
            <a href="#features" className="hover:text-vault-blue transition-colors">Security</a>
            <a href="#trust" className="hover:text-vault-blue transition-colors">Trust Model</a>
            <a href="#faq" className="hover:text-vault-blue transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-vault-lightMuted hover:text-vault-lightText shadow-neu-flat-sm dark:shadow-neu-dark-flat-sm active:shadow-neu-pressed-sm transition-all"
              title="Toggle Theme"
            >
              {isDark ? <Sun size={15} className="text-amber-400" /> : <Moon size={15} className="text-vault-blue" />}
            </button>

            <NeuButton
              variant="flat"
              size="sm"
              onClick={() => navigate('/auth?role=customer')}
              className="hidden sm:inline-flex"
            >
              Customer Portal
            </NeuButton>

            <NeuButton
              variant="primary"
              size="sm"
              onClick={() => navigate('/auth?role=shopkeeper')}
            >
              Shopkeeper Portal
            </NeuButton>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-vault-blue/10 dark:bg-vault-blue/20 text-vault-blue dark:text-vault-blueDark border border-vault-blue/20 text-xs font-mono font-bold">
              <ShieldCheck size={14} />
              <span>SECURE DOCUMENT ACCESS</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight leading-[1.15]">
              Print Securely. <br />
              <span className="bg-gradient-to-r from-vault-blue via-indigo-600 to-vault-cyan bg-clip-text text-transparent">
                Share Privately.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed max-w-xl mx-auto lg:mx-0">
              Send sensitive documents to print shops without losing control of your personal information. Secure QR sharing, temporary authorization, AI redaction, and automated storage shredding — all in one platform.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <NeuButton
                variant="primary"
                size="lg"
                icon={<ArrowRight size={18} />}
                onClick={() => navigate('/auth?role=customer')}
              >
                Get Started Securely
              </NeuButton>
              <a href="#how-it-works">
                <NeuButton
                  variant="secondary"
                  size="lg"
                  icon={<FileText size={18} />}
                >
                  See How It Works
                </NeuButton>
              </a>
            </div>

            {/* Micro badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-vault-lightMuted dark:text-vault-darkMuted font-mono">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-vault-green" /> Zero Storage Retention
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-vault-green" /> 6-Digit Release PIN
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={15} className="text-vault-green" /> Anti-Retention Watermark
              </span>
            </div>
          </div>

          {/* Right Animated Hero Graphic */}
          <div className="lg:col-span-5 flex justify-center">
            <NeuCard variant="flat-lg" className="p-8 max-w-sm w-full relative overflow-hidden">
              {/* Dynamic Connected Nodes Graphic */}
              <div className="relative flex flex-col items-center space-y-6">
                {/* Node 1: Customer Phone */}
                <div className="w-full p-3.5 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-vault-blue text-white flex items-center justify-center font-bold">
                      <ShieldCheck size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-vault-lightText dark:text-vault-darkText">Customer App</p>
                      <span className="text-[10px] font-mono text-vault-green">Encrypted Payload</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-vault-blue/15 text-vault-blue font-bold">
                    AUTH OWNER
                  </span>
                </div>

                {/* Animated Stream Beam */}
                <div className="h-10 w-0.5 bg-gradient-to-b from-vault-blue via-vault-cyan to-indigo-600 relative">
                  <motion.div
                    className="w-3 h-3 -left-1.25 rounded-full bg-vault-cyan shadow-[0_0_8px_#36B6C5] absolute"
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
                  />
                </div>

                {/* Node 2: Central Secure QR Gateway */}
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 shadow-neu-pressed border border-slate-200 dark:border-slate-800 text-center relative w-full flex flex-col items-center">
                  <QrCode size={64} className="text-slate-800 dark:text-cyan-400" />
                  <span className="mt-2 text-xs font-mono font-extrabold text-vault-blue tracking-widest">
                    TOKEN: PV-8921-XQ
                  </span>
                  <span className="text-[10px] text-vault-amber font-mono mt-0.5 flex items-center gap-1">
                    <Clock size={11} /> 1-Time 15 Min Expiry
                  </span>
                </div>

                {/* Animated Stream Beam */}
                <div className="h-10 w-0.5 bg-gradient-to-b from-vault-cyan to-vault-green relative">
                  <motion.div
                    className="w-3 h-3 -left-1.25 rounded-full bg-vault-green shadow-[0_0_8px_#10B981] absolute"
                    animate={{ top: ['0%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.6, delay: 0.8, ease: 'easeInOut' }}
                  />
                </div>

                {/* Node 3: Shopkeeper Terminal */}
                <div className="w-full p-3.5 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-vault-cyan text-slate-900 flex items-center justify-center font-bold">
                      <Store size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-vault-lightText dark:text-vault-darkText">Apex Cyber Print</p>
                      <span className="text-[10px] font-mono text-vault-blue">Verified GSTIN Shop</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/15 text-vault-green font-bold">
                    WATERMARKED
                  </span>
                </div>
              </div>
            </NeuCard>
          </div>
        </div>
      </section>

      {/* Section 1: The Problem Analysis */}
      <section id="problem" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold text-vault-red uppercase tracking-wider">
            Problem Statement M-04
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold">
            Why Everyday File Sharing Creates Identity Theft Disasters
          </h2>
          <p className="text-sm sm:text-base text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
            Customers frequently hand over their most intimate government documents to print shops via WhatsApp or email. Here is what happens next:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NeuCard variant="flat" hoverEffect className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-vault-red flex items-center justify-center shadow-neu-pressed-sm">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-base font-bold text-vault-lightText dark:text-vault-darkText">
              Indefinite Device Retention
            </h3>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
              Once sent on WhatsApp or Gmail, files live forever in the shopkeeper’s WhatsApp Media folder, browser cache, and desktop recycle bin.
            </p>
          </NeuCard>

          <NeuCard variant="flat" hoverEffect className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-vault-amber flex items-center justify-center shadow-neu-pressed-sm">
              <EyeOff size={24} />
            </div>
            <h3 className="text-base font-bold text-vault-lightText dark:text-vault-darkText">
              Zero Customer Control
            </h3>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
              The moment you walk out the door, you have zero visibility into who opens your tax filing, Aadhaar UID, or banking records on that shop PC.
            </p>
          </NeuCard>

          <NeuCard variant="flat" hoverEffect className="p-6 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-vault-blue/10 text-vault-blue flex items-center justify-center shadow-neu-pressed-sm">
              <Store size={24} />
            </div>
            <h3 className="text-base font-bold text-vault-lightText dark:text-vault-darkText">
              Shopkeeper Liability
            </h3>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
              Responsible shopkeepers do not want the legal liability of hoarding customer PII. PrintVault provides automated compliance without friction.
            </p>
          </NeuCard>
        </div>
      </section>

      {/* Section 2: How PrintVault Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold text-vault-blue dark:text-vault-cyan uppercase tracking-wider">
            Controlled 4-Step Lifecycle
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold">
            How PrintVault Protects Every Single Print Job
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Upload & AI Scan',
              desc: 'Select your PDF or image. The offline privacy engine identifies sensitive fields (Aadhaar, PAN, Bank) and offers one-click masking.'
            },
            {
              step: '02',
              title: 'Secure QR Token',
              desc: 'Generate a short-lived, encrypted QR token bound strictly to your chosen print shop with automated expiry countdown.'
            },
            {
              step: '03',
              title: 'Live Consent & PIN',
              desc: 'The shopkeeper scans the code. You approve access in real-time from your device and release the 6-digit decryption PIN.'
            },
            {
              step: '04',
              title: 'Spool & Auto-Purge',
              desc: 'The print job executes with watermarking. The moment it completes, platform storage securely shreds the file copy.'
            }
          ].map((item, idx) => (
            <NeuCard key={idx} variant="flat" className="p-6 space-y-3 relative overflow-hidden">
              <span className="font-mono text-3xl font-extrabold text-vault-blue/30 dark:text-vault-blueDark/20">
                {item.step}
              </span>
              <h4 className="text-base font-bold text-vault-lightText dark:text-vault-darkText">
                {item.title}
              </h4>
              <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
                {item.desc}
              </p>
            </NeuCard>
          ))}
        </div>
      </section>

      {/* Section 3: Interactive Security Features */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-mono font-bold text-vault-green uppercase tracking-wider">
            Enterprise-Grade Defenses
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold">
            12 Trust-Building Security Features
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <NeuCard variant="flat" className="p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-vault-blue/10 text-vault-blue flex items-center justify-center">
              <KeyRound size={20} />
            </div>
            <h4 className="text-sm font-bold">Secure Print Release PIN</h4>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
              6-digit customer PIN required before decrypting pages into the viewer. 3 attempt lock-out defense.
            </p>
          </NeuCard>

          <NeuCard variant="flat" className="p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-vault-red/10 text-vault-red flex items-center justify-center">
              <Trash2 size={20} />
            </div>
            <h4 className="text-sm font-bold">Emergency Kill Switch</h4>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
              Instantly revoke all active tokens, force-terminate viewer sessions, and shred file payloads in one click.
            </p>
          </NeuCard>

          <NeuCard variant="flat" className="p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-vault-cyan/10 text-vault-cyan flex items-center justify-center">
              <Sparkles size={20} />
            </div>
            <h4 className="text-sm font-bold">AI Privacy Intelligence</h4>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
              Detects Aadhaar UID, PAN, Bank IFSC, and contact records with risk scoring and permanent visual redaction.
            </p>
          </NeuCard>

          <NeuCard variant="flat" className="p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <UserCheck size={20} />
            </div>
            <h4 className="text-sm font-bold">Customer Consent Gate</h4>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
              Shopkeeper QR scan triggers a live push prompt. The shop cannot view your document without approval.
            </p>
          </NeuCard>

          <NeuCard variant="flat" className="p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-vault-green flex items-center justify-center">
              <FileText size={20} />
            </div>
            <h4 className="text-sm font-bold">Anti-Retention Watermark</h4>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
              Dynamic overlay with Shop ID, Request ID, and Timestamp burns into rendered pages to discourage copying.
            </p>
          </NeuCard>

          <NeuCard variant="flat" className="p-6 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Trash2 size={20} />
            </div>
            <h4 className="text-sm font-bold">Cryptographic Purge Proof</h4>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
              Digital receipts include a verifiable deletion hash proving that the server-side file was destroyed.
            </p>
          </NeuCard>
        </div>
      </section>

      {/* Section 4: Trust and Transparency Guarantee */}
      <section id="trust" className="py-20 px-4 sm:px-6 max-w-5xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60">
        <NeuCard variant="clay" className="p-8 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-vault-blue text-white flex items-center justify-center shadow-sm">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
                Our Transparency Principle
              </h3>
              <p className="text-xs font-mono text-vault-blue dark:text-vault-cyan">
                HONEST SECURITY ENGINEERING OVER FALSE MARKETING CLAIMS
              </p>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
            No ordinary web platform can guarantee that a malicious shopkeeper cannot point a physical smartphone camera at their monitor, retain a printed paper copy, or intercept raw bytes if their printer firmware is modified.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-vault-green space-y-1.5">
              <strong className="block font-bold">WHAT PRINTVAULT GUARANTEES:</strong>
              <p className="text-slate-700 dark:text-slate-300">
                • Temporary, customer-consented access with single-use tokens. <br />
                • Automated platform file shredding upon print completion. <br />
                • Full cryptographic audit trail and Emergency Kill Switch. <br />
                • Visual anti-retention watermarking and sensitive field redaction.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-vault-amber space-y-1.5">
              <strong className="block font-bold">TRANSPARENT LIMITATIONS:</strong>
              <p className="text-slate-700 dark:text-slate-300">
                • Cannot prevent external hardware photography of screens. <br />
                • Cannot recall physical paper once printed on ink/toner. <br />
                • Solved through verified shop pledges and customer reporting.
              </p>
            </div>
          </div>
        </NeuCard>
      </section>

      {/* Section 5: FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center mb-12 space-y-2">
          <span className="text-xs font-mono font-bold text-vault-blue uppercase tracking-wider">
            Clear Answers
          </span>
          <h2 className="text-3xl font-heading font-extrabold">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <NeuCard
              key={idx}
              variant="flat"
              className="p-5 cursor-pointer transition-all"
              onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-vault-lightText dark:text-vault-darkText">
                  {faq.q}
                </span>
                <ChevronRight
                  size={18}
                  className={`text-vault-blue transition-transform duration-200 flex-shrink-0 ${
                    activeFaq === idx ? 'rotate-90' : ''
                  }`}
                />
              </div>
              {activeFaq === idx && (
                <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-3 leading-relaxed border-t border-slate-200 dark:border-slate-800 pt-3">
                  {faq.a}
                </p>
              )}
            </NeuCard>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center">
        <NeuCard variant="flat-lg" className="p-10 sm:p-14 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-heading font-extrabold">
            Ready to Take Control of Your Documents?
          </h2>
          <p className="text-sm sm:text-base text-vault-lightMuted dark:text-vault-darkMuted max-w-xl mx-auto">
            Protect sensitive documents with controlled access, customer approval, and secure print workflows.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <NeuButton
              variant="primary"
              size="lg"
              icon={<ShieldCheck size={18} />}
              onClick={() => navigate('/auth?role=customer')}
            >
              Launch Customer Vault
            </NeuButton>
            <NeuButton
              variant="secondary"
              size="lg"
              icon={<Store size={18} />}
              onClick={() => navigate('/auth?role=shopkeeper')}
            >
              Launch Shopkeeper Terminal
            </NeuButton>
          </div>
        </NeuCard>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-xs text-vault-lightMuted dark:text-vault-darkMuted">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <AnimatedLogo size="sm" showText={false} />
            <span className="font-heading font-bold text-vault-lightText dark:text-vault-darkText">
              PrintVault
            </span>
          </div>

          <p className="font-mono text-[11px]">
            &copy; {new Date().getFullYear()} PrintVault. Built for Zero-Retention Printing.
          </p>
        </div>
      </footer>
    </div>
  );
};
