# Accounting Page — Phase 1 Enhancement Implementation Plan

## Goal

Turn the current Accounting page from a static ledger mockup into a functional, high-value financial records screen for small landlords and early portfolio users.

Phase 1 should focus on clarity, filtering, transaction review, categorization, and export readiness without overbuilding forecasting, automation, or advanced accounting workflows.

---

## Current UI Baseline

The current `Accounting.tsx` already includes:

- Page header with date range control and CSV export button
- Summary cards for:
  - Total Income
  - Total Expenses
  - Net Cash Flow
- Transaction search input
- Filters button placeholder
- Property selector placeholder
- Ledger table
- Expandable transaction rows
- Basic row metadata:
  - Date
  - Description
  - Property
  - Unit
  - Category
  - Amount
  - Source reference
- Row actions:
  - Edit Category
  - Add Memo
  - View Receipt

This is a strong visual foundation. Phase 1 should make these interactions real and useful.

---

## Phase 1 Value Proposition

Phase 1 should answer the landlord’s most immediate accounting questions:

1. How much rent came in?
2. How much did I spend?
3. What is my net cash flow?
4. Which property/unit/tenant does each transaction belong to?
5. Are transactions categorized correctly?
6. Can I export clean records for bookkeeping or taxes?

---

## Primary User Jobs

### Landlord / Property Manager

- Review recent financial activity
- Search for a specific rent payment, vendor charge, or property expense
- Filter transactions by property, date, category, and type
- Correct transaction categories
- Add notes/memos for future reference
- Export transaction data

### Small Portfolio Owner

- Understand income vs expenses at a glance
- Identify unexpected expenses
- Prepare a basic record set for their accountant

---

## Data Model Updates

Expand the current `LedgerEntry` type.

```ts
type TransactionType = "income" | "expense";
type TransactionStatus =
  | "posted"
  | "pending"
  | "failed"
  | "refunded"
  | "voided";
type PaymentMethod = "ach" | "card" | "cash" | "check" | "manual" | "other";

type TransactionCategory =
  | "rental_income"
  | "late_fees"
  | "maintenance"
  | "repairs"
  | "utilities"
  | "management_fees"
  | "insurance"
  | "taxes"
  | "hoa"
  | "mortgage_interest"
  | "capex"
  | "other";

interface LedgerEntry {
  id: string;
  date: string;
  postedAt?: string;
  description: string;
  category: TransactionCategory;
  propertyId: string;
  propertyName: string;
  unitId?: string;
  unitNumber?: string;
  tenantId?: string;
  tenantName?: string;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  paymentMethod?: PaymentMethod;
  vendorName?: string;
  sourceType?:
    | "payment"
    | "maintenance_ticket"
    | "manual_entry"
    | "import"
    | "system_fee";
  sourceRef?: string;
  memo?: string;
  receiptUrl?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}
```

---

## Required Filters

The Phase 1 filter drawer/dropdown should include:

### Must-Have Filters

- Date range
  - This month
  - Last month
  - This quarter
  - This year
  - Custom range
- Property
  - Multi-select
- Unit
  - Disabled until property is selected, unless global unit search is supported
- Transaction type
  - Income
  - Expense
- Category
  - Multi-select
- Status
  - Posted
  - Pending
  - Failed
  - Refunded
- Amount range
  - Min
  - Max

### Useful Phase 1 Filters

- Tenant
- Vendor
- Payment method
- Has receipt
- Has memo
- Uncategorized only

---

## Search Behavior

The search input should search across:

- Description
- Property name
- Unit number
- Tenant name
- Vendor name
- Source reference
- Memo
- Category label

Recommended behavior:

- Debounced input, around 200–300ms
- Search term persists in URL query params
- Empty state updates based on active filters/search

Example empty states:

- No filters: `No transactions yet.`
- With search: `No transactions match “HVAC”.`
- With filters: `No transactions match the selected filters.`

---

## Summary Cards

Keep the existing three-card layout, but calculate values from filtered data.

### Cards

1. Total Income
2. Total Expenses
3. Net Cash Flow

### Recommended Enhancements

Add a small comparison line under each value:

- `+8.2% vs previous period`
- `-$1,240 vs previous period`
- `Based on 42 posted transactions`

For Phase 1, comparison can be optional if historical data is not ready.

---

## Ledger Table Enhancements

### Add Columns / Metadata

Current columns are good. Consider these refinements:

- Date
- Description
- Property / Unit / Tenant
- Category
- Status
- Amount
- Row action affordance

On desktop, status can be shown as a small badge. On mobile, status can appear inside the description/meta area.

### Amount Display

Income:

```txt
+$1,450.00
```

Expenses:

```txt
-$350.00
```

Pending transactions should be visually softer than posted transactions.

---

## Expanded Row Detail

The current expandable row is a good pattern. Phase 1 should make it more useful.

