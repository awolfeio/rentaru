# Record Payment Implementation Plan

## Goal

Implement a focused **Record Payment** flow for manually logging newly received payments that happened outside the app’s payment processor.

This feature should **not** be used for processor-driven ACH/card payments, payment retries, edits, refunds, waivers, or balance adjustments. Its purpose is to capture real-world rent/fee payments received through offline or external channels and reflect them in the Payments table, tenant ledger, accounting exports, and reporting.

## Supported Manual Payment Methods

The Record Payment flow should only support these payment methods:

- Cash
- Check
- Money order
- External bank transfer
  - Zelle
  - Wire
  - External ACH
  - Direct bank transfer outside the processor
- External digital wallet
  - Venmo
  - PayPal
  - Apple Cash
- Third-party payer
  - Employer-paid rent
  - Housing assistance
  - Family member or other authorized payer

## Non-Goals

This flow should not include:

- Editing an existing payment
- Refunding a payment
- Retrying a failed processor payment
- Recording processor-native ACH/card payments
- Waiving rent or fees
- Creating balance adjustments
- Reversing payments
- Managing payment plans
- Initiating money movement

Manual payment editing should exist after creation, but only from the payment detail/expanded row experience, not inside the initial Record Payment flow.

---

# UX Overview

## Primary CTA

Current CTA:

```tsx
Record Payment
```

Recommended label:

```tsx
Record Manual Payment
```

Alternative shorter label:

```tsx
Record Payment
```

If keeping the shorter label, the modal title and helper text should make the scope clear.

## Click Behavior

Clicking the CTA opens a modal or right-side drawer.

Recommended: **right-side drawer** for this product because payment recording benefits from more vertical form space, better review layout, and future extensibility.

Drawer title:

```txt
Record Manual Payment
```

Drawer description:

```txt
Log a payment received outside Rentaru, such as cash, check, money order, Zelle, Venmo, PayPal, Apple Cash, wire, or a third-party payer.
```

---

# Recommended Flow

## Step 1: Select Tenant / Lease Context

Fields:

- Tenant search
- Property
- Unit
- Lease period / active lease context

Behavior:

- User searches tenant by name, unit, property, or email.
- Selecting a tenant auto-populates property and unit.
- If tenant has multiple active or historical leases, require selecting the correct lease/context.
- If the user opened the flow from a tenant or unit page later, prefill this section.

Validation:

- Tenant is required.
- Property/unit context is required.

## Step 2: Payment Details

Fields:

- Amount received
- Date received
- Payment method
- Payment source detail
- Reference number / memo
- Notes

Payment method options:

```ts
type ManualPaymentMethod =
  | 'cash'
  | 'check'
  | 'money_order'
  | 'external_bank_transfer'
  | 'external_digital_wallet'
  | 'third_party';
```

Conditional detail field:

- Check → Check number
- Money order → Money order number
- External bank transfer → Transfer type/reference
- External digital wallet → Platform + transaction/reference ID
- Third-party payer → Payer name + payer type
- Cash → Receipt number or optional internal note

Recommended amount behavior:

- Default to open balance if tenant has an outstanding balance.
- Allow custom amount.
- Allow partial payment.

## Step 3: Apply Payment

Default behavior:

- Automatically apply payment to oldest unpaid balance first.
- Prioritize rent before fees unless the landlord manually changes allocation.

Suggested simple UI:

```txt
Apply to: Current open balance
```

Advanced optional control:

```txt
Customize allocation
```

When expanded, show unpaid charges:

- January Rent — $1,450.00 outstanding
- Late Fee — $50.00 outstanding
- Utilities — $85.00 outstanding

User can allocate the payment amount across one or more charges.

Validation:

- Allocated amount cannot exceed payment amount.
- Allocated amount must equal payment amount unless the system supports unapplied credit.
- If unapplied credit is supported, clearly label remaining amount as tenant credit.

Phase 1 recommendation:

- Support auto-apply to oldest open balance.
- Support partial payments.
- Defer complex manual allocation if needed.

## Step 4: Optional Proof / Attachment

Fields:

- Upload receipt/check image/proof of payment
- Internal notes

Accepted files:

- PDF
- JPG
- PNG
- HEIC, if supported

Attachment examples:

- Photo of check
- Money order receipt
- Venmo screenshot
- PayPal receipt
- Wire confirmation

## Step 5: Review + Submit

Before submission, show a compact summary:

```txt
Tenant: Jane Smith
Property: Oak Street Apartments · Unit 3B
Amount: $1,450.00
Method: Check
Date received: Jan 5, 2024
Applies to: January Rent
Status: Paid
```

Primary action:

```txt
Record Payment
```

Secondary action:

```txt
Cancel
```

On success:

- Close drawer.
- Add payment to top of Payments table.
- Show toast confirmation.
- Update tenant balance.
- Update accounting ledger.

Toast:

```txt
Manual payment recorded successfully.
```

---

# Payment Status Logic

For manually recorded payments, status should usually be:

```ts
'paid'
```

Optional future statuses:

```ts
'tentative'
'voided'
```

Recommended Phase 1 status:

