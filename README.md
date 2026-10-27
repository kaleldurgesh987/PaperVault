# PrintVault — Secure Document-Sharing & Printing Platform
> **"Your Documents. Your Control."**  
> *Hackathon Problem Statement ID: M-04 — The 'Print Shop' Data Leak*

[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.1-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Neumorphism-38bdf8.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/Security-Zero--Retention-green.svg)]()

---

## 1. Hackathon Problem Overview (M-04)

### The Problem
People regularly send high-risk personal documents (Aadhaar cards, PAN cards, income tax filings, bank statements, academic mark sheets) to local print shops over **WhatsApp** or **unencrypted email**. Once printing is done:
- Customers lose all control over these files.
- Files remain stored indefinitely in the shopkeeper's phone gallery, browser cache, email attachments, and desktop Downloads/Recycle Bin.
- Orphaned documents are prime targets for identity theft, fraud, and secondary resale.
- Shopkeepers face unwanted liability holding customer PII without systematic deletion policies.

### Our Solution
**PrintVault** establishes a controlled, temporary bridge between customers and print shops:
1. **Single-Use Encrypted QR Tokens**: Replace permanent WhatsApp/email attachments with temporary, revocable access links bound specifically to a registered shop.
2. **AI Privacy Scanner & Smart Redaction**: Identifies 12-digit Aadhaar UID, PAN, Bank account numbers, IFSC codes, and contact data, offering one-click visual masking prior to sharing.
3. **Customer Consent Gate**: The shopkeeper's QR scan triggers a live push prompt on the customer's phone. Documents cannot be opened without explicit customer approval.
4. **Secure Print Release PIN**: Customer releases a 6-digit decryption PIN only when at the counter and ready to print.
5. **Anti-Retention Watermark**: Dynamic watermark with Shop ID, Request ID, and Timestamp burns into rendered pages to discourage unauthorized reproduction.
6. **Automatic Platform Storage Purge**: When printing finishes, the platform server automatically wipes the raw file payload, nullifies tokens, and generates a verifiable cryptographic deletion checksum.
7. **Emergency Kill Switch**: Immediate panic button invalidating all active sessions and shredding platform files.
8. **Digital Receipts & Audit Trails**: Tamper-evident receipts with platform deletion audit hashes.

---

## 2. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS with custom Neumorphic/Claymorphic design tokens, Framer Motion, Lucide React Icons.
- **Client Reactive Database**: In-memory & reactive `localStorage` repository (`dbService.ts`) providing full live synchronization between Customer and Shopkeeper views.
- **Privacy Intelligence**: Rule-based & regex heuristic scanner (`aiScannerService.ts`) + standalone Python FastAPI service (`python_backend/main.py`).
- **Security Protocols**: One-time QR tokenization, 6-digit expiring PIN verification, Anti-retention SVG watermarking, Cryptographic deletion verification hashes.

---

## 3. Quick Start & Setup Instructions

### Prerequisites
- Node.js v18+ (tested on v24.22.0)
- npm or pnpm
- Python 3.10+ (optional for FastAPI microservice)

### Run the Frontend
```bash
# Navigate to the project directory
cd C:\Users\saiga\.gemini\antigravity\scratch\printvault

# Install dependencies (if needed)
npm install

# Start the local development server
npm run dev
```
Open your browser at `http://localhost:5173/`.

### Run the Optional Python AI Scanner Backend
```bash
cd python_backend
pip install -r requirements.txt
python main.py
```
Backend runs at `http://localhost:8000/api/health`.

---

## 4. Using the Application

Sign in or create an account, then use the customer and shopkeeper portals to manage document requests and approvals. The local browser repository includes sample records for development; uploaded documents can be selected from the customer portal. Printing is simulated in the interface and does not send jobs to a physical printer.

---

## 5. Security & Transparency Principles

> **Important Real-World Cybersecurity Note:**  
> No ordinary web software can guarantee that a rogue individual cannot point an external smartphone camera at their computer monitor or retain printed sheets of paper. PrintVault addresses this through:
> - Visible identifying watermarks (`Shop ID + Timestamp`) burned into rendered frames.
> - Verified shop profiles and legally binding Shopkeeper Privacy Pledges (`Policy v2.4-2026`).
> - Customer incident reporting channels.
> - Transparent guarantees: zero platform storage retention, customer-controlled consent, and strict token expiration.

---

## 6. Project Architecture
```
printvault/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.ts
├── python_backend/
│   ├── main.py                  # FastAPI PII Extraction Service
│   └── requirements.txt
└── src/
    ├── main.tsx
    ├── App.tsx                  # Master Router & Context Providers
    ├── index.css                # Neumorphic / Claymorphic design system
    ├── types/index.ts           # 16 domain entities
    ├── context/
    │   ├── AuthContext.tsx      # Local user authentication state
    │   └── ThemeContext.tsx     # Dark / Light soft Neumorphic theme engine
    ├── services/
    │   ├── dbService.ts         # Reactive storage, event audit logging & purge
    │   └── aiScannerService.ts  # Heuristic sensitive data scanner
    ├── components/
    │   ├── brand/AnimatedLogo.tsx
    │   ├── common/              # NeuCard, NeuButton, NeuInput, NeuModal, QRCodeDisplay, StatusBadge
    │   ├── layout/              # Navbar, Sidebar, DashboardLayout
    │   ├── customer/            # CustomerConsentModal
    │   ├── shopkeeper/          # PinVerificationModal, SimulatedPrinterModal, PrivacyPledgeModal
    │   └── security/            # EmergencyKillSwitchModal, TrustTimeline, IncidentReportModal
    └── pages/
        ├── LandingPage.tsx
        ├── AuthPage.tsx
        ├── customer/            # Dashboard, Upload, Requests, Shares, Privacy, Receipts
        └── shopkeeper/          # Dashboard, Scan, Queue, Profile
```
