# tenant-lease-and-docs-plan.md

## Tenant View → Lease & Documents

### Purpose

Provide tenants with a single, authoritative place to view, sign, download, and reference their lease and all related documents. The page should remove ambiguity around lease status, signatures, and document validity while making retrieval effortless.

---

## Primary UX Goals

- Make the **current lease impossible to miss**
- Instantly communicate **lease status**
- Provide **one-click access** to official documents
- Eliminate confusion around **signatures, dates, and versions**
- Work equally well on desktop and mobile

---

## Page Structure Overview

1. Current Lease (Featured)
2. Lease History (Archived)
3. Documents Library (All other documents)
4. Inline Document Viewer
5. Filters & Search
6. Edge States & Alerts

---

## 1. Current Lease (Featured Section)

### Layout

- Full-width featured card at top of page
- Always visible on initial load
- Elevated visual priority over all other content

### Data Displayed

- Lease name: `Lease Agreement`
- Status badge:
  - Active
  - Pending Signature
  - Expired
  - Upcoming
- Lease term start date
- Lease term end date
- Monthly rent
- Rent due date
- Security deposit amount
- Property name
- Unit identifier

### Actions

- View Lease (opens inline PDF viewer)
- Download PDF
- Print
- Share (email link)

### Signature State Handling

- If unsigned:
  - Prominent primary CTA: `Sign Lease`
  - Signature checklist:
    - Tenant signed
    - Co-signer signed (if applicable)
    - Management signed
- Auto-scroll to first unsigned signature field when opened

---

## 2. Lease History (Archived Leases)

### Behavior

- Collapsed by default
- Expandable accordion labeled `Previous Leases`

### Each Lease Entry

- Lease term range
- Status: Expired
- Actions:
  - View
  - Download

---

## 3. Documents Library

### Purpose

Centralized repository for all non-primary-lease documents.

### Categorization

#### Legal & Lease Documents

- Lease agreements (non-current)
- Addendums
- Renewals
- Amendments

#### Financial Documents

- Move-in cost summary
- Rent receipts
- Deposit receipt
- Year-end rent summary

#### Property / Unit Documents

- Move-in checklist
- House rules
- Pet agreements
- Parking agreements
- HOA documents

#### Maintenance & Notices

- Entry notices
- Inspection reports
- Maintenance summaries
- Violation notices

---

## 4. Document Row Pattern

### Data Shown Per Row

- Document icon
- Document title
- Document category
- Uploaded by (Management / System)
- Date uploaded
- Status:
  - Signed
  - Pending signature
  - Informational

### Actions

- View
- Download
- Print
- Optional: Request clarification (opens message thread)

---

## 5. Inline Document Viewer

### Behavior

- Opens documents inline (no forced new tabs)
- Full-width viewer overlay or panel

### Features

- Page navigation
- Zoom controls
- Download
- Print
- Highlighted signature fields
- Scroll-to-signature for unsigned documents

---

## 6. Filters & Search

### Search

- Keyword search across document titles and metadata

### Filters

- Document category
- Signed vs unsigned
- Date range

### Defaults

- Current lease always surfaced first
- Most recent documents sorted descending by date

---

## 7. Alerts & Edge States

### Lease Expiration

- Inline warning banner when lease is nearing expiration
- Displays days remaining

### Unsigned Lease

- Page-level alert
- Optional restriction logic (e.g. rent autopay disabled until signed)

### No Documents

- Friendly empty state message
- Explanation of when documents will appear

---

## 8. Mobile Considerations

- Current lease card pinned at top
- Large tap targets for all actions
- Bottom sticky CTA:
  - `View Lease` or `Sign Lease`
- PDF viewer optimized for pinch-zoom
- Minimal horizontal scrolling

---

## UX Principles

- Current lease is always the visual anchor
- Document status is explicit and unambiguous
- All actions are one click or less
- Documents feel official, permanent, and trustworthy
- No hidden states or buried information

---

## Future Enhancements (Optional)

- Version history per document
- Expiration reminders
- Tenant-uploaded documents (proof of insurance, etc.)
- Read receipts for notices
- Multi-tenant / roommate signature tracking
