# Advanced Accounting Export Enhancement Implementation Plan

## Goal

Upgrade the current `Export CSV` action from a single flat transaction download into an advanced export workflow that lets property managers create precise, reusable, high-value financial exports across properties, date ranges, categories, transaction types, statuses, tags, vendors, tenants, units, and report formats.

The export experience should support simple landlords who only need a quick CSV, while also supporting larger operators who need segmented exports such as:

- All transactions for a custom date range
- Income and expenses for one property
- HVAC-related expenses across two specific properties
- Posted rental income by unit for tax prep
- Missing receipt expenses for bookkeeping cleanup
- Maintenance costs grouped by property
- Schedule E-style tax export by category
- Owner/property summary exports
- Selected transactions from the ledger table

---

## Current State

The current `Accounting.tsx` already includes a strong foundation:

- `LedgerEntry` data model with useful export fields: date, description, category, property, unit, tenant, amount, type, status, payment method, vendor, source type, source ref, memo, review status, deductible, and tax category.
- Transaction table with search, type filter, status filter, category filter, property selector placeholder, and bulk selection.
- Header-level `Export CSV` button.
- Bulk action bar export button.
- Reports tab with export cards.
- Existing `exportCSV()` function that exports either selected rows or currently filtered rows.

Current limitation: export behavior is implicit. The user cannot intentionally configure export scope, output type, grouping, columns, or report purpose before downloading.

---

## Recommended UX Direction

Replace the basic `Export CSV` button behavior with an **Advanced Export Modal / Drawer**.

The header button should become:

```tsx
<button onClick={() => setExportOpen(true)}>
  <FileSpreadsheet /> Export
</button>
```

Button label should be **Export**, not only **Export CSV**, because the feature should eventually support CSV, PDF, XLSX, tax summaries, and QuickBooks-style exports.

---

## Export Entry Points

### 1. Header Export Button

Primary universal export entry point.

Behavior:

- Opens advanced export modal.
- Defaults to the current page date range.
- Defaults to all currently visible/filtered transactions when filters are active.
- Allows user to override scope.

### 2. Transactions Bulk Export

When table rows are selected, bulk export should open the same modal with scope preselected as:

```ts
scope: 'selected_transactions'
selectedTransactionIds: [...selected]
```

The modal should show:

> Exporting 4 selected transactions

User can still choose format and columns.

### 3. Reports Tab Export Cards

Each report card should open the export modal with a preset:

- Transaction Export → detailed transaction export
- Property Summary → grouped property summary
- Uncategorized Transactions → filtered to category/review cleanup
- Missing Receipts → expenses without receipt documentation

---

## Export Modal Structure

### Modal Title

**Export Accounting Data**

### Modal Description

Create a custom financial export by choosing the report type, properties, date range, categories, and output format.

---

## Step 1: Report Type

Use cards or a select menu.

### Report Types

#### 1. Transaction Detail

Best for bookkeeping, audits, reconciliations, and raw ledger exports.

Includes one row per transaction.

#### 2. Property Summary

Best for performance review and owner reporting.

Groups by property and includes:

- Total income
- Total expenses
- Net cash flow
- Transaction count
- Expense ratio

#### 3. Category Summary

Best for understanding where money is going.

Groups by category and includes:

- Income
- Expenses
- Net
- Count
- Share of total expenses

#### 4. Tax Summary

Best for year-end preparation.

Groups by tax category / Schedule E-style category.

Includes:

- Tax category
- Deductible amount
- Non-deductible amount
- Related property
- Transaction count
- Missing receipt count

#### 5. Maintenance / Vendor Export

Best for reviewing repair costs, vendor activity, and maintenance-heavy properties.

Useful for searches like HVAC, plumbing, electrical, roofing, etc.

#### 6. Missing Documentation Export

Best for cleanup before tax filing or bookkeeping handoff.

Includes expenses missing receipts, memos, categories, tax categories, or review approval.

---

## Step 2: Export Scope

### Scope Options

```ts
type ExportScope =
  | 'all_transactions'
  | 'current_filters'
  | 'selected_transactions'
  | 'custom_query';
```

### Labels

- **All transactions**
- **Current filtered view**
- **Selected transactions**
- **Custom export**

