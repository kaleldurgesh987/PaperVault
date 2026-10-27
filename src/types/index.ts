export type UserRole = 'customer' | 'shopkeeper' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Shop {
  id: string;
  owner_id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  registration_number: string;
  verification_status: 'unverified' | 'pending' | 'verified' | 'rejected';
  verified_at?: string;
  rating: number;
  completed_orders: number;
  privacy_pledge_signed: boolean;
  privacy_pledge_date?: string;
  privacy_policy_version?: string;
  latitude?: number;
  longitude?: number;
  created_at: string;
}

export interface ShopVerificationRequest {
  id: string;
  shop_id: string;
  submitted_by: string;
  business_proof_type: string;
  document_url: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewer_notes?: string;
  created_at: string;
  updated_at: string;
}

export type DocumentType = 'bank_statement' | 'aadhaar' | 'pan_card' | 'tax_filing' | 'academic' | 'medical' | 'general';
export type DeletionStatus = 'ACTIVE' | 'SCHEDULED_FOR_DELETION' | 'PURGED_VERIFIED' | 'PURGE_FAILED';

export interface SensitiveFieldMatch {
  id: string;
  field_type: 'aadhaar' | 'pan' | 'bank_account' | 'ifsc' | 'phone' | 'email' | 'address' | 'financial';
  label: string;
  value: string;
  masked_value: string;
  confidence: number;
  page_number: number;
  bounding_box?: { x: number; y: number; width: number; height: number };
  redacted: boolean;
}

export interface DocumentRecord {
  id: string;
  user_id: string;
  original_filename: string;
  file_type: 'pdf' | 'png' | 'jpg' | 'jpeg';
  file_size_bytes: number;
  file_hash_sha256: string;
  storage_path: string;
  preview_url: string;
  page_count: number;
  document_type: DocumentType;
  privacy_risk_score: number; // 0 - 100
  privacy_risk_level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  detected_sensitive_fields: SensitiveFieldMatch[];
  is_redacted: boolean;
  redacted_storage_path?: string;
  deletion_status: DeletionStatus;
  deleted_at?: string;
  deletion_hash?: string;
  created_at: string;
  updated_at: string;
}

export type PrintStatus = 
  | 'PENDING' 
  | 'ACCEPTED' 
  | 'AWAITING_APPROVAL' 
  | 'APPROVED' 
  | 'PRINTING' 
  | 'READY' 
  | 'COMPLETED' 
  | 'CANCELLED' 
  | 'EXPIRED';

export interface PrintSettings {
  paper_size: 'A4' | 'A3' | 'Letter';
  color_mode: 'BW' | 'COLOR';
  sides: 'SINGLE' | 'DOUBLE';
  copies: number;
  page_range: string;
  watermark_enabled: boolean;
  watermark_text?: string;
  special_instructions?: string;
  estimated_cost: number;
}

export interface PrintRequest {
  id: string;
  customer_id: string;
  shop_id: string;
  document_id: string;
  status: PrintStatus;
  settings: PrintSettings;
  access_token_id?: string;
  release_pin?: string;
  pin_attempts_left: number;
  shop_notes?: string;
  customer_feedback?: string;
  auto_delete_on_completion: boolean;
  expires_at: string;
  completed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface DocumentAccessToken {
  id: string;
  request_id: string;
  document_id: string;
  token_hash: string;
  display_code: string;
  token_string: string;
  allowed_shop_id: string;
  max_uses: number;
  current_uses: number;
  is_revoked: boolean;
  revoked_at?: string;
  revocation_reason?: string;
  expires_at: string;
  created_at: string;
}

export interface AccessApproval {
  id: string;
  request_id: string;
  customer_id: string;
  shop_id: string;
  purpose: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'REVOKED';
  approved_at?: string;
  expires_at: string;
  created_at: string;
}

export interface PrintReleasePin {
  id: string;
  request_id: string;
  pin_code: string;
  is_used: boolean;
  attempts_count: number;
  max_attempts: number;
  expires_at: string;
  used_at?: string;
  created_at: string;
}

export type AccessEventType = 
  | 'TOKEN_GENERATED'
  | 'ACCESS_REQUESTED'
  | 'CUSTOMER_CONSENT_GRANTED'
  | 'CUSTOMER_CONSENT_DENIED'
  | 'PIN_ENTERED_SUCCESS'
  | 'PIN_ENTERED_FAIL'
  | 'DOCUMENT_VIEWED'
  | 'PRINT_STARTED'
  | 'PRINT_COMPLETED'
  | 'ACCESS_REVOKED_MANUAL'
  | 'EMERGENCY_KILL_SWITCH'
  | 'ACCESS_EXPIRED'
  | 'STORAGE_FILE_PURGED';

export interface DocumentAccessEvent {
  id: string;
  request_id: string;
  document_id: string;
  actor_id: string;
  actor_role: 'customer' | 'shopkeeper' | 'system';
  event_type: AccessEventType;
  ip_address?: string;
  details: string;
  timestamp: string;
}

export interface VaultNotification {
  id: string;
  user_id: string;
  role: 'customer' | 'shopkeeper';
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'danger';
  is_read: boolean;
  related_request_id?: string;
  created_at: string;
}

export interface SecurityEvent {
  id: string;
  level: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  type: 'UNAUTHORIZED_ACCESS' | 'EXPIRED_TOKEN_ATTEMPT' | 'EXCESSIVE_PIN_FAILS' | 'RATE_LIMIT_TRIPPED' | 'KILL_SWITCH_TRIGGERED';
  user_id?: string;
  shop_id?: string;
  details: string;
  timestamp: string;
}

export interface PrivacyIncident {
  id: string;
  ticket_number: string;
  customer_id: string;
  shop_id: string;
  request_id?: string;
  incident_category: 'UNAUTHORIZED_RETENTION' | 'DEVICE_LEAK' | 'EXTRA_PRINTS_TAKEN' | 'SUSPICIOUS_BEHAVIOR' | 'OTHER';
  description: string;
  status: 'OPEN' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED';
  resolution_notes?: string;
  created_at: string;
}

export interface DeletionJob {
  id: string;
  document_id: string;
  request_id: string;
  trigger_reason: 'PRINT_COMPLETED' | 'MANUAL_REVOCATION' | 'EXPIRED' | 'CUSTOMER_REQUEST';
  status: 'PENDING' | 'SUCCESS' | 'FAILED';
  verification_checksum: string;
  deleted_at: string;
}

export interface DigitalReceipt {
  id: string;
  receipt_number: string;
  request_id: string;
  customer_id: string;
  shop_id: string;
  shop_name: string;
  document_name: string;
  print_settings: PrintSettings;
  page_count: number;
  total_copies: number;
  amount_paid: number;
  currency: string;
  completed_at: string;
  platform_deletion_verified: boolean;
  deletion_timestamp: string;
  deletion_audit_hash: string;
  created_at: string;
}

export interface ShopPrivacyAgreement {
  id: string;
  shop_id: string;
  policy_version: string;
  agreed_terms: string[];
  accepted_at: string;
  ip_address: string;
}
