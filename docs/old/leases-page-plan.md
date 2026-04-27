# Leases Page Plan

> **Purpose:** Define a scalable, legally grounded Leases page that clearly communicates lease status, lifecycle, and risk—without turning the experience into a document dump or legal management nightmare.

---

## Core Principles

- Leases are **lifecycle objects**, not PDFs
- Optimized for **expiration awareness and renewal action**
- Clear separation between **status**, **documents**, and **history**
- Progressive density from 1 lease → enterprise portfolios
- Inline context preferred over navigation jumps

---

## Mental Model

> _“Which leases are active, which are ending, and what needs to happen next?”_

---

## Page Layout Overview

```
┌───────────────────────────────────────────────┐
│ Leases Header + Controls                      │
├───────────────────────────────────────────────┤
│ Lease List (Primary Surface)                  │
│  ├─ Lease Row                                 │
│  │   ├─ Status & Timeline Indicators          │
│  │   ├─ Tenant / Property Context             │
│  │   ├─ Financial Terms Snapshot              │
│  │   └─ Expand → Lease Details                │
│  └─ …                                         │
└───────────────────────────────────────────────┘
```

---

## 1. Leases Header

### Left: Page Identity

- **Title:** `Leases`
- **Subtitle:** `Active, upcoming, and historical lease agreements`

---

### Right: Primary Controls

- `+ Create Lease`
- Search (tenant, unit, property)
- Filters:

  - Lease status (active / ending soon / expired)
  - Property
  - Renewal state (renewed / pending / not offered)

**Rules**

- Defaults to active leases
- Filters persist per user

---

## 2. Lease List (Primary Surface)

### Default View: Lease Rows

Each lease is represented by a **single dense row**, optimized for scanning time and legal awareness.

---

### Lease Row Columns

| Column          | Purpose                   |
| --------------- | ------------------------- |
| Tenant          | Who is bound by the lease |
| Property / Unit | Physical context          |
| Lease Term      | Start → End dates         |
| Status          | Active / Ending / Expired |
| Rent            | Monthly amount            |
| Renewal         | Renewal state             |
| Flags           | Legal or timing risk      |
| Expand          | Inline drilldown          |

---

### Example Lease Row

```
Jane Smith · Unit 3B
Oak Street Apts

Jan 1, 2024 → Dec 31, 2024 | Ending Soon | $1,250 | Pending | ⚠️
```

---

### Visual Rules

- Neutral rows by default
- Color only for time‑based urgency
- Timeline indicators over text where possible
- Consistent row height for scanning

---

## 3. Lease Status & Timeline Indicators

### Status States

- **Active** – In force
- **Ending Soon** – Configurable window (e.g., 30–60 days)
- **Expired** – Past end date
- **Draft** – Not yet signed

---

### Timeline Visualization

- Subtle progress bar showing % elapsed
- Emphasized end‑date proximity
- No full Gantt charts

---

## 4. Expand → Lease Inline Detail

### Interaction

- Click caret / row
- Expands inline beneath lease row
- No route change

---

### Inline Detail Sections

#### A. Lease Terms Snapshot

- Start date
- End date
- Rent amount
- Security deposit
- Payment schedule

---

#### B. Renewal Status

- Renewal offered? (yes/no)
- Tenant response state
- Proposed new rent (if applicable)

---

#### C. Document Status

- Original lease PDF
- Amendments / addenda
- Signature completion state

---

#### D. Quick Actions

- Send renewal offer
- Upload amendment
- View full lease details

---

## 5. Lease Row Actions

### Primary Actions (Inline)

- Send renewal
- View lease

---

### Secondary Actions (Overflow Menu)

- Edit lease terms
- Upload document
- Terminate lease
- Archive lease

---

## 6. Scaling Behavior

### Small Landlords (1–10 Leases)

- More text labels
- Optional auto‑expanded lease details
- Timeline indicators less condensed

---

### Mid‑Size Portfolios (25–250 Leases)

- Compact rows
- Icon‑driven urgency indicators
- Filters essential for lease management cycles

---

### Enterprise (1,000+ Leases)

- Virtualized list
- Bulk actions (send renewals, export)
- Expiration‑based sorting default

---

## 7. Empty States

### No Leases Yet

- Guided CTA to create first lease
- Clear explanation of lifecycle

---

### No Leases Ending Soon

- Muted confirmation state
- No celebratory UI

---

## 8. Accessibility & Performance

- Keyboard navigable rows
- Screen‑reader friendly status text
- Virtualized lists for scale
- No blocking animations

---

## 9. Data Model (Simplified)

```ts
Lease {
  id
  tenantName
  propertyName
  unitNumber
  startDate
  endDate
  rentAmount
  securityDeposit
  status
  renewalStatus
  documents[]
}
```

---

## What Is Explicitly Excluded

- ❌ Full document management system
- ❌ Accounting calculations
- ❌ Messaging inbox
- ❌ Compliance education or legal advice UI

---

## One‑Line Definition

> **The Leases page is a lifecycle and risk tracker—not a filing cabinet.**

---

_End of leases-page-plan.md_