### Recommended Default Logic

```ts
const defaultExportScope = selected.size > 0
  ? 'selected_transactions'
  : activeFilterCount > 0 || search.trim()
    ? 'current_filters'
    : 'custom_query';
```

---

## Step 3: Date Range

### Presets

- This month
- Last month
- This quarter
- Last quarter
- This year
- Last year
- Year to date
- Custom range

### Data Fields

```ts
interface DateRangeFilter {
  preset: 'this_month' | 'last_month' | 'this_quarter' | 'last_quarter' | 'this_year' | 'last_year' | 'ytd' | 'custom';
  startDate?: string;
  endDate?: string;
}
```

### UX Note

The top-level page date range should sync into the export modal, but the modal should allow changing it without changing the page itself.

---

## Step 4: Property / Unit Selection

### Filters

- All properties
- One property
- Multiple properties
- Specific units
- Specific tenants

### Example Use Case

A property manager wants to export HVAC overhaul expenses across **Highland Lofts** and **Oak Street Apartments** only.

The modal should support:

```ts
propertyIds: ['p1', 'p2']
categoryIds: ['maintenance', 'repairs', 'capex']
searchQuery: 'HVAC'
```

---

## Step 5: Transaction Filters

### Core Filters

- Transaction type: income / expense
- Status: posted / pending / failed / refunded / voided
- Category
- Tax category
- Review status
- Deductible only
- Missing receipt only
- Has receipt only
- Payment method
- Vendor
- Tenant
- Source type
- Amount range
- Search terms
- Tags

### Recommended Filter State

```ts
interface ExportFilters {
  scope: ExportScope;
  reportType: ExportReportType;
  dateRange: DateRangeFilter;
  propertyIds: string[];
  unitNumbers: string[];
  tenantNames: string[];
  transactionTypes: TransactionType[];
  statuses: TransactionStatus[];
  categories: TransactionCategory[];
  taxCategories: string[];
  reviewStatuses: ReviewStatus[];
  paymentMethods: PaymentMethod[];
  sourceTypes: LedgerEntry['sourceType'][];
  vendorNames: string[];
  tags: string[];
  deductibleOnly: boolean;
  missingReceiptsOnly: boolean;
  hasReceiptsOnly: boolean;
  amountMin?: number;
  amountMax?: number;
  searchQuery: string;
}
```

---

## Step 6: Output Format

### Phase 1 Formats

- CSV
- XLSX-like CSV fallback, if XLSX is not yet implemented

### Phase 2 Formats

- XLSX workbook
- PDF summary report
- QuickBooks-compatible CSV
- Tax preparer export
- Owner statement export

### Format Type

```ts
type ExportFormat = 'csv' | 'xlsx' | 'pdf' | 'quickbooks_csv' | 'tax_csv';
```

---

## Step 7: Column Selection

For transaction-level exports, allow users to include/exclude columns.

### Default Columns

- Date
- Posted date
- Description
- Type
- Category
- Tax category
- Amount
- Status
- Property
- Unit
- Tenant
- Vendor
- Payment method
- Source type
- Source reference
- Memo
- Review status
- Deductible
- Receipt attached
- Tags

### Column State

```ts
const EXPORT_COLUMNS = [
  { key: 'date', label: 'Date', default: true },
  { key: 'postedAt', label: 'Posted Date', default: true },
  { key: 'description', label: 'Description', default: true },
  { key: 'type', label: 'Type', default: true },
  { key: 'category', label: 'Category', default: true },
  { key: 'taxCategory', label: 'Tax Category', default: true },
  { key: 'amount', label: 'Amount', default: true },
  { key: 'status', label: 'Status', default: true },
  { key: 'propertyName', label: 'Property', default: true },
  { key: 'unitNumber', label: 'Unit', default: true },
  { key: 'tenantName', label: 'Tenant', default: true },
  { key: 'vendorName', label: 'Vendor', default: true },
  { key: 'paymentMethod', label: 'Payment Method', default: true },
  { key: 'sourceType', label: 'Source Type', default: true },
  { key: 'sourceRef', label: 'Source Reference', default: true },
  { key: 'memo', label: 'Memo', default: true },
  { key: 'reviewStatus', label: 'Review Status', default: true },
  { key: 'deductible', label: 'Deductible', default: true },
  { key: 'receiptUrl', label: 'Receipt Attached', default: true },
  { key: 'tags', label: 'Tags', default: true },
] as const;
```

