import { 
  UserProfile, 
  Shop, 
  DocumentRecord, 
  PrintRequest, 
  DocumentAccessToken, 
  AccessApproval, 
  PrintReleasePin, 
  DocumentAccessEvent, 
  VaultNotification, 
  SecurityEvent, 
  PrivacyIncident, 
  DigitalReceipt,
  ShopPrivacyAgreement
} from '../types';

const STORAGE_KEY_PREFIX = 'printvault_db_v1_';

function getStored<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('printvault:state_change', { detail: { key } }));
  } catch (e) {
    console.error('Storage write error', e);
  }
}

// Seed Data
const INITIAL_PROFILES: UserProfile[] = [
  {
    id: 'usr_cust_01',
    email: 'priya.sharma@example.com',
    role: 'customer',
    full_name: 'Priya Sharma',
    phone: '+91 98765 43210',
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'usr_shop_01',
    email: 'rahul@apexprint.in',
    role: 'shopkeeper',
    full_name: 'Rahul Verma (Apex Cyber Print)',
    phone: '+91 91234 56789',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 'usr_shop_02',
    email: 'contact@quickcopy.in',
    role: 'shopkeeper',
    full_name: 'Sunil Rao (QuickCopy Hub)',
    phone: '+91 98888 12345',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_SHOPS: Shop[] = [
  {
    id: 'shop_apex_01',
    owner_id: 'usr_shop_01',
    name: 'Apex Cyber Print & Stationers',
    address: 'Shop 14, Commercial Complex, Sector 18, Noida, UP',
    phone: '+91 91234 56789',
    email: 'rahul@apexprint.in',
    registration_number: 'GSTIN07AAAAA0000A1Z5',
    verification_status: 'verified',
    verified_at: new Date(Date.now() - 86400000 * 15).toISOString(),
    rating: 4.9,
    completed_orders: 142,
    privacy_pledge_signed: true,
    privacy_pledge_date: new Date(Date.now() - 86400000 * 18).toISOString(),
    privacy_policy_version: 'v2.4-2026',
    created_at: new Date(Date.now() - 86400000 * 20).toISOString()
  },
  {
    id: 'shop_quick_02',
    owner_id: 'usr_shop_02',
    name: 'QuickCopy Station (Unverified)',
    address: 'Near Metro Gate 2, Connaught Place, New Delhi',
    phone: '+91 98888 12345',
    email: 'contact@quickcopy.in',
    registration_number: 'PENDING_REG_7812',
    verification_status: 'pending',
    rating: 4.2,
    completed_orders: 12,
    privacy_pledge_signed: true,
    privacy_pledge_date: new Date(Date.now() - 86400000 * 2).toISOString(),
    privacy_policy_version: 'v2.4-2026',
    created_at: new Date(Date.now() - 86400000 * 2).toISOString()
  }
];

const SAMPLE_DOCS: DocumentRecord[] = [
  {
    id: 'doc_bank_stmt_01',
    user_id: 'usr_cust_01',
    original_filename: 'HDFC_Bank_Statement_Q3_2026.pdf',
    file_type: 'pdf',
    file_size_bytes: 342190,
    file_hash_sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    storage_path: 'vault/usr_cust_01/doc_bank_stmt_01.pdf',
    preview_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    page_count: 3,
    document_type: 'bank_statement',
    privacy_risk_score: 85,
    privacy_risk_level: 'HIGH',
    detected_sensitive_fields: [
      {
        id: 'f_01',
        field_type: 'bank_account',
        label: 'Savings Account Number',
        value: '50100438910245',
        masked_value: '5010 •••• •••• 0245',
        confidence: 0.98,
        page_number: 1,
        redacted: true
      },
      {
        id: 'f_02',
        field_type: 'ifsc',
        label: 'Branch IFSC Code',
        value: 'HDFC0001245',
        masked_value: 'HDFC•••••••',
        confidence: 0.95,
        page_number: 1,
        redacted: false
      },
      {
        id: 'f_03',
        field_type: 'phone',
        label: 'Registered Mobile',
        value: '+91 98765 43210',
        masked_value: '+91 98••• ••210',
        confidence: 0.99,
        page_number: 1,
        redacted: true
      },
      {
        id: 'f_04',
        field_type: 'address',
        label: 'Residential Address',
        value: 'Flat 402, Green Glen Layout, Bellandur, Bengaluru 560103',
        masked_value: 'Flat •••, ••••••••• ••••••, Bengaluru ••••••',
        confidence: 0.92,
        page_number: 1,
        redacted: true
      }
    ],
    is_redacted: true,
    deletion_status: 'ACTIVE',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    updated_at: new Date(Date.now() - 3600000 * 1.5).toISOString()
  }
];

const INITIAL_REQUESTS: PrintRequest[] = [
  {
    id: 'req_pv_8921',
    customer_id: 'usr_cust_01',
    shop_id: 'shop_apex_01',
    document_id: 'doc_bank_stmt_01',
    status: 'AWAITING_APPROVAL',
    settings: {
      paper_size: 'A4',
      color_mode: 'BW',
      sides: 'DOUBLE',
      copies: 1,
      page_range: '1-3',
      watermark_enabled: true,
      watermark_text: 'REQ-PV-8921 | APEX PRINT | AUTHORIZED COPY',
      special_instructions: 'Print with high contrast. Mask sensitive account numbers.',
      estimated_cost: 15
    },
    access_token_id: 'tok_sec_9912',
    release_pin: '849201',
    pin_attempts_left: 3,
    auto_delete_on_completion: true,
    expires_at: new Date(Date.now() + 3600000 * 1.5).toISOString(),
    created_at: new Date(Date.now() - 1800000).toISOString(),
    updated_at: new Date().toISOString()
  }
];

const INITIAL_TOKENS: DocumentAccessToken[] = [
  {
    id: 'tok_sec_9912',
    request_id: 'req_pv_8921',
    document_id: 'doc_bank_stmt_01',
    token_hash: 'd04b98f48e8f8bcc15c6ae5ac050801cd6dcfd428fb5f9e65c4e16e7807340fa',
    display_code: 'PV-8921-XQ',
    token_string: 'pv_live_token_7a9f82d019bc',
    allowed_shop_id: 'shop_apex_01',
    max_uses: 1,
    current_uses: 0,
    is_revoked: false,
    expires_at: new Date(Date.now() + 3600000 * 1.5).toISOString(),
    created_at: new Date(Date.now() - 1800000).toISOString()
  }
];

const INITIAL_EVENTS: DocumentAccessEvent[] = [
  {
    id: 'evt_01',
    request_id: 'req_pv_8921',
    document_id: 'doc_bank_stmt_01',
    actor_id: 'usr_cust_01',
    actor_role: 'customer',
    event_type: 'TOKEN_GENERATED',
    details: 'One-time secure QR access token issued for Apex Cyber Print (1.5 hr expiry)',
    timestamp: new Date(Date.now() - 1800000).toISOString()
  },
  {
    id: 'evt_02',
    request_id: 'req_pv_8921',
    document_id: 'doc_bank_stmt_01',
    actor_id: 'usr_shop_01',
    actor_role: 'shopkeeper',
    event_type: 'ACCESS_REQUESTED',
    details: 'Shopkeeper Rahul Verma initiated QR scan. Requesting customer consent to inspect document.',
    timestamp: new Date(Date.now() - 900000).toISOString()
  }
];

const INITIAL_NOTIFICATIONS: VaultNotification[] = [
  {
    id: 'notif_01',
    user_id: 'usr_cust_01',
    role: 'customer',
    title: 'Access Authorization Requested',
    message: 'Apex Cyber Print has scanned your QR code and is requesting view access for Bank Statement.',
    type: 'warning',
    is_read: false,
    related_request_id: 'req_pv_8921',
    created_at: new Date(Date.now() - 900000).toISOString()
  },
  {
    id: 'notif_02',
    user_id: 'usr_shop_01',
    role: 'shopkeeper',
    title: 'New Print Request Received',
    message: 'Customer Priya Sharma sent a print request for HDFC_Bank_Statement (3 pages, B&W).',
    type: 'info',
    is_read: false,
    related_request_id: 'req_pv_8921',
    created_at: new Date(Date.now() - 1800000).toISOString()
  }
];

// Database Repository Implementation
export const db = {
  // Profiles
  getProfiles: (): UserProfile[] => getStored('profiles', INITIAL_PROFILES),
  getProfileById: (id: string): UserProfile | undefined => db.getProfiles().find(p => p.id === id),
  saveProfile: (profile: UserProfile): void => {
    const list = db.getProfiles().filter(p => p.id !== profile.id);
    list.push(profile);
    setStored('profiles', list);
  },

  // Shops
  getShops: (): Shop[] => getStored('shops', INITIAL_SHOPS),
  getShopById: (id: string): Shop | undefined => db.getShops().find(s => s.id === id),
  getShopByOwnerId: (ownerId: string): Shop | undefined => db.getShops().find(s => s.owner_id === ownerId),
  updateShop: (shop: Shop): void => {
    const list = db.getShops().map(s => s.id === shop.id ? shop : s);
    setStored('shops', list);
  },
  // Documents
  getDocuments: (): DocumentRecord[] => getStored('documents', SAMPLE_DOCS),
  getDocumentById: (id: string): DocumentRecord | undefined => db.getDocuments().find(d => d.id === id),
  saveDocument: (doc: DocumentRecord): void => {
    const list = db.getDocuments().filter(d => d.id !== doc.id);
    list.unshift(doc);
    setStored('documents', list);
  },
  updateDocument: (doc: DocumentRecord): void => {
    const list = db.getDocuments().map(d => d.id === doc.id ? doc : d);
    setStored('documents', list);
  },
  purgeDocumentStorage: (docId: string, reason: string): boolean => {
    const doc = db.getDocumentById(docId);
    if (!doc) return false;
    
    // Purge the file content/preview from storage while preserving non-sensitive audit metadata
    const updated: DocumentRecord = {
      ...doc,
      preview_url: '', // Purged!
      storage_path: 'PURGED_FROM_PLATFORM_STORAGE',
      deletion_status: 'PURGED_VERIFIED',
      deleted_at: new Date().toISOString(),
      deletion_hash: `SHA256:PURGE_${Math.random().toString(36).substring(2, 12).toUpperCase()}_OK`,
      updated_at: new Date().toISOString()
    };
    db.updateDocument(updated);

    // Record audit event
    db.recordEvent({
      id: 'evt_' + Math.random().toString(36).substring(2, 9),
      request_id: 'sys_purge',
      document_id: docId,
      actor_id: 'system',
      actor_role: 'system',
      event_type: 'STORAGE_FILE_PURGED',
      details: `File payload permanently wiped from storage. Checksum: ${updated.deletion_hash}. Reason: ${reason}`,
      timestamp: new Date().toISOString()
    });

    return true;
  },

  // Print Requests
  getPrintRequests: (): PrintRequest[] => getStored('requests', INITIAL_REQUESTS),
  getPrintRequestById: (id: string): PrintRequest | undefined => db.getPrintRequests().find(r => r.id === id),
  savePrintRequest: (req: PrintRequest): void => {
    const list = db.getPrintRequests().filter(r => r.id !== req.id);
    list.unshift(req);
    setStored('requests', list);
  },
  updatePrintRequest: (req: PrintRequest): void => {
    const list = db.getPrintRequests().map(r => r.id === req.id ? req : r);
    setStored('requests', list);
  },

  // Document Access Tokens
  getTokens: (): DocumentAccessToken[] => getStored('tokens', INITIAL_TOKENS),
  getTokenById: (id: string): DocumentAccessToken | undefined => db.getTokens().find(t => t.id === id),
  getTokenByCode: (code: string): DocumentAccessToken | undefined => {
    const clean = code.trim().toUpperCase();
    return db.getTokens().find(t => t.display_code.toUpperCase() === clean || t.token_string === code.trim());
  },
  saveToken: (tok: DocumentAccessToken): void => {
    const list = db.getTokens().filter(t => t.id !== tok.id);
    list.unshift(tok);
    setStored('tokens', list);
  },
  revokeToken: (tokenId: string, reason: string): void => {
    const tokens = db.getTokens().map(t => {
      if (t.id === tokenId) {
        return {
          ...t,
          is_revoked: true,
          revoked_at: new Date().toISOString(),
          revocation_reason: reason
        };
      }
      return t;
    });
    setStored('tokens', tokens);
  },

  // Access Events & Security Events
  getEvents: (): DocumentAccessEvent[] => getStored('events', INITIAL_EVENTS),
  recordEvent: (event: DocumentAccessEvent): void => {
    const events = db.getEvents();
    events.unshift(event);
    setStored('events', events);
  },

  getSecurityEvents: (): SecurityEvent[] => getStored('sec_events', [
    {
      id: 'sec_01',
      level: 'LOW',
      type: 'RATE_LIMIT_TRIPPED',
      details: 'Strict rate limiter initialized for auth endpoints',
      timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
    }
  ]),
  recordSecurityEvent: (sec: SecurityEvent): void => {
    const list = db.getSecurityEvents();
    list.unshift(sec);
    setStored('sec_events', list);
  },

  // Notifications
  getNotifications: (userId?: string): VaultNotification[] => {
    const notifs = getStored('notifications', INITIAL_NOTIFICATIONS);
    if (!userId) return notifs;
    return notifs.filter(n => n.user_id === userId);
  },
  addNotification: (n: VaultNotification): void => {
    const notifs = db.getNotifications();
    notifs.unshift(n);
    setStored('notifications', notifs);
  },
  markNotificationRead: (id: string): void => {
    const notifs = db.getNotifications().map(n => n.id === id ? { ...n, is_read: true } : n);
    setStored('notifications', notifs);
  },

  // Receipts
  getReceipts: (): DigitalReceipt[] => getStored('receipts', [
    {
      id: 'rec_pv_001',
      receipt_number: 'REC-2026-PV-8812',
      request_id: 'req_prior_01',
      customer_id: 'usr_cust_01',
      shop_id: 'shop_apex_01',
      shop_name: 'Apex Cyber Print & Stationers',
      document_name: 'Tax_Computation_FY25.pdf',
      print_settings: {
        paper_size: 'A4',
        color_mode: 'BW',
        sides: 'SINGLE',
        copies: 2,
        page_range: '1-2',
        watermark_enabled: true,
        watermark_text: 'AUTHORIZED COPY',
        estimated_cost: 10
      },
      page_count: 2,
      total_copies: 2,
      amount_paid: 10,
      currency: 'INR',
      completed_at: new Date(Date.now() - 86400000).toISOString(),
      platform_deletion_verified: true,
      deletion_timestamp: new Date(Date.now() - 86400000 + 120000).toISOString(),
      deletion_audit_hash: 'SHA256:PURGE_7F90BC_VERIFIED',
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ]),
  saveReceipt: (receipt: DigitalReceipt): void => {
    const list = db.getReceipts().filter(r => r.id !== receipt.id);
    list.unshift(receipt);
    setStored('receipts', list);
  },

  // Privacy Incidents
  getIncidents: (): PrivacyIncident[] => getStored('incidents', []),
  saveIncident: (incident: PrivacyIncident): void => {
    const list = db.getIncidents();
    list.unshift(incident);
    setStored('incidents', list);
  },

  // Emergency Kill Switch
  emergencyKillSwitch: (customerId: string): { revokedCount: number } => {
    const requests = db.getPrintRequests().filter(r => r.customer_id === customerId);
    let revoked = 0;

    requests.forEach(req => {
      if (req.status !== 'COMPLETED' && req.status !== 'CANCELLED') {
        req.status = 'CANCELLED';
        req.shop_notes = 'Access revoked by Customer Emergency Kill Switch';
        revoked++;
        if (req.access_token_id) {
          db.revokeToken(req.access_token_id, 'EMERGENCY_KILL_SWITCH triggered by customer');
        }
        // Auto purge storage
        db.purgeDocumentStorage(req.document_id, 'EMERGENCY_KILL_SWITCH');
      }
    });
    setStored('requests', db.getPrintRequests());

    // Record high-severity security event
    db.recordSecurityEvent({
      id: 'sec_kill_' + Date.now(),
      level: 'CRITICAL',
      type: 'KILL_SWITCH_TRIGGERED',
      user_id: customerId,
      details: `Customer ${customerId} engaged the Emergency Kill Switch. ${revoked} active sessions & document tokens immediately revoked. Files shredded.`,
      timestamp: new Date().toISOString()
    });

    return { revokedCount: revoked };
  },

};