### Include

- Full transaction ID
- Source reference
- Property
- Unit
- Tenant or vendor
- Category
- Status
- Payment method
- Memo
- Receipt/document link
- Created/updated timestamps

### Actions

- Edit category
- Add/edit memo
- Attach/view receipt
- View related payment
- View related maintenance ticket

Do not add too many destructive or accounting-sensitive actions in Phase 1. Avoid delete/void/refund unless backend workflows are already defined.

---

## Category Editing

Add an inline category editor in the expanded row.

### Behavior

- User clicks `Edit Category`
- Category select appears
- User selects category
- Save updates transaction
- Toast confirms success

### UX Copy

Success:

```txt
Transaction category updated.
```

Error:

```txt
Couldn’t update category. Please try again.
```

---

## Memo Editing

Add memo creation/editing.

### Behavior

- User clicks `Add Memo` or `Edit Memo`
- Small textarea appears in expanded row or modal
- User saves
- Memo displays in transaction detail

### Memo Placeholder

```txt
Add a note for your records...
```

---

## Receipt Handling

Phase 1 should support receipt visibility even if uploads are basic.

### Minimum

- Show `View Receipt` only when `receiptUrl` exists
- Otherwise show `Attach Receipt`

### Better

- Allow upload
- Store document association
- Show file name, upload date, and preview/open action

---

## Export CSV

The existing `Export CSV` button should export the currently filtered transaction set.

### Export Columns

- Date
- Description
- Type
- Category
- Amount
- Status
- Property
- Unit
- Tenant
- Vendor
- Payment Method
- Source Type
- Source Reference
- Memo

### UX Behavior

- If no filters are active, export current selected date range
- If filters are active, export filtered results
- Button label can remain `Export CSV`
- Optional helper text in export confirmation: `Exports currently filtered transactions.`

---

## URL State

Persist the following in query params:

- Search query
- Date range
- Property IDs
- Unit IDs
- Transaction type
- Categories
- Status

This makes the page shareable, refresh-safe, and easier to debug.

---

## Empty States

### No Transactions

```txt
No transactions yet
Payments, expenses, and manual entries will appear here once activity begins.
```

### No Filter Results

```txt
No matching transactions
Try adjusting your filters or clearing your search.
```

### No Property Selected, if needed

```txt
Select a property to view unit-level accounting details.
```

---

## Loading States

Add skeleton states for:

- Summary cards
- Filter controls
- Ledger rows

Ledger skeleton should preserve the table shape so the page does not jump heavily during loading.

---

## Error States

### Failed to Load Transactions

```txt
Accounting data couldn’t be loaded
Refresh the page or try again in a moment.
```

Actions:

- Retry
- Clear filters, if filters are active

---

## Suggested Component Breakdown

```txt
AccountingPage
├── AccountingHeader
├── AccountingSummaryCards
├── AccountingToolbar
│   ├── TransactionSearch
│   ├── AccountingFilterButton
│   └── PropertySelector
├── AccountingFilterDrawer
├── LedgerTable
│   ├── LedgerTableHeader
│   ├── LedgerRow
│   └── LedgerRowExpandedDetail
├── CategoryBadge
├── StatusBadge
└── ExportTransactionsButton
```

---

## Implementation Steps

### Step 1: Replace Static Mock Totals

- Derive totals from transaction data
- Respect filters and date range
- Use posted transactions by default

### Step 2: Build Filter State

- Add filter state object
- Add date range state
- Add property selector state
- Add category/type/status filters

### Step 3: Implement Filter UI

- Use drawer, popover, or side panel
- Include clear/reset actions
- Show active filter count on button

Example:

```txt
Filters · 3
```

### Step 4: Implement Search

- Debounce input
- Search across key transaction fields
- Connect search to empty states

### Step 5: Expand Ledger Row Detail

- Add full metadata
- Add conditional receipt/memo UI
- Add category editing flow

### Step 6: Add CSV Export

- Export current filtered results
- Format category labels as human-readable text
- Preserve raw IDs where useful

### Step 7: Add Loading, Empty, and Error States

- Skeletons
- Empty states
- Retry state

---

## Phase 1 Acceptance Criteria

- User can filter transactions by date range, property, type, category, status, and amount.
- User can search transactions by description, property, tenant, vendor, memo, or reference.
- Summary cards update based on active filters.
- User can expand a transaction and review complete metadata.
- User can edit category.
- User can add/edit memo.
- User can view or attach a receipt if document storage exists.
- CSV export respects current filters.
- Page has loading, empty, and error states.
- Layout remains usable on mobile.

---

## Out of Scope for Phase 1

- Forecasting
- Anomaly detection
- QuickBooks export
- Schedule E tax mode
- Recurring transaction automation
- AI categorization
- Advanced reporting charts
- Bank reconciliation
- Multi-owner accounting splits
- Accrual accounting
