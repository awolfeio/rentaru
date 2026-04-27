# Accounting Page — Phase 2 Enhancement Implementation Plan

## Goal

Evolve Accounting from a filtered transaction ledger into a financial intelligence layer for rental property management.

Phase 2 should help landlords understand performance, prepare taxes, detect issues, forecast cash flow, and connect transactions to the operational reality of each property.

---

## Phase 2 Value Proposition

Phase 2 should answer higher-value portfolio questions:

1. Which properties are most profitable?
2. Which units or tenants are creating risk?
3. Are expenses increasing abnormally?
4. What income is expected but missing?
5. What is tax-ready and what still needs review?
6. What should the landlord act on next?

---

## Core Product Direction

Phase 1 is a ledger.

Phase 2 should become an insight engine.

The user should not only see transactions. They should see:

- Performance trends
- Missing rent
- Expense anomalies
- Tax categorization gaps
- Property-level profitability
- Maintenance-cost patterns
- Forecasted cash flow
- Export-ready accounting reports

---

## Major Feature Areas

1. Property performance analytics
2. Expected vs actual cash flow
3. Tax mode
4. Smart categorization
5. Anomaly detection
6. Report exports
7. Bulk transaction workflows
8. Deeper operational linking

---

## Property Performance Analytics

Add a property-level financial breakdown above or beside the ledger.

### Recommended Metrics

Per property:

- Total income
- Total expenses
- Net cash flow
- Expense ratio
- Maintenance cost
- Rent collected
- Rent outstanding
- Average rent per occupied unit
- Occupancy-adjusted income

### UI Pattern

Add a `Performance` tab or collapsible section above the ledger.

Possible tabs:

```txt
Transactions | Performance | Tax View | Reports
```

For the initial Phase 2 iteration, tabs are cleaner than making the ledger page too dense.

---

## Property Performance Table

Add a table like:

| Property              |  Income | Expenses |     Net | Expense Ratio | Maintenance | Outstanding Rent |
| --------------------- | ------: | -------: | ------: | ------------: | ----------: | ---------------: |
| Oak Street Apartments | $14,500 |   $2,100 | $12,400 |         14.5% |        $850 |               $0 |
| Highland Lofts        | $23,000 |   $7,400 | $15,600 |         32.1% |      $4,200 |           $2,300 |

### Interactions

- Click property row to filter ledger to that property
- Sort by net cash flow, expenses, maintenance, or outstanding rent
- Highlight negative cash flow
- Highlight high expense ratio

---

## Expected vs Actual Cash Flow

Phase 2 should distinguish between what happened and what should have happened.

### Data Sources

Expected income:

- Active leases
- Monthly rent schedule
- Late fees
- Recurring tenant charges

Expected expenses:

- Recurring bills
- Management fees
- Insurance
- Mortgage, if tracked
- HOA dues
- Property taxes, if tracked

### UI Additions

Add a `Cash Flow Forecast` card or section.

Metrics:

- Expected income
- Received income
- Outstanding income
- Expected expenses
- Posted expenses
- Projected net

### Example Insight

```txt
$2,300 expected rent is still outstanding for Highland Lofts · Unit 102.
```

---

## Rent Collection Intelligence

Add rent collection-specific logic.

### Metrics

- Rent collected this month
- Rent outstanding
- Collection rate
- Late payments
- Partial payments
- Failed payments

### Tenant-Level Signals

- Consistently late tenant
- Partial payment pattern
- Failed ACH/card attempts
- Lease ending soon with unpaid balance

### Recommended UI

Add an insight card near summary cards:

```txt
Rent Collection
94% collected · $2,300 outstanding · 1 late tenant
```

---

## Tax Mode

Add a dedicated `Tax View` for year-end prep.

### Purpose

Help landlords and accountants quickly review income and deductible expenses by property.

### Tax View Should Include

- Tax year selector
- Property selector
- IRS-aligned category grouping
- Deductible vs non-deductible flag
- Uncategorized transactions warning
- Missing receipt warning
- Export options

### Suggested Tax Categories

- Rental income
- Advertising
- Auto/travel
- Cleaning and maintenance
- Commissions
- Insurance
- Legal and professional fees
- Management fees
- Mortgage interest
- Repairs
- Supplies
- Taxes
- Utilities
- Depreciation/CapEx review
- Other

### Important UX Note

Do not overclaim that the product automatically files taxes. Frame this as organization and export support.

Preferred copy:

```txt
Organize tax-year income and expenses for review with your accountant.
```

---

## Schedule E-Oriented Export

Add a tax-ready export separate from generic CSV.

### Export Options

- Transaction CSV
- Property summary CSV
- Tax category summary CSV
- Accountant packet PDF
- Receipt/document ZIP, if document storage supports it

### Accountant Packet PDF Should Include

- Property summary
- Income totals
- Expense totals by category
- Uncategorized transactions
- Transactions missing receipts
- Notes/memos

---

## Smart Categorization

Add assisted categorization to reduce manual work.

### Behavior

- System suggests category based on description, vendor, source, and past user edits
- User can accept or change suggestion
- Recurring matches are applied automatically after confirmation

### Examples

```txt
Water Bureau → Utilities
State Farm → Insurance
HVAC Pros → Repairs / Maintenance
Rent Payment → Rental Income
```

### UI Pattern

For uncategorized transactions:

```txt
Suggested: Utilities
[Accept] [Change]
```

---

## Uncategorized Review Queue

Create a focused queue for cleanup.

### Entry Point

Add warning card when needed:

```txt
12 transactions need review
Categorize these before exporting tax reports.
```

### Queue Actions

- Accept suggestion
- Change category
- Apply same category to similar transactions
- Add memo
- Mark as reviewed