- Use `paid` for all successfully recorded manual payments.
- Do not use `pending`, `failed`, or `late` for manually recorded payments.

Reasoning:

- The user is recording money they already received.
- Pending/failed are processor-oriented states.
- Late describes an unpaid charge state, not a successful manual payment state.

---

# Data Model Updates

## Current Type

```ts
type PaymentMethod = 'ach' | 'card' | 'cash' | 'check';
```

## Recommended Type Expansion

```ts
type PaymentOrigin = 'processor' | 'manual';

type ProcessorPaymentMethod = 'ach' | 'card';

type ManualPaymentMethod =
  | 'cash'
  | 'check'
  | 'money_order'
  | 'external_bank_transfer'
  | 'external_digital_wallet'
  | 'third_party';

type PaymentMethod = ProcessorPaymentMethod | ManualPaymentMethod;
```

## Recommended Payment Interface

```ts
interface Payment {
  id: string;
  date: string;
  tenantName: string;
  tenantId?: string;
  propertyName: string;
  propertyId?: string;
  unitNumber: string;
  unitId?: string;
  leaseId?: string;
  type: PaymentType;
  amount: number;
  method: PaymentMethod;
  origin: PaymentOrigin;
  status: PaymentStatus;

  last4?: string;
  processorRef?: string;

  manualRef?: string;
  manualSourceLabel?: string;
  payerName?: string;
  payerType?: 'tenant' | 'employer' | 'housing_assistance' | 'family' | 'other';
  notes?: string;
  attachmentCount?: number;
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
  editable?: boolean;

  failureReason?: string;
  nextRetryDate?: string;
}
```

## Example Manual Payment

```ts
{
  id: 'pay_5',
  date: '2024-01-06',
  tenantName: 'Jane Smith',
  propertyName: 'Oak Street Apartments',
  unitNumber: '3B',
  type: 'rent',
  amount: 1450,
  method: 'check',
  origin: 'manual',
  status: 'paid',
  manualRef: 'Check #1042',
  notes: 'Dropped off at office.',
  createdBy: 'Admin User',
  createdAt: '2024-01-06T15:21:00Z',
  editable: true
}
```

---

# UI Changes to Payments.tsx

## 1. Add modal/drawer state

```tsx
const [recordPaymentOpen, setRecordPaymentOpen] = useState(false);
```

Update CTA:

```tsx
<button
  onClick={() => setRecordPaymentOpen(true)}
  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium text-sm shadow-sm"
>
  <Plus size={16} />
  Record Manual Payment
</button>
```

Render drawer:

```tsx
<RecordManualPaymentDrawer
  open={recordPaymentOpen}
  onOpenChange={setRecordPaymentOpen}
  onSubmit={handleRecordManualPayment}
/>
```

## 2. Update method display logic

Current logic assumes ACH/card icons and last4.

Replace with helper:

```tsx
const getPaymentMethodLabel = (payment: Payment) => {
  if (payment.origin === 'processor') {
    return `${payment.method.toUpperCase()} •••• ${payment.last4}`;
  }

  const labels: Record<ManualPaymentMethod, string> = {
    cash: 'Cash',
    check: payment.manualRef ? `Check · ${payment.manualRef}` : 'Check',
    money_order: payment.manualRef ? `Money order · ${payment.manualRef}` : 'Money order',
    external_bank_transfer: payment.manualSourceLabel || 'External bank transfer',
    external_digital_wallet: payment.manualSourceLabel || 'External digital wallet',
    third_party: payment.payerName ? `Third-party · ${payment.payerName}` : 'Third-party payment',
  };

  return labels[payment.method as ManualPaymentMethod];
};
```

## 3. Add manual badge/indicator

Manual payments should be visually distinguishable without feeling like an exception.

Example:

```txt
MANUAL · CHECK #1042
```

or

```txt
CHECK · Manual
```

## 4. Expanded row should expose edit action only for manual payments

In the expanded row action area:

```tsx
{payment.origin === 'manual' && payment.editable && (
  <button className="flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium bg-white dark:bg-card border rounded-md hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm w-full">
    Edit Manual Payment
  </button>
)}
```

Important:

- Do not place editing inside the initial Record Payment drawer.
- Editing belongs in the payment details/expanded row flow.
- Processor payments should not show edit payment.

---

# Manual Payment Edit Experience

Manual payments should be editable after creation, but editing should be a secondary detail action.

Entry points:

- Expanded payment row
- Payment detail page/drawer, if introduced later

Editable fields:

- Date received
- Manual method details/reference number
- Notes
- Attachment/proof
- Allocation, if supported

Potentially editable with caution:

- Amount
- Tenant/lease context

Recommended guardrail:

If amount or tenant context changes, show a warning:

```txt
Changing the amount or tenant may affect balances, reports, and accounting records.
```

Audit behavior:

- Preserve created date.
- Track edited date.
- Track edited by.
- Store change history if possible.

Do not allow editing:

- Processor reference
- Processor-native ACH/card payments
- Failed/pending processor payment state

---

# Validation Rules

Required:

- Tenant
- Property/unit context
- Amount greater than $0
- Date received
- Manual payment method

Conditional required:

- Check number for check payments, recommended but not strictly required
- Money order number for money order payments, recommended but not strictly required
- Platform for digital wallet payments
- Payer name for third-party payments

Duplicate detection:

Warn if a payment exists with:

- Same tenant
- Same amount
- Same date or within 2 days
- Same method

Warning copy:

```txt
Possible duplicate payment found. Review existing payments before recording another one.
```

Allow override:

```txt
Record Anyway
```

---

# Accounting / Ledger Behavior

On successful creation, the system should:

1. Create a payment record.
2. Mark origin as `manual`.
3. Apply the payment to the tenant ledger.
4. Reduce outstanding balance.
5. Add an accounting ledger entry.
6. Include the payment in reports and exports.
7. Include method/source metadata for reconciliation.

Recommended ledger label examples:

- `Manual Payment · Cash`
- `Manual Payment · Check #1042`
- `Manual Payment · Zelle`
- `Manual Payment · Employer-paid rent`

---

# Filters and Search Updates

Add filters for:

- Origin
  - Processor
  - Manual
- Manual method
  - Cash
  - Check
  - Money order
  - External bank transfer
  - External digital wallet
  - Third-party
- Status
- Property
- Tenant
- Date range

Search should include:

- Tenant name
- Unit
- Property
- Payment ID
- Processor ref
- Manual ref
- Check number
- Money order number
- Payer name
- Digital wallet platform

---

# Component Plan

## New Components

```txt
RecordManualPaymentDrawer.tsx
ManualPaymentMethodSelect.tsx
TenantPaymentContextSearch.tsx
PaymentAllocationSelector.tsx
PaymentProofUploader.tsx
ManualPaymentReviewSummary.tsx
EditManualPaymentDrawer.tsx
```

## Helpers

```txt
paymentMethodLabels.ts
paymentValidation.ts
paymentDuplicateDetection.ts
paymentAllocation.ts
```

## Suggested File Structure

```txt
src/features/payments/
  components/
    RecordManualPaymentDrawer.tsx
    EditManualPaymentDrawer.tsx
    ManualPaymentMethodSelect.tsx
    TenantPaymentContextSearch.tsx
    PaymentAllocationSelector.tsx
    PaymentProofUploader.tsx
    ManualPaymentReviewSummary.tsx
  utils/
    paymentMethodLabels.ts
    paymentValidation.ts
    paymentDuplicateDetection.ts
    paymentAllocation.ts
  types.ts
```

---

# Phase 1 Scope

## Include

- Record Manual Payment CTA
- Drawer/modal form
- Supported manual payment methods
- Tenant/context selection
- Amount/date/method fields
- Conditional method details
- Optional notes
- Optional attachment placeholder UI
- Auto-apply to open balance
- Create manual payment record
- Show manual payment in Payments table
- Expanded row metadata for manual payments
- Edit Manual Payment action from expanded row
- Basic edit drawer
- Duplicate warning

## Defer

- Complex multi-charge allocation
- Full attachment storage implementation
- Payment reversal/void workflow
- Approval workflow
- Full audit log UI
- Bulk manual payment import
- Receipt generation
- Tenant notification controls

---

# Phase 2 Enhancements

- Manual allocation across rent, fees, deposits, and utilities
- Unapplied tenant credit support
- Full edit history / audit timeline
- Void/reversal flow
- Receipt generation
- Send receipt to tenant
- Bulk import from CSV
- Bank reconciliation tagging
- Advanced reports by payment origin/method
- Permission controls for who can record/edit manual payments
- Attachment preview and document storage integration

---

# Recommended Acceptance Criteria

## CTA / Entry

- User can open the Record Manual Payment drawer from the Payments page.
- Drawer clearly explains that this is only for payments received outside the processor.

## Creation

- User can record cash, check, money order, external bank transfer, external digital wallet, and third-party payments.
- User cannot select native ACH/card processor payment methods in this flow.
- Required fields are validated.
- Successful submission creates a new payment with `origin: 'manual'` and `status: 'paid'`.

## Table Display

- Manual payments appear in the Payments table.
- Manual payments display a clear method/source label.
- Processor payments continue to display ACH/card and last4.

## Editing

- Manual payments show an Edit Manual Payment action after creation.
- Processor payments do not show the edit action.
- Editing is accessed from the expanded row/detail experience, not the core record payment UI.

## Accounting

- Manual payments update tenant balance.
- Manual payments appear in accounting and reporting data.
- Manual payment metadata is preserved for reconciliation.

---

# Suggested Copy

## Drawer Title

```txt
Record Manual Payment
```

## Drawer Description

```txt
Use this to log payments received outside Rentaru, such as cash, check, money order, Zelle, Venmo, PayPal, Apple Cash, wire, or third-party payments.
```

## Helper Warning

```txt
Online ACH and card payments are recorded automatically. Only record a payment manually if it was received outside the app.
```

## Duplicate Warning

```txt
A similar payment already exists for this tenant. Review it before recording another payment.
```

## Success Toast

```txt
Manual payment recorded successfully.
```

## Edit Warning

```txt
Editing this payment may affect tenant balances, accounting records, and reports.
```