---

## Step 8: Grouping and Sorting

### Group By Options

- None
- Property
- Unit
- Tenant
- Category
- Tax category
- Vendor
- Month
- Status

### Sort Options

- Date newest first
- Date oldest first
- Amount high to low
- Amount low to high
- Property A-Z
- Category A-Z

### Types

```ts
type ExportGroupBy = 'none' | 'property' | 'unit' | 'tenant' | 'category' | 'tax_category' | 'vendor' | 'month' | 'status';
type ExportSortBy = 'date_desc' | 'date_asc' | 'amount_desc' | 'amount_asc' | 'property_asc' | 'category_asc';
```

---

## Step 9: Export Preview

Before download, show a preview panel.

### Preview Content

- Number of transactions included
- Total income
- Total expenses
- Net cash flow
- Date range
- Number of properties included
- Number of categories included
- Missing receipt count
- Needs review count

### Example Preview Copy

> Export includes 18 transactions across 2 properties from Jan 1, 2024 to Mar 31, 2024.

### Empty State

If no rows match:

> No transactions match this export configuration. Adjust filters or clear the custom search term.

Disable export button until rows exist.

---

## Component Architecture

### New Components

```txt
AccountingExportDialog.tsx
ExportReportTypeSelector.tsx
ExportScopeSelector.tsx
ExportDateRangeSelector.tsx
ExportPropertySelector.tsx
ExportAdvancedFilters.tsx
ExportColumnSelector.tsx
ExportPreviewSummary.tsx
ExportPresetCard.tsx
```

### Recommended Folder

```txt
src/features/accounting/components/export/
```

If this app is still in a single-file prototype state, place the components below the existing tab components first, then split later.

---

## Implementation Steps

## Phase A: Advanced CSV Export Modal

### 1. Add Export State

```ts
const [exportOpen, setExportOpen] = useState(false);
const [exportPreset, setExportPreset] = useState<Partial<ExportFilters> | null>(null);
```

### 2. Replace Direct Export Button

Current:

```tsx
<button onClick={exportCSV}>Export CSV</button>
```

Replace with:

```tsx
<button onClick={() => {
  setExportPreset(null);
  setExportOpen(true);
}}>
  <FileSpreadsheet size={16} className="text-emerald-600" /> Export
</button>
```

### 3. Add Export Dialog to Page Root

```tsx
<AccountingExportDialog
  open={exportOpen}
  onClose={() => setExportOpen(false)}
  ledger={ledger}
  filteredLedger={filtered}
  selectedIds={selected}
  activeSearch={search}
  activeFilters={{ filterType, filterStatus, filterCategory }}
  preset={exportPreset}
/>
```

### 4. Build `getExportRows()` Utility

```ts
function getExportRows(
  ledger: LedgerEntry[],
  filteredLedger: LedgerEntry[],
  selectedIds: Set<string>,
  filters: ExportFilters
): LedgerEntry[] {
  let rows = filters.scope === 'selected_transactions'
    ? ledger.filter(e => selectedIds.has(e.id))
    : filters.scope === 'current_filters'
      ? filteredLedger
      : [...ledger];

  rows = rows.filter(e => {
    if (filters.propertyIds.length && !filters.propertyIds.includes(e.propertyId)) return false;
    if (filters.unitNumbers.length && !filters.unitNumbers.includes(e.unitNumber ?? '')) return false;
    if (filters.tenantNames.length && !filters.tenantNames.includes(e.tenantName ?? '')) return false;
    if (filters.transactionTypes.length && !filters.transactionTypes.includes(e.type)) return false;
    if (filters.statuses.length && !filters.statuses.includes(e.status)) return false;
    if (filters.categories.length && !filters.categories.includes(e.category)) return false;
    if (filters.taxCategories.length && !filters.taxCategories.includes(e.taxCategory ?? '')) return false;
    if (filters.reviewStatuses.length && !filters.reviewStatuses.includes(e.reviewStatus ?? 'ignored')) return false;
    if (filters.paymentMethods.length && !filters.paymentMethods.includes(e.paymentMethod ?? 'other')) return false;
    if (filters.vendorNames.length && !filters.vendorNames.includes(e.vendorName ?? '')) return false;
    if (filters.deductibleOnly && !e.deductible) return false;
    if (filters.missingReceiptsOnly && !!e.receiptUrl) return false;
    if (filters.hasReceiptsOnly && !e.receiptUrl) return false;
    if (filters.amountMin != null && e.amount < filters.amountMin) return false;
    if (filters.amountMax != null && e.amount > filters.amountMax) return false;

    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase().trim();
      const haystack = [
        e.description,
        e.propertyName,
        e.unitNumber,
        e.tenantName,
        e.vendorName,
        e.sourceRef,
        e.memo,
        CATEGORY_LABELS[e.category],
        e.taxCategory,
        ...(e.tags ?? []),
      ].filter(Boolean).join(' ').toLowerCase();

      if (!haystack.includes(q)) return false;
    }

    return true;
  });

  return rows;
}
```

