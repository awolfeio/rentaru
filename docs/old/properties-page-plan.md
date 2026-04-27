# Properties Page Plan

> **Purpose:** Define a scalable, no‑bloat Properties page that works for single‑property landlords and large rental portfolios, while preserving clarity, speed, and operational usefulness.

---

## Core Principles

- Properties are **containers**, not workflows
- Clear **Property → Unit** hierarchy
- Scales via **progressive density**, not feature sprawl
- Optimized for **portfolio scanning**, not deep analysis
- Inline expansion preferred over page jumps

---

## Mental Model

> _“Show me my buildings, tell me which ones need attention, and let me drill down without losing context.”_

---

## Page Layout Overview

```
┌───────────────────────────────────────────────┐
│ Properties Header + Controls                  │
├───────────────────────────────────────────────┤
│ Property List (Primary Surface)               │
│  ├─ Property Row                              │
│  │   ├─ Status Summary                        │
│  │   ├─ Inline Alerts                         │
│  │   └─ Expand → Unit Table                   │
│  └─ …                                         │
└───────────────────────────────────────────────┘
```

---

## 1. Properties Header

### Left: Page Identity

- **Title:** `Properties`
- **Subtitle:** `All buildings and unit status`

---

### Right: Primary Controls

- `+ Add Property`
- Search (property name, address)
- Filter (portfolio‑safe):

  - Occupancy status
  - Active maintenance
  - Overdue rent

**Rules**

- No global analytics here
- Filters persist per user

---

## 2. Property List (Primary Surface)

### Default View: Property Rows

Each property is represented by a **single dense row**.

#### Property Row Columns

| Column                  | Purpose                |
| ----------------------- | ---------------------- |
| Property Name + Address | Primary identifier     |
| Units                   | Total unit count       |
| Occupancy               | % occupied             |
| Rent Status             | Collected / Expected   |
| Maintenance             | Open / Urgent count    |
| Flags                   | Visual risk indicators |
| Expand                  | Drill‑down toggle      |

---

### Example Property Row

```
Oak Street Apartments
1234 Oak St, Portland OR

12 Units | 92% Occupied | $14,200 / $15,000 | 🛠 2 | ⚠️
```

---

### Visual Rules

- Neutral by default (gray)
- Color only for exceptions
- Icons > text for alerts
- Row height compact but readable

---

## 3. Property Status Summary (Inline)

Each property row visually encodes:

- **Occupancy health**
- **Rent collection completeness**
- **Maintenance pressure**

No numbers are repeated if visible elsewhere.

---

## 4. Inline Alerts (Property‑Level)

Shown as icons with hover detail:

- ⚠️ Lease expiring soon
- 💸 Overdue rent in property
- 🛠 Urgent maintenance

Clicking an alert:

- Opens inline contextual drawer
- Does _not_ navigate away

---

## 5. Expand → Unit‑Level Drilldown

### Interaction

- Click caret / row expansion
- Expands **inline** beneath property row
- No route change

---

### Unit Table (Expanded)

| Unit | Status   | Tenant   | Rent   | Lease      | Maintenance |
| ---- | -------- | -------- | ------ | ---------- | ----------- |
| 1A   | Occupied | J. Smith | $1,250 | Ends 06/24 | —           |
| 1B   | Vacant   | —        | —      | —          | 🛠           |

---

### Unit‑Level Rules

- Only critical fields shown
- No financial history here
- Click unit → Unit detail page

---

## 6. Property Row Actions

### Primary Actions (Inline)

- View property details
- Add unit
- Add maintenance

### Secondary Actions (Overflow Menu)

- Edit property
- Archive property
- Export property data

---

## 7. Scaling Behavior

### Small Landlords (1–5 Properties)

- Property rows slightly taller
- More text labels visible
- Expansion auto‑opens if ≤1 property

---

### Mid‑Size Portfolios (10–50 Properties)

- Compact rows
- Icon‑driven alerts
- Filters become essential

---

### Enterprise (100+ Properties)

- Pagination or virtualized list
- Bulk actions enabled
- Portfolio grouping toggle

---

## 8. Empty States

### No Properties Yet

- Simple onboarding CTA
- No charts
- Clear next step

### No Issues Detected

- Muted success state
- No celebratory UI

---

## 9. What Is Explicitly Excluded

- ❌ Tenants as a primary surface
- ❌ Financial reports
- ❌ Vendor management
- ❌ Global analytics
- ❌ Maps as default view

---

## 10. Accessibility & Performance

- Keyboard navigable rows
- Screen‑reader friendly alerts
- Virtualized list for large datasets
- Zero blocking animations

---

## 11. Data Model (Simplified)

```ts
Property {
  id
  name
  address
  unitCount
  occupiedCount
  rentCollected
  rentExpected
  openMaintenanceCount
  urgentMaintenanceCount
  alerts[]
}

Unit {
  id
  unitNumber
  status
  tenantName?
  rentAmount?
  leaseEndDate?
  maintenanceStatus?
}
```

---

## One‑Line Definition

> **The Properties page is a portfolio scanner, not a management console.**

---

_End of properties-page-plan.md_
