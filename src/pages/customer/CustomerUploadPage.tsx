import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UploadCloud, 
  ShieldCheck, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Check, 
  Trash2, 
  Sparkles, 
  Store, 
  QrCode, 
  ArrowRight,
  Sliders,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { NeuCard } from '../../components/common/NeuCard';
import { NeuButton } from '../../components/common/NeuButton';
import { NeuInput } from '../../components/common/NeuInput';
import { QRCodeDisplay } from '../../components/common/QRCodeDisplay';
import { aiScannerService, AnalysisResult } from '../../services/aiScannerService';
import { db } from '../../services/dbService';
import { useAuth } from '../../context/AuthContext';
import { SensitiveFieldMatch, PrintSettings, PrintRequest, DocumentRecord } from '../../types';

export const CustomerUploadPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Multi-step workflow: 1. UPLOAD -> 2. AI_SCAN & REDACT -> 3. PRINT_SETTINGS -> 4. QR_READY
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // File state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Scan & Redaction state
  const [scanResult, setScanResult] = useState<AnalysisResult | null>(null);
  const [fields, setFields] = useState<SensitiveFieldMatch[]>([]);

  // Print settings
  const [paperSize, setPaperSize] = useState<'A4' | 'A3' | 'Letter'>('A4');
  const [colorMode, setColorMode] = useState<'BW' | 'COLOR'>('BW');
  const [sides, setSides] = useState<'SINGLE' | 'DOUBLE'>('SINGLE');
  const [copies, setCopies] = useState<number>(1);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [watermarkText, setWatermarkText] = useState('AUTHORIZED PRINT • DO NOT RETAIN');
  const [selectedShopId, setSelectedShopId] = useState('shop_apex_01');

  // Generated Request & Token
  const [createdRequest, setCreatedRequest] = useState<PrintRequest | null>(null);
  const [createdTokenCode, setCreatedTokenCode] = useState<string>('');

  const shops = db.getShops();

  // Handle file drop / select
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Create object URL for preview
    const preview = URL.createObjectURL(file);
    setFilePreview(preview);

    // Simulate genuine encrypted upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          runAiScan(file.name);
          return 100;
        }
        return prev + 25;
      });
    }, 150);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Run AI privacy scanner
  const runAiScan = (filename: string) => {
    const analysis = aiScannerService.scanTextAndMetadata(filename);
    setScanResult(analysis);
    setFields(analysis.detectedFields);
    setCurrentStep(2);
  };

  // Toggle redaction on a specific field
  const toggleRedactField = (fieldId: string) => {
    setFields(prev =>
      prev.map(f => (f.id === fieldId ? { ...f, redacted: !f.redacted } : f))
    );
  };

  // Redact all sensitive fields
  const handleRedactAll = () => {
    setFields(prev => prev.map(f => ({ ...f, redacted: true })));
  };

  // Create request and issue one-time QR token
  const handleGenerateShareToken = () => {
    if (!selectedFile) return;

    const docId = 'doc_' + Math.random().toString(36).substring(2, 9);
    const reqId = 'req_pv_' + Math.floor(1000 + Math.random() * 9000);
    const tokId = 'tok_sec_' + Math.floor(1000 + Math.random() * 9000);
    const displayCode = 'PV-' + Math.floor(1000 + Math.random() * 9000) + '-XQ';
    const releasePin = Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Save document metadata
    const docRecord: DocumentRecord = {
      id: docId,
      user_id: user?.id || 'usr_cust_01',
      original_filename: selectedFile.name,
      file_type: selectedFile.name.endsWith('.pdf') ? 'pdf' : 'png',
      file_size_bytes: selectedFile.size,
      file_hash_sha256: 'SHA256_' + Math.random().toString(36).substring(2, 12),
      storage_path: `vault/${user?.id || 'usr_cust_01'}/${docId}`,
      preview_url: filePreview || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
      page_count: 2,
      document_type: scanResult?.documentType || 'general',
      privacy_risk_score: scanResult?.riskScore || 50,
      privacy_risk_level: scanResult?.riskLevel || 'MEDIUM',
      detected_sensitive_fields: fields,
      is_redacted: fields.some(f => f.redacted),
      deletion_status: 'ACTIVE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.saveDocument(docRecord);

    // 2. Save Print Settings & Request
    const cost = copies * (colorMode === 'COLOR' ? 10 : 3);
    const printReq: PrintRequest = {
      id: reqId,
      customer_id: user?.id || 'usr_cust_01',
      shop_id: selectedShopId,
      document_id: docId,
      status: 'AWAITING_APPROVAL',
      settings: {
        paper_size: paperSize,
        color_mode: colorMode,
        sides: sides,
        copies: copies,
        page_range: 'All',
        watermark_enabled: watermarkEnabled,
        watermark_text: watermarkText,
        estimated_cost: cost
      },
      access_token_id: tokId,
      release_pin: releasePin,
      pin_attempts_left: 3,
      auto_delete_on_completion: true,
      expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 mins expiry
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    db.savePrintRequest(printReq);

    // 3. Save One-time access token
    db.saveToken({
      id: tokId,
      request_id: reqId,
      document_id: docId,
      token_hash: 'HASH_' + displayCode,
      display_code: displayCode,
      token_string: 'pv_token_' + Math.random().toString(36).substring(2, 14),
      allowed_shop_id: selectedShopId,
      max_uses: 1,
      current_uses: 0,
      is_revoked: false,
      expires_at: printReq.expires_at,
      created_at: new Date().toISOString()
    });

    // 4. Record audit event
    db.recordEvent({
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      request_id: reqId,
      document_id: docId,
      actor_id: user?.id || 'usr_cust_01',
      actor_role: 'customer',
      event_type: 'TOKEN_GENERATED',
      details: `One-time QR access token issued for ${displayCode}. Bound to shop ${selectedShopId}.`,
      timestamp: new Date().toISOString()
    });

    // 5. Notify shopkeeper
    const shop = db.getShopById(selectedShopId);
    db.addNotification({
      id: 'notif_' + Math.random().toString(36).substring(2, 9),
      user_id: shop?.owner_id || 'usr_shop_01',
      role: 'shopkeeper',
      title: 'Incoming Print Request',
      message: `Customer ${user?.full_name || 'Priya'} generated a secure QR print token (${displayCode}) for your shop.`,
      type: 'info',
      is_read: false,
      related_request_id: reqId,
      created_at: new Date().toISOString()
    });

    setCreatedRequest(printReq);
    setCreatedTokenCode(displayCode);
    setCurrentStep(4);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Step Indicator Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
            Secure Document Upload & Print
          </h1>
          <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
            Zero-retention workflow with offline AI privacy inspection
          </p>
        </div>

        {/* Step Pills */}
        <div className="hidden sm:flex items-center gap-2">
          {[
            { s: 1, label: 'Upload' },
            { s: 2, label: 'AI Scanner' },
            { s: 3, label: 'Settings' },
            { s: 4, label: 'QR Ready' }
          ].map(item => (
            <div
              key={item.s}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 ${
                currentStep === item.s
                  ? 'bg-vault-blue text-white shadow-neu-flat-sm'
                  : currentStep > item.s
                  ? 'bg-emerald-500/15 text-vault-green'
                  : 'bg-vault-lightSurface dark:bg-vault-darkSurface text-vault-lightMuted'
              }`}
            >
              <span>{item.s}.</span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: FILE UPLOAD ZONE */}
      {currentStep === 1 && (
        <NeuCard variant="flat" className="p-8 sm:p-12 space-y-6 text-center">
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="border-2 border-dashed border-vault-blue/40 rounded-3xl p-8 sm:p-12 hover:border-vault-blue transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 bg-vault-blue/5"
            onClick={() => document.getElementById('file-upload-input')?.click()}
          >
            <input
              id="file-upload-input"
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  handleFileSelect(e.target.files[0]);
                }
              }}
            />

            <div className="w-16 h-16 rounded-2xl bg-vault-blue text-white flex items-center justify-center shadow-lg">
              <UploadCloud size={32} />
            </div>

            <div>
              <p className="text-base font-bold text-vault-lightText dark:text-vault-darkText">
                Drag and drop your sensitive document here
              </p>
              <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted mt-1">
                Supports PDF, PNG, JPG, JPEG (Max 25MB)
              </p>
            </div>

            <NeuButton variant="primary" size="md" type="button">
              Browse Files from Computer
            </NeuButton>
          </div>

        </NeuCard>
      )}

      {/* STEP 2: AI PRIVACY SCANNER & SMART REDACTION */}
      {currentStep === 2 && scanResult && (
        <div className="space-y-6">
          {/* Risk Level Overview Card */}
          <NeuCard variant="flat" className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-vault-blue/10 text-vault-blue">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
                    AI Privacy Analysis Results
                  </h3>
                  <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted font-mono">
                    File: {selectedFile?.name} • Type: {scanResult.documentType.toUpperCase()}
                  </p>
                </div>
              </div>

              {/* Risk Badge */}
              <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 border font-mono font-bold text-xs ${
                scanResult.riskLevel === 'CRITICAL' || scanResult.riskLevel === 'HIGH'
                  ? 'bg-red-500/10 text-vault-red border-red-500/30'
                  : 'bg-amber-500/10 text-vault-amber border-amber-500/30'
              }`}>
                <AlertTriangle size={16} />
                <span>Risk Score: {scanResult.riskScore}/100 ({scanResult.riskLevel})</span>
              </div>
            </div>

            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted leading-relaxed">
              {scanResult.summary} Review detected fields below and toggle redaction before sending to the shop.
            </p>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-mono font-bold text-vault-blue">
                {fields.filter(f => f.redacted).length} of {fields.length} fields masked
              </span>
              <NeuButton variant="secondary" size="sm" onClick={handleRedactAll}>
                Redact All Recommended Fields
              </NeuButton>
            </div>
          </NeuCard>

          {/* Interactive Sensitive Fields Redactor List */}
          <div className="space-y-3">
            <h4 className="text-sm font-heading font-bold text-vault-lightText dark:text-vault-darkText">
              Detected Personal Identifiers
            </h4>

            {fields.map(field => (
              <NeuCard
                key={field.id}
                variant="flat-sm"
                className={`p-4 flex items-center justify-between gap-4 transition-all ${
                  field.redacted ? 'border-vault-green/40 bg-emerald-500/5' : ''
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-vault-lightText dark:text-vault-darkText">
                      {field.label}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-vault-blue/10 text-vault-blue">
                      {Math.round(field.confidence * 100)}% match
                    </span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-vault-lightMuted">Preview:</span>
                    <span className={`font-bold ${field.redacted ? 'text-vault-green' : 'text-vault-red'}`}>
                      {field.redacted ? field.masked_value : field.value}
                    </span>
                  </div>
                </div>

                <NeuButton
                  variant={field.redacted ? 'success' : 'secondary'}
                  size="sm"
                  icon={field.redacted ? <Check size={14} /> : <EyeOff size={14} />}
                  onClick={() => toggleRedactField(field.id)}
                >
                  {field.redacted ? 'Masked' : 'Mask Field'}
                </NeuButton>
              </NeuCard>
            ))}
          </div>

          {/* Proceed to print settings */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <NeuButton variant="flat" size="md" onClick={() => setCurrentStep(1)}>
              Back
            </NeuButton>
            <NeuButton
              variant="primary"
              size="md"
              icon={<ArrowRight size={16} />}
              onClick={() => setCurrentStep(3)}
            >
              Continue to Print Settings
            </NeuButton>
          </div>
        </div>
      )}

      {/* STEP 3: PRINT SETTINGS & SHOP SELECTION */}
      {currentStep === 3 && (
        <NeuCard variant="flat" className="p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
            Print Configuration & Shop Selection
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Paper Size */}
            <div>
              <label className="text-xs font-semibold text-vault-lightMuted dark:text-vault-darkMuted uppercase">
                Paper Size
              </label>
              <div className="grid grid-cols-3 gap-2 mt-1.5">
                {(['A4', 'A3', 'Letter'] as const).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setPaperSize(s)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      paperSize === s
                        ? 'bg-vault-blue text-white shadow-sm'
                        : 'bg-vault-lightSurface dark:bg-[#1a2230] text-vault-lightMuted shadow-neu-pressed-sm'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Color Mode */}
            <div>
              <label className="text-xs font-semibold text-vault-lightMuted dark:text-vault-darkMuted uppercase">
                Color Mode
              </label>
              <div className="grid grid-cols-2 gap-2 mt-1.5">
                <button
                  type="button"
                  onClick={() => setColorMode('BW')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    colorMode === 'BW'
                      ? 'bg-vault-blue text-white shadow-sm'
                      : 'bg-vault-lightSurface dark:bg-[#1a2230] text-vault-lightMuted shadow-neu-pressed-sm'
                  }`}
                >
                  Black & White (₹3/pg)
                </button>
                <button
                  type="button"
                  onClick={() => setColorMode('COLOR')}
                  className={`py-2 rounded-xl text-xs font-bold transition-all ${
                    colorMode === 'COLOR'
                      ? 'bg-vault-blue text-white shadow-sm'
                      : 'bg-vault-lightSurface dark:bg-[#1a2230] text-vault-lightMuted shadow-neu-pressed-sm'
                  }`}
                >
                  Full Color (₹10/pg)
                </button>
              </div>
            </div>

            {/* Number of Copies */}
            <div>
              <NeuInput
                label="Number of Copies"
                type="number"
                min={1}
                max={20}
                value={copies}
                onChange={e => setCopies(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>

            {/* Select Target Print Shop */}
            <div>
              <label className="text-xs font-semibold text-vault-lightMuted dark:text-vault-darkMuted uppercase">
                Choose Print Shop
              </label>
              <select
                value={selectedShopId}
                onChange={e => setSelectedShopId(e.target.value)}
                className="mt-1.5 w-full rounded-xl px-4 py-3 text-xs bg-vault-lightSurface dark:bg-[#1a2230] text-vault-lightText dark:text-vault-darkText shadow-neu-pressed border border-slate-200 dark:border-slate-800 outline-none font-semibold"
              >
                {shops.map(shop => (
                  <option key={shop.id} value={shop.id}>
                    {shop.name} {shop.verification_status === 'verified' ? '★ Verified' : '(Pending Reg)'}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Anti-Retention Watermark */}
          <div className="p-4 rounded-2xl bg-vault-lightSurface dark:bg-[#1a2230] shadow-neu-pressed-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-vault-blue" />
                <span className="text-xs font-bold text-vault-lightText dark:text-vault-darkText">
                  Anti-Retention Dynamic Watermark
                </span>
              </div>
              <button
                type="button"
                onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold transition-all ${
                  watermarkEnabled
                    ? 'bg-vault-green text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-500'
                }`}
              >
                {watermarkEnabled ? 'ENABLED' : 'DISABLED'}
              </button>
            </div>

            {watermarkEnabled && (
              <NeuInput
                placeholder="Watermark text..."
                value={watermarkText}
                onChange={e => setWatermarkText(e.target.value)}
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
            <NeuButton variant="flat" size="md" onClick={() => setCurrentStep(2)}>
              Back
            </NeuButton>
            <NeuButton
              variant="primary"
              size="lg"
              icon={<QrCode size={18} />}
              onClick={handleGenerateShareToken}
            >
              Generate Secure QR & Release PIN
            </NeuButton>
          </div>
        </NeuCard>
      )}

      {/* STEP 4: QR CODE READY */}
      {currentStep === 4 && createdRequest && (
        <div className="space-y-6 text-center">
          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-2xl font-heading font-extrabold text-vault-lightText dark:text-vault-darkText">
              Secure QR Code Generated!
            </h3>
            <p className="text-xs text-vault-lightMuted dark:text-vault-darkMuted">
              Show this QR code to the shopkeeper at the counter. When they scan it, you will receive a prompt to authorize access.
            </p>
          </div>

          <QRCodeDisplay
            tokenCode={createdTokenCode}
            tokenString={createdTokenCode}
            expiresAt={createdRequest.expires_at}
            shopName="Apex Cyber Print & Stationers"
            onRevoke={() => {
              db.revokeToken(createdRequest.access_token_id!, 'Customer revoked QR code');
              navigate('/customer');
            }}
          />

          {/* Release PIN box */}
          <NeuCard variant="flat" className="p-4 max-w-sm mx-auto space-y-1">
            <span className="text-[10px] font-mono uppercase text-vault-lightMuted font-bold">
              Customer Single-Use Release PIN:
            </span>
            <p className="font-mono text-2xl font-extrabold text-vault-blue tracking-widest">
              {createdRequest.release_pin}
            </p>
            <p className="text-[10px] text-vault-lightMuted">
              Provide this 6-digit PIN to the shopkeeper after approving their scan.
            </p>
          </NeuCard>

          <div className="flex justify-center gap-4 pt-2">
            <NeuButton
              variant="secondary"
              size="md"
              onClick={() => navigate('/customer/shares')}
            >
              View in Active Shares
            </NeuButton>
            <NeuButton
              variant="primary"
              size="md"
              onClick={() => navigate('/customer')}
            >
              Return to Dashboard
            </NeuButton>
          </div>
        </div>
      )}
    </div>
  );
};