### 5. Improve CSV Generation

Use a safer escaping helper:

```ts
function csvEscape(value: unknown) {
  const str = value == null ? '' : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}
```

### 6. Add Dynamic Filename

```ts
function buildExportFilename(filters: ExportFilters) {
  const date = new Date().toISOString().slice(0, 10);
  const report = filters.reportType.replaceAll('_', '-');
  return `rentaru-accounting-${report}-${date}.csv`;
}
```

### 7. Download CSV

```ts
function downloadCSV(filename: string, headers: string[], rows: unknown[][]) {
  const csv = [headers, ...rows]
    .map(row => row.map(csvEscape).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
```

---

## Phase B: High-Value Export Presets

Add preset chips/cards inside the export modal.

### Recommended Presets

#### Tax Prep Export

```ts
{
  label: 'Tax Prep Export',
  reportType: 'tax_summary',
  statuses: ['posted'],
  deductibleOnly: false,
  groupBy: 'tax_category'
}
```

#### Maintenance Expense Review

```ts
{
  label: 'Maintenance Expense Review',
  reportType: 'transaction_detail',
  transactionTypes: ['expense'],
  categories: ['maintenance', 'repairs', 'capex'],
  statuses: ['posted', 'pending']
}
```

#### Missing Receipts

```ts
{
  label: 'Missing Receipts',
  transactionTypes: ['expense'],
  missingReceiptsOnly: true,
  statuses: ['posted']
}
```

#### Rent Income Export

```ts
{
  label: 'Rent Income Export',
  transactionTypes: ['income'],
  categories: ['rental_income', 'late_fees'],
  statuses: ['posted']
}
```

#### Needs Review

```ts
{
  label: 'Needs Review',
  reviewStatuses: ['needs_review']
}
```

---

## Phase C: Reports Tab Integration

Update `ReportsTab` so report cards pass export presets instead of calling the flat `onExport` function.

### New Props

```ts
function ReportsTab({ onOpenExport }: {
  onOpenExport: (preset: Partial<ExportFilters>) => void;
})
```

### Example Card Action

```tsx
<button onClick={() => onOpenExport({
  reportType: 'property_summary',
  scope: 'custom_query',
  statuses: ['posted'],
})}>
  Export →
</button>
```

---

## Phase D: Future Backend/API Support

The frontend can generate CSV locally for now, but long-term exports should be backend-generated for reliability, permissions, audit logs, larger portfolios, and heavier report formats.

### Suggested API

```http
POST /api/accounting/exports
```

### Request Body

```ts
interface CreateAccountingExportRequest {
  reportType: ExportReportType;
  format: ExportFormat;
  filters: ExportFilters;
  columns: string[];
  groupBy: ExportGroupBy;
  sortBy: ExportSortBy;
}
```

### Response

```ts
interface CreateAccountingExportResponse {
  exportId: string;
  status: 'ready' | 'processing' | 'failed';
  downloadUrl?: string;
  expiresAt?: string;
}
```

### Export Audit Trail

Store:

