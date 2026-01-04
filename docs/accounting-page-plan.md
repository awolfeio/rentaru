# Accounting / Financials Page Plan

> **Purpose:** Define a scalable Accounting page that provides clear financial truth, tax‑ready exports, and audit confidence—without forcing small landlords into accountant‑grade complexity.

---

## Core Principles

- Accounting is **post‑transactional**, not real‑time ops
- Optimized for **accuracy, traceability, and export**
- Progressive complexity: simple summaries → detailed ledgers
- Clear separation from Payments (transactions) and Reports (presentation)
- Never blocks day‑to‑day property operations

---

## Mental Model

> _“Show me income vs expenses, where money went, and give me clean numbers for taxes or my CPA.”_

---

## Page Layout Overview

```
┌───────────────────────────────────────────────┐
│ Accounting Header + Period Controls           │
├───────────────────────────────────────────────┤
│ Financial Summary (Top Section)               │
├───────────────────────────────────────────────┤
│ Ledger / Transactions Table (Primary Surface)│
│  ├─ Entry Row                                 │
│  │   ├─ Category & Amount                     │
│  │   ├─ Property Context                      │
│  │   └─ Expand → Entry Details                │
│  └─ …                                         │
└───────────────────────────────────────────────┘
```

---

## 1. Accounting Header

### Left: Page Identity

- **Title:** `Accounting`
- **Subtitle:** `Income, expenses, and financial records`

---

### Right: Period & Scope Controls

- Period selector (month / quarter / year)
- Property scope:

  - All properties
  - Single property

- `Export` button

**Rules**

- Defaults to current year
- User’s last selection persists

---

## 2. Financial Summary (Top Section)

**Purpose:** High‑level financial truth before details

### Summary Metrics

Displayed as neutral KPI cards:

- **Total Income**
- **Total Expenses**
- **Net Cash Flow**
- **Operating Margin** (optional toggle)

---

### Visual Rules

- No animation by default
- No trend arrows unless explicitly enabled
- Color only for negative net cash flow

---

## 3. Ledger / Transactions Table (Primary Surface)

### Default View

A **chronological ledger** of accounting entries derived from payments and expenses.

---

### Ledger Row Columns

| Column          | Purpose                    |
| --------------- | -------------------------- |
| Date            | Transaction date           |
| Description     | Human‑readable label       |
| Category        | Accounting category        |
| Property / Unit | Context                    |
| Amount          | Debit / credit             |
| Balance         | Running balance (optional) |
| Expand          | Inline drilldown           |

---

### Example Ledger Row

```
Aug 1, 2026 | Rent – Jane Smith | Rental Income | Oak St · 3B | +$1,250
```

---

### Visual Rules

- Credits and debits clearly differentiated
- Neutral typography
- No dense gridlines

---

## 4. Categories & Classification

### Default Categories

- Rental income
- Late fees
- Maintenance & repairs
- Utilities
- Management fees
- Insurance
- Taxes

Categories are:

- Editable by advanced users
- Locked for historical entries once exported

---

## 5. Expand → Ledger Entry Inline Detail

### Interaction

- Click caret / row
- Expands inline beneath ledger row
- No navigation context loss

---

### Inline Detail Sections

#### A. Source Reference

- Linked payment or maintenance ticket
- Processor reference (if applicable)

---

#### B. Classification

- Category
- Property
- Unit (optional)

---

#### C. Audit Metadata

- Created date
- Last modified date
- Modified by

---

#### D. Quick Actions

- Re‑categorize (if unlocked)
- Add memo
- View source record

---

## 6. Scaling Behavior

### Small Landlords (1–5 Properties)

- Summary dominates visual hierarchy
- Ledger optional until expanded
- Categories simplified

---

### Mid‑Size Portfolios (10–100 Properties)

- Ledger becomes primary focus
- Property filtering essential
- CSV exports common

---

### Enterprise (500+ Properties)

- Virtualized ledger
- Bulk re‑categorization
- Locked periods (month close)

---

## 7. Exports & CPA Handoff

### Export Options

- CSV (ledger)
- Schedule E‑ready summary
- Property‑scoped exports

**Rules**

- Exported periods become read‑only
- Clear audit trail maintained

---

## 8. Empty & Edge States

### No Financial Activity

- Simple informational state
- No charts or prompts

---

### Incomplete Categorization

- Subtle warning indicator
- No blocking errors

---

## 9. Accessibility & Performance

- Keyboard‑navigable table
- Screen‑reader friendly debit/credit labeling
- Virtualized rows for large ledgers
- Zero blocking animations

---

## 10. Data Model (Simplified)

```ts
LedgerEntry {
  id
  date
  description
  category
  propertyName
  unitNumber?
  amount
  type // credit | debit
  sourceRef
}
```

---

## What Is Explicitly Excluded

- ❌ Real‑time payment handling
- ❌ Budgeting tools
- ❌ Forecasting
- ❌ Tax filing or advice
- ❌ Full double‑entry accounting UI

---

## One‑Line Definition

> **The Accounting page is the source of financial truth—not a bookkeeping application.**

---

_End of accounting-page-plan.md_
