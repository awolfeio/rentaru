# Tenants Page Plan

> **Purpose:** Define a scalable, people-first Tenants page that gives landlords and property managers clear visibility into who is renting, who is at risk, and who needs attention—without turning the page into an accounting or CRM monster.

---

## Core Principles

- Tenants are **people with risk**, not rows in a ledger
- Optimized for **scanning and prioritization**
- Progressive density supports 1 tenant → 10,000+ tenants
- Focus on **status, behavior, and lifecycle**
- Inline context over page switching

---

## Mental Model

> _“Show me who my tenants are, who’s late or at risk, and let me act quickly.”_

---

## Page Layout Overview

```
┌───────────────────────────────────────────────┐
│ Tenants Header + Controls                     │
├───────────────────────────────────────────────┤
│ Tenant List (Primary Surface)                 │
│  ├─ Tenant Row                                │
│  │   ├─ Status + Risk Indicators              │
│  │   ├─ Property / Unit Context               │
│  │   ├─ Financial Snapshot                    │
│  │   └─ Expand → Tenant Details               │
│  └─ …                                         │
└───────────────────────────────────────────────┘
```

---

## 1. Tenants Header

### Left: Page Identity

- **Title:** `Tenants`
- **Subtitle:** `All active and historical renters`

---

### Right: Primary Controls

- `+ Add Tenant`
- Search (name, email, unit)
- Filters:

  - Payment status (on-time / late)
  - Lease status (active / ending soon / expired)
  - Property
  - Risk flag

**Rules**

- Filters persist per user
- Defaults optimized for “active tenants”

---

## 2. Tenant List (Primary Surface)

### Default View: Tenant Rows

Each tenant is shown as a **single dense row**, optimized for scanning.

---

### Tenant Row Columns

| Column          | Purpose                     |
| --------------- | --------------------------- |
| Tenant          | Name + contact indicator    |
| Property / Unit | Spatial context             |
| Lease Status    | Active / ending / expired   |
| Rent Status     | Paid / late / partial       |
| Balance         | Outstanding amount          |
| Flags           | Risk & attention indicators |
| Expand          | Inline drilldown            |

---

### Example Tenant Row

```
Jane Smith
jane@email.com

Oak Street Apts · Unit 3B | Lease ends in 42 days | Late | $450 | ⚠️ 💸
```

---

### Visual Rules

- Neutral rows by default
- Color appears only for risk states
- Icons over labels for flags
- Consistent row height

---

## 3. Tenant Status & Risk Indicators

### Common Flags

- 💸 Rent overdue
- ⚠️ Lease ending soon
- 🛠 High maintenance frequency
- 🚩 Chronic late payer

Flags are:

- Visible at a glance
- Hoverable for explanation
- Clickable for inline context

---

## 4. Expand → Tenant Inline Detail

### Interaction

- Click caret or row
- Expands inline beneath tenant row
- No navigation context loss

---

### Inline Detail Sections

#### A. Lease Snapshot

- Lease start / end
- Rent amount
- Renewal status

---

#### B. Payment Snapshot

- Last payment date
- Current balance
- Payment method on file

---

#### C. Maintenance Snapshot

- Open requests
- Recent requests count

---

#### D. Quick Actions

- Send message
- Record payment
- Add maintenance
- View full tenant profile

---

## 5. Tenant Row Actions

### Primary Actions (Inline)

- Message tenant
- Record payment

---

### Secondary Actions (Overflow Menu)

- Edit tenant
- Move out tenant
- View documents
- Archive tenant

---

## 6. Scaling Behavior

### Small Landlords (1–10 Tenants)

- More text labels
- Auto-expanded details optional
- Less reliance on filters

---

### Mid-Size Portfolios (25–250 Tenants)

- Compact rows
- Icon-driven flags
- Filters and search essential

---

### Enterprise (1,000+ Tenants)

- Virtualized list
- Bulk actions enabled
- Property-scoped filtering default

---

## 7. Empty States

### No Tenants Yet

- Clear CTA to add tenant
- No charts or metrics

---

### No Issues Detected

- Muted confirmation state
- No celebratory visuals

---

## 8. Accessibility & Performance

- Full keyboard navigation
- Screen-reader friendly status labels
- Virtualized rows for large datasets
- Zero blocking animations

---

## 9. Data Model (Simplified)

```ts
Tenant {
  id
  name
  email
  phone?
  propertyName
  unitNumber
  leaseStartDate
  leaseEndDate
  rentAmount
  rentStatus
  balance
  flags[]
}
```

---

## What Is Explicitly Excluded

- ❌ Accounting reports
- ❌ Full message inbox
- ❌ Vendor management
- ❌ CRM-style notes sprawl
- ❌ Marketing or engagement metrics

---

## One-Line Definition

> **The Tenants page is a people-risk scanner, not a payment ledger.**

---

_End of tenants-page-plan.md_
