# tenant-sidebar-nav.md

## Purpose

Define a comprehensive, scalable sidebar navigation for **Tenant users** that supports all realistic tenant needs across the full tenant lifecycle (pre-move-in → active lease → renewal → move-out), while allowing feature gating, permissions, and state-aware visibility.

---

## Core UX Principles

- **State-aware navigation**
  - Items appear/disappear based on lease state, balance state, and permissions
- **Progressive disclosure**
  - Advanced or edge-case items hidden by default
- **Mobile parity**
  - Sidebar collapses into bottom navigation or “More” menu on mobile
- **Badge-driven urgency**
  - Overdue rent, unread messages, open tickets surface visually
- **Single source of truth**
  - All tenant actions route through this nav (no hidden flows)

---

## Navigation Structure (Master List)

### 1. Home

**Dashboard**

- Rent status (Paid / Due / Overdue)
- Next payment date
- Open maintenance tickets
- Announcements
- Lease countdown
- Quick actions

---

### 2. Payments

- Pay Rent
- Payment History
- Upcoming Charges
  - Rent
  - Utilities
  - Parking
  - Storage
  - Pet fees
- AutoPay Settings
- Payment Methods
- Receipts & Invoices
- Late Fees & Penalties
- Credits & Adjustments
- Security Deposit
  - Amount held
  - Refund status (post move-out)

---

### 3. Maintenance

- Submit Maintenance Request
- My Requests
  - Status tracking
- Emergency Maintenance
- Vendor Messages
- Maintenance History
- Photos & Attachments
- Appointment Scheduling
- Satisfaction / Feedback

---

### 4. Lease & Documents

- My Lease
  - Current lease
  - Amendments
  - Addendums
- E-Sign Documents
- Renewal Offers
- Lease History
- House Rules / Policies
- Move-In Documents
- Move-Out Documents
- Notices
  - Rent increases
  - Entry notices
  - Legal notices

---

### 5. Property & Unit

- My Unit
  - Unit details
  - Floor plan
  - Square footage
- Property Information
  - Address
  - Office hours
  - Emergency contacts
- Amenities
- Parking
- Storage
- Mail / Package Info
- Access Codes / Smart Locks (optional)

---

### 6. Communication

- Messages
  - Management
  - Maintenance
- Announcements
- Community Notices
- Contact Management
- Message History

---

### 7. Utilities & Services

- Utility Charges
- Meter Readings
- Internet / Cable Info
- Trash & Recycling Schedule
- Renter’s Insurance
  - Upload proof
  - Status
- Third-Party Services
  - Cleaning
  - Pest control

---

### 8. Roommates & Household

- Household Members
- Invite Roommate
- Split Payments
- Pet Information
- Vehicle Information
- Authorized Occupants

---

### 9. Requests & Forms

- General Requests
- Lease Modification Requests
- Transfer Requests
- Early Termination Request
- Sublease Request
- Reasonable Accommodation Requests
- Complaint / Dispute Submission

---

### 10. Move-Out

_(Conditionally shown)_

- Intent to Vacate
- Move-Out Checklist
- Inspection Scheduling
- Final Balance
- Deposit Return Tracking
- Forwarding Address

---

### 11. Account

- Profile
- Contact Information
- Notification Preferences
- Security Settings
  - Password
  - Passkeys
- Language / Locale
- Accessibility Settings
- Linked Accounts

---

### 12. Help & Support

- Help Center / FAQ
- How-To Guides
- Emergency Instructions
- Support Tickets
- Chat / Contact Support
- Legal Resources (region-dependent)

---

### 13. Legal & Compliance

_(Conditionally shown / Region-dependent)_

- Disclosures
- Tenant Rights
- Local Regulations
- Privacy & Data Requests
- Consent & Agreements

---

## Feature Gating & Visibility Rules

### Lease State

| Lease State        | Visible Sections                               |
| ------------------ | ---------------------------------------------- |
| Pre-Move-In        | Lease, Documents, Payments (deposit), Messages |
| Active Lease       | All core sections                              |
| Renewal Offered    | Renewal surfaced in Lease                      |
| Move-Out Initiated | Move-Out section enabled                       |
| Post Move-Out      | Payments, Documents, Deposit only              |

---

### Account State

- **No balance due** → Hide urgency badges
- **Overdue rent** → Highlight Payments
- **Open emergency ticket** → Pin Maintenance
- **Unread messages** → Badge Communication

---

## MVP Sidebar (Launch Scope)

Minimal default for initial release:

- Dashboard
- Payments
- Maintenance
- Lease & Documents
- Messages
- Account
- Help

All other sections are progressively enabled.

---

## Mobile Navigation Mapping

Primary bottom nav:

- Home
- Pay
- Maintenance
- Messages
- More

“More” opens condensed sidebar list.

---

## Notes for Implementation

- Sidebar supports collapsible groups
- Icons must reflect urgency and state
- URLs scoped under `/tenant/*`
- Navigation config driven by permissions + lease state
- Same structure reused across web + mobile

---

## Future Enhancements

- Smart pinning of most-used sections
- Contextual sidebar reordering
- AI help surfacing relevant actions
- Tenant personalization preferences
