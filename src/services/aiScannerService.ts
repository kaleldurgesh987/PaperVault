import { DocumentType, SensitiveFieldMatch } from '../types';

export interface AnalysisResult {
  documentType: DocumentType;
  riskScore: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detectedFields: SensitiveFieldMatch[];
  summary: string;
  recommendations: string[];
}

export const aiScannerService = {
  scanTextAndMetadata: (filename: string, simulatedContent?: string): AnalysisResult => {
    const text = (simulatedContent || filename).toLowerCase();
    const detected: SensitiveFieldMatch[] = [];

    // 1. Document Type Heuristics
    let docType: DocumentType = 'general';
    if (text.includes('bank') || text.includes('statement') || text.includes('hdfc') || text.includes('sbi') || text.includes('icici')) {
      docType = 'bank_statement';
    } else if (text.includes('aadhaar') || text.includes('uidai') || text.includes('adhaar')) {
      docType = 'aadhaar';
    } else if (text.includes('pan') || text.includes('income tax') || text.includes('form 16') || text.includes('tax')) {
      docType = text.includes('pan') ? 'pan_card' : 'tax_filing';
    } else if (text.includes('marksheet') || text.includes('degree') || text.includes('certificate') || text.includes('transcript')) {
      docType = 'academic';
    } else if (text.includes('hospital') || text.includes('prescription') || text.includes('medical') || text.includes('lab')) {
      docType = 'medical';
    }

    // 2. Generate fields based on simulated content or realistic patterns
    if (docType === 'bank_statement') {
      detected.push({
        id: 'f_' + Math.random().toString(36).substring(2, 9),
        field_type: 'bank_account',
        label: 'Primary Bank Account Number',
        value: '50100438910245',
        masked_value: '5010 •••• •••• 0245',
        confidence: 0.98,
        page_number: 1,
        redacted: true
      });
      detected.push({
        id: 'f_' + Math.random().toString(36).substring(2, 9),
        field_type: 'ifsc',
        label: 'Bank Branch IFSC Code',
        value: 'HDFC0001245',
        masked_value: 'HDFC•••••••',
        confidence: 0.94,
        page_number: 1,
        redacted: false
      });
      detected.push({
        id: 'f_' + Math.random().toString(36).substring(2, 9),
        field_type: 'financial',
        label: 'Closing Balance & Transaction Totals',
        value: '₹ 1,48,920.50 Available Balance',
        masked_value: '₹ •••••••• Available Balance',
        confidence: 0.91,
        page_number: 1,
        redacted: true
      });
      detected.push({
        id: 'f_' + Math.random().toString(36).substring(2, 9),
        field_type: 'address',
        label: 'Account Holder Address',
        value: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103',
        masked_value: 'Flat •••, ••••••••• ••••••, Bengaluru ••••••',
        confidence: 0.89,
        page_number: 1,
        redacted: true
      });
      detected.push({
        id: 'f_' + Math.random().toString(36).substring(2, 9),
        field_type: 'phone',
        label: 'SMS Alert Mobile Number',
        value: '+91 98765 43210',
        masked_value: '+91 98••• ••210',
        confidence: 0.97,
        page_number: 1,
        redacted: true
      });
    } else if (docType === 'aadhaar') {
      detected.push({
        id: 'f_' + Math.random().toString(36).substring(2, 9),
        field_type: 'aadhaar',
        label: '12-Digit Aadhaar UID',
        value: '7842 9182 3019',
        masked_value: '•••• •••• 3019',
        confidence: 0.99,
        page_number: 1,
        redacted: true
      });
      detected.push({
        id: 'f_' + Math.random().toString(36).substring(2, 9),
        field_type: 'address',
        label: 'Permanent Address with PIN',
        value: 'House 14B, Shanti Vihar, Sector 21, Gurugram 122016',
        masked_value: '•••••• •••, •••••• •••••, Gurugram ••••••',
        confidence: 0.93,
        page_number: 1,
        redacted: false
      });
    } else if (docType === 'pan_card') {
      detected.push({
        id: 'f_' + Math.random().toString(36).substring(2, 9),
        field_type: 'pan',
        label: 'Permanent Account Number (PAN)',
        value: 'ABCDE1234F',
        masked_value: '•••••1234•',
        confidence: 0.99,
        page_number: 1,
        redacted: true
      });
      detected.push({
        id: 'f_' + Math.random().toString(36).substring(2, 9),
        field_type: 'email',
        label: 'Registered Taxpayer Email',
        value: 'priya.tax@example.com',
        masked_value: 'pr•••••@example.com',
        confidence: 0.96,
        page_number: 1,
        redacted: true
      });
    } else {
      // General file scan
      detected.push({
        id: 'f_' + Math.random().toString(36).substring(2, 9),
        field_type: 'phone',
        label: 'Identified Phone Contact',
        value: '+91 98765 43210',
        masked_value: '+91 98••• ••210',
        confidence: 0.92,
        page_number: 1,
        redacted: false
      });
      detected.push({
        id: 'f_' + Math.random().toString(36).substring(2, 9),
        field_type: 'email',
        label: 'Contact Email Address',
        value: 'user.document@gmail.com',
        masked_value: 'us•••••••••@gmail.com',
        confidence: 0.94,
        page_number: 1,
        redacted: true
      });
    }

    // 3. Compute Risk Score
    let score = 20;
    detected.forEach(f => {
      if (f.field_type === 'aadhaar') score += 35;
      else if (f.field_type === 'pan') score += 30;
      else if (f.field_type === 'bank_account') score += 25;
      else if (f.field_type === 'financial') score += 20;
      else if (f.field_type === 'address') score += 15;
      else if (f.field_type === 'phone') score += 10;
      else score += 5;
    });
    score = Math.min(score, 98);

    let riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
    if (score >= 80) riskLevel = 'CRITICAL';
    else if (score >= 60) riskLevel = 'HIGH';
    else if (score >= 35) riskLevel = 'MEDIUM';

    // 4. Actionable recommendations
    const recommendations: string[] = [];
    if (detected.some(f => f.field_type === 'aadhaar')) {
      recommendations.push('Mask first 8 digits of Aadhaar (Mandatory UIDAI Masked Aadhaar Guideline).');
    }
    if (detected.some(f => f.field_type === 'bank_account')) {
      recommendations.push('Redact full account number to prevent unauthorized banking lookups.');
    }
    if (detected.some(f => f.field_type === 'financial')) {
      recommendations.push('Mask closing balance or personal ledger rows if print is only for address proof.');
    }
    recommendations.push('Apply dynamic Shopkeeper Watermark before dispatching to print queue.');
    recommendations.push('Enable single-use auto-purge token (15–30 min expiry recommended).');

    const summary = `Detected ${detected.length} sensitive personal identity indicators in this ${docType.replace('_', ' ').toUpperCase()}. Risk level evaluated as ${riskLevel} (${score}/100).`;

    return {
      documentType: docType,
      riskScore: score,
      riskLevel,
      detectedFields: detected,
      summary,
      recommendations
    };
  }
};
