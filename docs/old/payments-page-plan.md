# Payments Page Plan

> **Purpose:** Define a scalable, transactional Payments page that clearly shows money coming in, what’s late, and what failed—without drifting into accounting, reporting, or reconciliation bloat.

---

## Core Principles

- Payments are **transactions**, not financial analysis
- Optimized for **status, timeliness, and exception handling**
- Designed for fast scanning and rapid follow‑up
- Progressive density supports 1 unit → enterprise portfolios
- Clear separation from Accounting / Financials

---

## Mental Model

> _“What rent has come in, what’s late or failed, and what needs action right now?”_

---

## Page Layout Overview

```
┌───────────────────────────────────────────────┐
│ Payments Header + Controls                    │
├───────────────────────────────────────────────┤
│ Payments Table (Primary Surface)              │
│  ├─ Payment Row                               │
│  │   ├─ Status & Timing                       │
│  │   ├─ Tenant / Unit Context                 │
│  │   ├─ Amount & Method                       │
│  │   └─ Expand → Payment Details              │
│  └─ …                                         │
└───────────────────────────────────────────────┘
```

---

## 1. Payments Header

### Left: Page Identity

- **Title:** `Payments`
- **Subtitle:** `Rent and fee transactions`

---

### Right: Primary Controls

- `Record Payment`
- Search (tenant, unit, reference ID)
- Filters:

  - Status (paid / pending / failed / late)
  - Payment type (rent / fee / adjustment)
  - Property
  - Date range

**Rules**

- Defaults to current month
- Filters persist per user

---

## 2. Payments Table (Primary Surface)

### Default View: Payment Rows

Each payment appears as a **single dense row**, optimized for transactional review.

---

### Payment Row Columns

| Column          | Purpose                 |
| --------------- | ----------------------- |
| Date            | Payment date            |
| Tenant          | Who paid                |
| Property / Unit | Context                 |
| Type            | Rent / fee              |
| Amount          | Transaction value       |
| Method          | ACH / card              |
| Status          | Paid / pending / failed |
| Flags           | Exception indicators    |
| Expand          | Inline drilldown        |

---

### Example Payment Row

```
Aug 1, 2026
Jane Smith · Unit 3B · Oak Street Apts

Rent | $1,250 | ACH | Paid | —
```

---

### Visual Rules

- Neutral rows by default
- Color only for failed or late payments
- Icons for payment method and status
- Consistent, compact row height

---

## 3. Payment Status Indicators

### Status States

- **Paid** – Successfully completed
- **Pending** – Processing
- **Failed** – Payment error
- **Late** – Past due date

Only **Failed** and **Late** trigger strong visual emphasis.

---

## 4. Expand → Payment Inline Detail

### Interaction

- Click caret / row
- Expands inline beneath payment row
- No route change

---

### Inline Detail Sections

#### A. Payment Metadata

- Transaction ID
- Created date
- Processed date
- Processor reference (Stripe)

---

#### B. Tenant & Lease Context

- Tenant name
- Lease period covered
- Property and unit

---

#### C. Method & Routing

- Payment method (ACH / card)
- Last 4 digits
- Payout destination (owner account)

---

#### D. Failure Details (Conditional)

- Failure reason
- Retry status
- Next retry date (if applicable)

---

#### E. Quick Actions

- Retry payment
- Send reminder
- Record manual payment
- View tenant profile

---

## 5. Payment Row Actions

### Primary Actions (Inline)

- Retry payment (if failed)
- Send reminder (if late)

---

### Secondary Actions (Overflow Menu)

- Edit memo / note
- Refund payment
- Void pending payment
- Export transaction

---

## 6. Scaling Behavior

### Small Landlords (1–10 Units)

- More descriptive text
- Auto-grouped by tenant
- Minimal filtering required

---

### Mid-Size Portfolios (25–250 Units)

- Compact rows
- Icon-driven status indicators
- Filters and date ranges essential

---

### Enterprise (1,000+ Units)

- Virtualized table
- Bulk actions (send reminders, export)
- Property-scoped filtering default

---

## 7. Empty States

### No Payments Yet

- Clear CTA to record first payment
- No charts or projections

---

### All Payments On Time

- Muted confirmation state
- No celebratory UI

---

## 8. Accessibility & Performance

- Keyboard-navigable rows
- Screen-reader friendly status labels
- Virtualized rows for scale
- No blocking animations

---

## 9. Data Model (Simplified)

```ts
Payment {
  id
  date
  tenantName
  propertyName
  unitNumber
  type
  amount
  method
  status
  processorRef
}
```

---

## What Is Explicitly Excluded

- ❌ Accounting categorization
- ❌ Financial forecasting
- ❌ Owner statements
- ❌ Tax calculations
- ❌ Full reconciliation tools

---

## One-Line Definition

> **The Payments page is a transactional ledger—not a financial analysis tool.**

---

_End of payments-page-plan.md_
