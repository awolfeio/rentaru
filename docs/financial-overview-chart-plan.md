# financial-overview-chart-plan.md

## Component Name

**Financial Reality Overview — Cashflow Health Spectrum**

---

## Purpose

Provide a high-fidelity, intuitive visualization that shows **where money is coming from, where it’s stuck, where it’s leaking, and why** — across time, units, and operational risk.

This chart prioritizes **causality over totals** and replaces traditional bar/line charts with a more expressive financial reality view.

---

## Primary Visualization

### Chart Type

**Stacked Cashflow Flowband (Time-Based, Horizontal)**

- Orientation: Horizontal
- X-axis: Time (1M / 3M / 6M / YTD)
- Y-axis: Dollar value
- Rendering: Smooth, continuous stacked bands (not discrete bars)

---

## Flowband Layers (Bottom → Top)

1. **Collected Rent**

   - Fully received payments
   - Solid, confident color
   - Represents realized revenue

2. **Pending Rent**

   - Scheduled but not yet paid
   - Semi-transparent or subtle pattern
   - Indicates expected inflow

3. **Overdue Rent**

   - Past-due balances
   - Warm warning color (amber/orange)
   - Height grows with risk severity

4. **Vacancy Loss**

   - Lost potential income from unoccupied units
   - Muted red / neutral gray-red
   - Derived from unit vacancy × market rent

5. **Operating Expenses**

   - Repairs, maintenance, management costs
   - Neutral gray tone
   - Can be collapsed/expanded via toggle

6. **Net Cash Flow Overlay**
   - Top-level overlay or glow line
   - Represents true financial outcome after all factors

---

## Secondary Overlay

### Risk Pressure Line

A thin, floating line layered above flowbands.

**Inputs:**

- % overdue rent
- Vacancy rate
- Active maintenance severity
- Lease expirations proximity

**Behavior:**

- Color-shifts from green → amber → red
- Smooth transitions
- Visually communicates financial stress

---

## Interaction Model

### Hover / Scrub

- Scrubbing across time highlights contributing units
- Tooltips surface real-world causes

**Tooltip Content Example:**
March 12
• $2,450 overdue (3 units)
• Unit 3B water leak impacting cashflow
• 1 lease expiring within 30 days

yaml
Copy code

### Click / Drill-Down

- Clicking a band filters:
  - Units
  - Tenants
  - Tickets
  - Documents
- Deep-links into Unit Detail or Action Queue

---

## View Modes (Top-Right Toggle)

### Money Flow (Default)

- Standard stacked flowbands
- Emphasis on collected vs lost vs at-risk revenue

### Unit Health

- Flowbands reorganized by unit contribution
- Highlights underperforming units

### Risk Exposure

- Overdue + vacancy visually inflate
- Collected rent compresses
- Focuses attention on instability

---

## Supporting Metrics (Below Chart)

- **Net Cash Flow**
  - Value + directional momentum indicator
- **Average Rent / Unit**
- **Expense Burn Rate**
  - Expenses ÷ Gross rent
- **Portfolio Stability Score**
  - 0–100 composite score
  - Derived from rent reliability, occupancy, and maintenance load

---

## Visual Design Principles

- No visible grid lines
- Soft depth via shadows and subtle blur
- Gradient usage communicates meaning, not decoration
- Smooth animated transitions between time ranges
- Avoids “spreadsheet” or legacy dashboard aesthetics

---

## Responsiveness

### Desktop

- Full interactive flowband
- Hover + scrub enabled

### Mobile / Small Data Sets

- Simplified stacked area view
- Reduced layers
- Focus on Net Cash Flow + Risk Pressure

---

## Data Requirements (High Level)

- Rent ledger (paid, pending, overdue)
- Unit occupancy status
- Lease metadata (start/end)
- Maintenance tickets (severity, status)
- Expense records

---

## Design System Notes

- Component should be reusable across:
  - Portfolio Dashboard
  - Single Property Overview
- Supports theming via semantic tokens
- Animations should respect reduced-motion preferences

---

## Success Criteria

- User can answer “Why does my cash feel tight?” in under 5 seconds
- Financial issues are tied to real units, tenants, or events
- Chart feels premium, modern, and category-defining

---