- Export ID
- User ID
- Organization ID
- Created date
- Report type
- Format
- Filter summary
- Row count
- Download URL expiration

This becomes important for larger landlords and accounting workflows.

---

## UI Details

### Modal Layout

Recommended layout:

```txt
[Export Accounting Data]
[Report Type Cards]

Scope
[ All | Current View | Selected | Custom ]

Date Range
[Preset Select] [Start Date] [End Date]

Properties & Units
[Multi-select property dropdown]
[Optional unit selector]

Filters
[Type] [Status] [Category] [Tax Category]
[Vendor] [Tenant] [Payment Method]
[Deductible] [Missing receipts] [Needs review]

Columns
[Select all] [Default] [Custom checkboxes]

Preview
18 transactions · $8,400 income · $2,100 expenses · $6,300 net

[Cancel] [Export CSV]
```

### Use Drawer if Modal Feels Crowded

A right-side drawer may work better than a modal because export configuration can be dense.

Recommended desktop width:

```txt
640px–760px
```

Mobile:

```txt
Full-screen sheet
```

---

## Value-Add UX Copy

### Header Button

**Export**

### Modal Primary Button

**Export CSV**

Later, dynamically change based on format:

- Export CSV
- Export PDF
- Export XLSX
- Export for QuickBooks

### Preview Labels

- Transactions included
- Properties included
- Date range
- Income included
- Expenses included
- Net cash flow
- Missing receipts
- Needs review

### Warning Copy

If exporting tax data with unreviewed transactions:

> This export includes 2 transactions that still need review. Confirm categories before sending to your tax preparer.

If exporting expenses with missing receipts:

> 3 expense transactions are missing receipt documentation.

---

## Acceptance Criteria

### Core Export Behavior

- Header Export button opens advanced export modal/drawer.
- User can choose report type.
- User can choose export scope.
- User can filter by date range, property, type, status, category, vendor, tenant, payment method, deductible status, receipt status, and search term.
- User can preview export row count and totals before downloading.
- User can export selected ledger rows.
- User can export current filtered view.
- User can export custom queries independent of the current table filters.
- CSV output uses selected columns.
- CSV output uses safe quote escaping.
- Filename describes report type and date.

### Reports Tab Behavior

- Report cards open the export modal with relevant presets.
- Missing Receipts export only includes expense rows without receipt URLs.
- Property Summary export groups by property.
- Tax Summary export groups by tax category.

### UX Behavior

- Empty exports are blocked.
- Active export filters are summarized clearly.
- Modal works on mobile.
- Selected transaction count is shown when relevant.
- User can reset filters to defaults.

---

## Suggested Build Order

1. Rename header button from `Export CSV` to `Export`.
2. Add `exportOpen` and `exportPreset` state.
3. Create `AccountingExportDialog` shell.
4. Move existing CSV logic into reusable `downloadCSV()` utility.
5. Add export scope support: all / current filtered / selected.
6. Add date range support.
7. Add property, category, status, type, and search filters.
8. Add preview summary.
9. Add column selector.
10. Add report presets.
11. Wire Reports tab cards into the modal.
12. Add grouped summary exports.
13. Add future backend export API handoff notes.

---

## Future Enhancements

### Saved Export Templates

Allow users to save a reusable export configuration:

- “Quarterly Tax Export”
- “HVAC Expenses by Property”
- “Owner Statement - Oak Street”
- “Missing Receipts Cleanup”

### Scheduled Exports

Allow recurring delivery:

- Monthly property summary
- Quarterly tax summary
- Weekly missing receipts report

### Accounting Integrations

Future integrations:

- QuickBooks
- Xero
- Google Sheets
- Stripe reports
- Plaid-linked bank transactions

### Permissions

For larger organizations:

- Only admins can export all properties
- Managers can export assigned properties only
- Export events are audit-logged

---

## Final Product Value

This enhancement turns Accounting export from a basic utility into a serious property management workflow tool.

Instead of only downloading visible rows, landlords and operators can answer real operational questions:

- What did I spend on HVAC across these properties?
- Which properties had the highest maintenance costs this quarter?
- Which expenses are missing receipts?
- What should I send my tax preparer?
- What income and expenses belong to this owner/property?
- Which transactions need cleanup before year-end?

