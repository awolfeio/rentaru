# Reports Page Plan

> **Purpose:** Define a scalable, read‑only Reports page that produces clear, exportable summaries for owners, managers, and accountants—without turning reports into interactive dashboards or operational tools.

---

## Core Principles

- Reports are **outputs**, not workflows
- Optimized for **clarity, consistency, and export**
- Read‑only by default (no side effects)
- Progressive complexity: simple summaries → detailed breakdowns
- Same reports work for 1 property or 10,000

---

## Mental Model

> _“Give me clean summaries I can review, export, or share—without having to interpret charts.”_

---

## Page Layout Overview

```
┌───────────────────────────────────────────────┐
│ Reports Header + Scope Controls               │
├───────────────────────────────────────────────┤
│ Report Catalog (Primary Surface)              │
│  ├─ Report Card / Row                         │
│  │   ├─ Description                           │
│  │   └─ Generate / View                       │
│  └─ …                                         │
├───────────────────────────────────────────────┤
│ Report Viewer (Secondary Surface)             │
│  ├─ Summary                                   │
│  ├─ Tables                                    │
│  └─ Export Controls                           │
└───────────────────────────────────────────────┘
```

---

## 1. Reports Header

### Left: Page Identity

- **Title:** `Reports`
- **Subtitle:** `Financial and operational summaries`

---

### Right: Global Scope Controls

- Period selector (month / quarter / year / custom)
- Property scope:

  - All properties
  - Single property

- `Export All` (permissions-based)

**Rules**

- Defaults to current month
- Scope persists per user

---

## 2. Report Catalog (Primary Surface)

### Default View: Report List

Reports are presented as a **clear catalog**, not buried in menus.

---

### Report Categories

#### Financial

- Income Statement (Cash Flow)
- Expense Summary
- Net Operating Income (NOI)

---

#### Rent & Tenancy

- Rent Roll
- Delinquency Report
- Occupancy Report

---

#### Maintenance

- Maintenance Cost Summary
- Open vs Closed Tickets

---

#### Portfolio

- Property Performance Summary
- Unit Status Overview

---

### Report Card / Row Structure

| Element     | Purpose                  |
| ----------- | ------------------------ |
| Report Name | Clear, plain language    |
| Description | What this report answers |
| Actions     | View / Export            |

---

### Visual Rules

- Minimal card or list styling
- No charts in catalog
- Equal visual weight per report

---

## 3. Report Viewer (Generated View)

When a report is selected, it renders **below the catalog** or in a dedicated viewer pane.

---

### A. Report Header

- Report name
- Period
- Property scope
- Generated timestamp

---

### B. Summary Section (Top)

Short, high-signal metrics only.

**Example (Income Statement):**

- Total Income
- Total Expenses
- Net Cash Flow

No animations. No sparklines by default.

---

### C. Detailed Tables (Primary Content)

#### Table Characteristics

- Clean, spreadsheet-like
- Sortable columns (optional)
- No inline editing

---

### Example Table (Rent Roll)

| Property | Unit | Tenant     | Rent   | Status |
| -------- | ---- | ---------- | ------ | ------ |
| Oak St   | 3B   | Jane Smith | $1,250 | Paid   |

---

### D. Visualizations (Optional, Minimal)

- Simple bar charts allowed
- Never required to understand data
- Toggleable for power users

---

## 4. Export Controls

### Export Formats

- CSV (primary)
- PDF (formatted)
- XLSX (enterprise only)

---

### Export Rules

- Exports reflect current scope & filters
- Generated reports are immutable
- Clear labeling for audit use

---

## 5. Scaling Behavior

### Small Landlords (1–5 Properties)

- Few reports visible by default
- Financial + Rent reports emphasized

---

### Mid-Size Portfolios (10–100 Properties)

- Full catalog visible
- Property-scoped reports common

---

### Enterprise (500+ Properties)

- Saved report presets
- Scheduled exports
- Read-only access for accountants

---

## 6. Empty & Edge States

### No Data Available

- Clear explanation of missing inputs
- No error states

---

### Large Dataset Warning

- Informational notice for long-running exports
- Async generation with notification

---

## 7. Accessibility & Performance

- Keyboard navigable catalog
- Screen-reader friendly tables
- Async report generation for large datasets
- No blocking animations

---

## 8. Data Model (Simplified)

```ts
Report {
  id
  type
  periodStart
  periodEnd
  propertyScope
  generatedAt
  data
}
```

---

## What Is Explicitly Excluded

- ❌ Interactive dashboards
- ❌ Real-time updating reports
- ❌ Editing or what-if modeling
- ❌ Embedded accounting tools

---

## One-Line Definition

> **The Reports page is a factory for clean outputs—not a place to explore data.**

---

_End of reports-page-plan.md_