---

## Anomaly Detection

Add lightweight anomaly insights.

### Examples

- Maintenance spending increased 40% vs previous period
- Utility bill is unusually high
- Property has negative cash flow this month
- Tenant paid late three months in a row
- Expense lacks receipt above a configured threshold
- Duplicate-looking expense detected

### UI Pattern

Add an `Insights` card stack.

Each insight should include:

- Plain-English summary
- Impact amount
- Related property/unit
- Action button

Example:

```txt
Maintenance costs are unusually high at Highland Lofts
$4,200 this month, compared with a $1,100 monthly average.
[View transactions]
```

---

## Bulk Transaction Workflows

Phase 2 should support larger landlords and power users.

### Bulk Actions

- Bulk categorize
- Bulk tag
- Bulk mark reviewed
- Bulk attach documents, if practical
- Bulk export selected
- Bulk assign vendor
- Bulk assign property/unit for imported/manual records

### UX Pattern

- Add row checkboxes
- Show sticky bulk action bar when selected

Example:

```txt
8 selected · Categorize · Tag · Mark reviewed · Export
```

---

## Tags and Review States

Add transaction tags and accounting review status.

### Suggested Fields

```ts
type ReviewStatus = "needs_review" | "reviewed" | "ignored";

interface LedgerEntry {
  tags?: string[];
  reviewStatus?: ReviewStatus;
  deductible?: boolean;
  taxCategory?: string;
  suggestedCategory?: TransactionCategory;
  confidenceScore?: number;
}
```

### Common Tags

- CapEx
- Deductible
- Needs receipt
- Reimbursable
- Owner paid
- Tenant chargeback
- Insurance claim

---

## Deeper Operational Linking

Transactions should connect to the rest of the property management system.

### Link Transactions To

- Tenant profile
- Lease
- Payment record
- Maintenance ticket
- Vendor
- Document/receipt
- Property report
- Unit ledger

### Expanded Row Upgrade

The expanded row can become a richer detail panel with related records.

Example sections:

- Transaction details
- Related tenant/lease
- Related maintenance ticket
- Documents
- Audit history

---

## Reports Section

Add a `Reports` tab or page section.

### Reports

- Income statement by property
- Cash flow report
- Rent roll collection report
- Expense report
- Maintenance expense report
- Tax summary
- Uncategorized transaction report
- Missing receipt report

### Report Controls

- Date range
- Property
- Unit
- Owner/entity
- Export format

---

## Charts and Visualizations

Keep visuals lightweight and decision-oriented.

### Recommended Charts

- Income vs expenses over time
- Net cash flow trend
- Expense category breakdown
- Property profitability ranking
- Rent collection rate over time

Avoid overly complex chart dashboards in the first Phase 2 pass.

---

## Navigation / Information Architecture

Recommended Accounting sub-navigation:

```txt
Overview
Transactions
Performance
Tax View
Reports
```

### Overview

- Summary cards
- Rent collection status
- Insights
- Cash flow trend

### Transactions

- Current ledger table
- Filters
- Bulk actions

### Performance

- Property/unit profitability
- Expense ratios
- maintenance trends

### Tax View

- Tax categories
- deductible review
- year-end export

### Reports

- Saved/exportable reports

---

## Backend / Data Requirements

Phase 2 likely requires additional backend support.

### Required

- Expected rent schedule from leases
- Transaction-to-lease relationship
- Transaction-to-maintenance-ticket relationship
- Category history
- Review status
- Tax category mapping
- Receipt/document metadata
- Vendor normalization
- Recurring transaction identification

### Useful

- Bank/payment processor imports
- Accounting export mapping
- Audit log
- Saved filters
- Saved reports

---

## Implementation Steps

### Step 1: Add Accounting Sub-Navigation

Create sections for:

- Overview
- Transactions
- Performance
- Tax View
- Reports

Keep Transactions as the current default view.

### Step 2: Add Property Performance Metrics

- Aggregate transactions by property
- Add performance table
- Add sorting
- Add click-to-filter behavior

### Step 3: Add Expected vs Actual Data

- Pull active lease rent schedules
- Compare expected rent against posted rent payments
- Show outstanding rent and collection rate

### Step 4: Add Tax View

- Add tax-year selector
- Map categories to tax categories
- Group totals by property/category
- Highlight uncategorized and missing receipt items

### Step 5: Add Review Queue

- Add `needs_review` state
- Add uncategorized queue
- Add accept/change category flow

### Step 6: Add Bulk Actions

- Add row selection
- Add sticky bulk action bar
- Implement bulk categorize/tag/review/export

### Step 7: Add Insights

- Add rule-based insights first
- Focus on high-confidence alerts
- Link each insight to filtered transactions

### Step 8: Add Advanced Exports

- Tax summary CSV
- Property summary CSV
- Accountant packet PDF
- Missing receipt report

---

## Phase 2 Acceptance Criteria

- User can view financial performance by property.
- User can identify highest and lowest performing properties.
- User can compare expected rent against received rent.
- User can see outstanding rent and collection rate.
- User can use Tax View to group income/expenses by tax category.
- User can identify uncategorized transactions and missing receipts.
- User can bulk categorize and mark transactions as reviewed.
- User can export tax-ready and property-level reports.
- User can see useful financial insights with links to supporting transactions.
- Accounting data is connected to tenants, leases, maintenance tickets, vendors, and documents.

---

## Out of Scope Until Later

- Full double-entry accounting
- Bank reconciliation workflows
- Payroll
- 1099 generation
- Owner distributions
- Trust accounting
- CAM reconciliation
- Advanced investor reporting
- Native tax filing
- Automated bookkeeping without user review
