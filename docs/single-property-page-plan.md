# Single Property Page Plan

> **Purpose:** Define a powerful, scalable Single Property page that acts as the **operational command center** for one property (e.g. _Highland Lofts_), consolidating units, tenants, finances, maintenance, and documents—without duplicating global dashboards or devolving into unit-level micromanagement.

---

## Core Principles

- A property is a **mid-level aggregation layer** (between portfolio and unit)
- Optimized for **property-level decision making**
- Consolidates _context_, not workflows
- Inline drilldowns over page hopping
- Scales from duplexes → 300+ unit buildings

---

## Mental Model

> _“How is this property performing, what’s going wrong here specifically, and where should I intervene?”_

---

## Page Role in the System

- **Dashboard** → portfolio-wide priorities
- **Properties Page** → portfolio scanner
- **Single Property Page** → _deep operational context for one property_
- **Unit Page** → individual execution

This page is the **hub** for everything related to one property.

---

## Page Layout Overview

```
┌──────────────────────────────────────────────────┐
│ Property Header (Identity + Health)              │
├──────────────────────────────────────────────────┤
│ Property KPI Strip                               │
├───────────────────────────────┬──────────────────┤
│ Units Overview                 │ Property Activity│
│ (Primary Surface)              │ Feed             │
├───────────────────────────────┼──────────────────┤
│ Financial Summary              │ Maintenance      │
│                               │ Snapshot         │
├──────────────────────────────────────────────────┤
│ Documents & Reports (Secondary)                  │
└──────────────────────────────────────────────────┘
```

---

## 1. Property Header

### Identity

- **Property Name:** `Highland Lofts`
- **Address:** Full address
- **Property Type:** Apartment / Duplex / Mixed-use
- **Units:** Total unit count

---

### Header Actions

- Edit property
- Add unit
- Add maintenance ticket

**Rules**

- No destructive actions surfaced here

---

## 2. Property KPI Strip

**Purpose:** Immediate health check for this property only

### KPIs

- **Occupancy** → `94%`
- **Rent Collected (MTD)** → `$48,200 / $51,000`
- **Overdue Balance** → `$1,850`
- **Open Maintenance** → `3 (1 urgent)`
- **Leases Ending Soon** → `2`

**Rules**

- Same visual language as Dashboard KPIs
- Click KPI → filtered section below

---

## 3. Units Overview (Primary Surface)

### Purpose

Understand unit-level status without losing property context.

---

### Units Table

| Unit | Status   | Tenant   | Rent   | Lease End | Flags |
| ---- | -------- | -------- | ------ | --------- | ----- |
| 101  | Occupied | J. Smith | $1,450 | 06/24     | ⚠️    |
| 102  | Vacant   | —        | —      | —         | —     |

---

### Visual Rules

- Compact rows
- Icons for alerts
- Color only for exceptions

---

### Unit Interactions

- Click unit → Unit Detail Page
- Inline filters:

  - Vacant
  - Lease ending soon
  - Maintenance issues

---

## 4. Property Activity Feed (Right Column)

### Purpose

Chronological awareness of what’s happening at this property.

---

### Activity Types

- Payments received
- Maintenance updates
- Lease events
- Messages

**Rules**

- Read-only
- No actions here

---

## 5. Financial Summary (Property-Scoped)

### Purpose

Quick financial truth without entering Accounting.

---

### Summary Metrics

- Income (MTD / YTD)
- Expenses (MTD / YTD)
- Net cash flow

---

### Visualization

- Simple bar or stacked view
- Toggle MTD / YTD
- No forecasting

---

## 6. Maintenance Snapshot

### Purpose

Understand maintenance pressure for this property.

---

### Snapshot

- Open tickets
- Urgent tickets
- Avg resolution time

---

### Inline List (Top 3)

- Ticket title
- Unit
- Status

Click → full Maintenance page filtered to property

---

## 7. Documents & Reports (Secondary Section)

### Documents

- Property-level documents
- Inspection reports
- Insurance

---

### Reports

- Property income statement
- Rent roll
- Maintenance cost summary

Exports only; no editing.

---

## 8. Scaling Behavior

### Small Landlords (1 Property)

- Page acts as de facto dashboard
- Units table dominates
- Financials simplified

---

### Mid-Size Portfolios (10–50 Properties)

- KPI strip critical
- Units + maintenance most used

---

### Enterprise (100+ Properties)

- Property page is used surgically
- Filters and quick links prioritized
- Read-only access common for staff

---

## 9. Accessibility & Performance

- Keyboard navigable tables
- Screen-reader friendly KPIs
- Virtualized unit tables for large properties
- No blocking animations

---

## 10. Data Model (Simplified)

```ts
Property {
  id
  name
  address
  unitCount
  occupiedCount
}

PropertyMetrics {
  occupancyRate
  rentCollected
  rentExpected
  overdueBalance
  openMaintenanceCount
}

UnitSummary {
  unitNumber
  status
  tenantName?
  rent?
  leaseEndDate?
  flags[]
}
```

---

## What Is Explicitly Excluded

- ❌ Portfolio-wide analytics
- ❌ Tenant-level messaging UI
- ❌ Accounting categorization
- ❌ Unit-level workflows

---

## One-Line Definition

> **The Single Property page is an operational command center for one building—not a mini-dashboard clone.**

---

_End of single-property-page-plan.md_
