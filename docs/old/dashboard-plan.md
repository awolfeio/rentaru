# Rental Property Management Dashboard Plan

> **Purpose:** Define the single, no‑bloat, high‑signal Dashboard page that aggregates portfolio health, financial reality, and operational risk for landlords of all sizes.

---

## Core Design Principles

- **Single‑screen truth** – Everything critical at a glance
- **Exception‑driven UI** – Color and emphasis only when something is wrong
- **Progressive density** – Scales from 1 unit → 10,000+ units
- **Action over analytics** – If it doesn’t change behavior, it doesn’t belong
- **No navigation duplication** – Dashboard aggregates, nav executes

---

## Dashboard Layout Overview

```
┌───────────────────────────────────────────────┐
│ 1. Portfolio Health Strip                     │
├───────────────────────┬───────────────────────┤
│ 2. Financial Reality  │ 3. Action Queue       │
│    Panel              │                       │
├───────────────────────┼───────────────────────┤
│ 4. Properties & Units │ 5. Tenant Pulse       │
├───────────────────────────────────────────────┤
│ 6. Timeline Scrubber (Optional / Power Mode) │
└───────────────────────────────────────────────┘
```

---

## 1. Portfolio Health Strip (Top, Always Visible)

**Purpose:** 5‑second portfolio health scan

### Metrics (KPI Cards)

- **Occupancy**
  `94.2% (↓1.1%)`
- **Rent Collected (MTD)**
  `$128,400 / $136,500`
- **Overdue Rent**
  `$4,250 · 3 tenants`
- **Active Maintenance**
  `6 open · 2 urgent`
- **Upcoming Lease Events**
  `4 in next 30 days`

### Behavior Rules

- Neutral by default; color only on exceptions
- Click → filtered drill‑down (no page change)
- Always visible (sticky on scroll)

---

## 2. Financial Reality Panel (Center‑Left)

**Purpose:** Cash clarity without accounting bloat

### Primary Visualization

**Cash In vs Cash Out (Last 90 Days)**

- Rent
- Fees
- Maintenance
- Fixed costs (mortgage, utilities, etc.)

Visualization: stacked bars or stacked area (no pie charts)

### Inline Financial Stats

- **Net Cash Flow (MTD)**
- **Average Rent / Unit**
- **Expense Spike Alert** (only if anomaly detected)

---

## 3. Action Queue (Center‑Right, Highest Priority)

**Purpose:** Immediate operational focus

### Unified Action Feed

Sorted by urgency and risk

Each item includes:

- Type icon (Rent / Maintenance / Lease / Compliance)
- Short, scannable description
- Time sensitivity
- One primary action

### Example Items

- `⚠️ Water leak – Unit 3B (Vendor unassigned)`
- `💸 Rent overdue – John S. (7 days)`
- `📄 Lease expires in 21 days – Unit 12`

### Constraints

- Max ~7 visible items
- No historical or resolved items
- Every item actionable in ≤2 clicks

---

## 4. Properties & Units Snapshot (Bottom‑Left)

**Purpose:** Spatial awareness without maps

### Condensed Grid View

| Property        | Units | Occupied | Flags |
| --------------- | ----- | -------- | ----- |
| Oak Street Apts | 12    | 92%      | ⚠️ 💸 |
| Burnside Duplex | 2     | 100%     | —     |

### Interaction

- Click property → inline unit‑level expansion
- No navigation context switch

---

## 5. Tenant Pulse (Bottom‑Right)

**Purpose:** Human risk indicators

### Core Metrics

- **Late Payment Rate (90 days)**
- **Maintenance Requests / Unit**
- **Average Response Time**

### Smart Highlights (Conditional)

Shown only when applicable:

- Chronic late payers
- Repeat maintenance request patterns
- Lease ending + overdue rent combinations

---

## 6. Timeline Scrubber (Optional / Power Mode)

**Purpose:** Temporal context without reports

### Timeline Events

- Rent collections
- Maintenance events
- Lease start / end / renewal

### Controls

- Horizontal scrub ±90 days
- Toggleable (off by default for small landlords)

---

## Smart Empty State Logic

Dashboard adapts automatically based on portfolio size and maturity.

### 1–2 Units

- Emphasis on:

  - Rent collected
  - Next lease event
  - Active maintenance

### 10–50 Units

- Action Queue dominates
- Financial panel expanded

### 100+ Units

- KPIs compress
- Action Queue + anomaly detection prioritized
- Optional portfolio segmentation toggle

---

## Explicit Exclusions (Non‑Negotiable)

- ❌ News or tips
- ❌ Marketing or upsells
- ❌ Redundant navigation
- ❌ Charts without decisions
- ❌ Welcome / greeting content
- ❌ AI insights without actions

---

## Dashboard Definition

> **Dashboard = Financial truth + operational risk + immediate actions**

Everything else belongs on secondary pages.

---

## Implementation Notes

- Designed for left‑nav platform architecture
- Works with React + Tailwind / shadcn component systems
- Progressive disclosure over feature flags
- Optimized for keyboard and command palette usage

---

_End of dashboard-plan.md_
