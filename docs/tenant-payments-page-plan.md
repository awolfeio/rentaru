# tenant-payments-page-plan.md

## Purpose

Provide tenants with a fast, transparent, low-friction experience for:

- Seeing what they owe
- Paying rent or other charges
- Verifying payment history
- Avoiding surprises or confusion

Primary tenant mental model:
**“How much do I owe → Pay it → See proof → Forget about it.”**

---

## Page Hierarchy (Top → Bottom)

1. Payment Summary (Primary CTA)
2. Balance Breakdown (Expandable)
3. Quick Pay Module
4. Autopay / Scheduled Payments
5. Payment History Timeline
6. Upcoming Charges (Optional)
7. Receipts & Documents

---

## 1. Payment Summary (Above the Fold)

### UI

Large summary card, visually dominant.

### Data Elements

- `current_balance_due`
- `due_date`
- `billing_period_start`
- `billing_period_end`
- `payment_status`
  - paid
  - due_soon
  - overdue
- `late_fee_applied` (boolean)

### Visual Treatments

- Amount displayed prominently
- Status pill color-coded:
  - Green: Paid
  - Yellow: Due Soon
  - Red: Overdue
- Primary CTA:
  - **Pay Now**
  - Disabled + “Paid” state when balance = 0

### Secondary Actions

- Schedule payment
- View breakdown (expands section below)

---

## 2. Balance Breakdown (Expandable Section)

### Behavior

- Collapsed by default
- Expands inline under summary

### Line Items

Each item includes:

- `label`
- `amount`
- `type`
  - rent
  - utility
  - fee
  - credit
  - adjustment
- Optional tooltip explanation

### Example Items

- Base Rent
- Utilities
- Parking / Storage
- Pet Rent
- Late Fees
- Credits
- **Total**

---

## 3. Quick Pay Module

### Payment Method Selector

- Saved payment methods (radio selection)
- Supported types:
  - ACH / Bank Account
  - Credit / Debit Card

### Fee Disclosure

- Inline, always visible before confirmation
- Example:
  - “Card payments include a 2.9% processing fee”

### Amount Selector

- Full balance (default)
- Custom amount
- Past-due only (if applicable)

### Primary Action

- **Confirm & Pay**
- Inline processing state
- No page redirect

---

## 4. Autopay / Scheduled Payments

### Autopay Status

- Enabled / Disabled toggle
- Linked payment method
- Run date (e.g. 1st of month)

### Actions

- Edit autopay
- Pause next payment
- Cancel autopay

### Microcopy

- “Autopay runs at 12:00am local time on the selected date.”

### Data

- `autopay_enabled`
- `autopay_method_id`
- `autopay_schedule_day`
- `autopay_next_run`

---

## 5. Payment History Timeline

### Layout

Reverse chronological list.

### Per-Row Data

- `transaction_date`
- `description`
- `amount`
- `payment_method`
- `status`
  - success
  - pending
  - failed
- `receipt_url`

### Row Actions

- View receipt
- Download PDF
- Retry payment (failed only)

### Filters

- Date range
- Status
- Payment type

---

## 6. Upcoming Charges (Optional Section)

### Purpose

Reduce surprise charges and support financial planning.

### Data

- Next rent amount
- Estimated utilities
- Scheduled recurring fees
- Expected total next due date

---

## 7. Receipts & Documents

### Contents

- Individual payment receipts (PDF)
- Annual payment summary
- Export options:
  - PDF
  - CSV

### Data

- `receipt_id`
- `year`
- `download_url`

---

## 8. Edge Case States

### No Balance Due

- Green success state
- Copy: “You’re all paid up”
- Show next due date

### Failed Payment

- Inline alert (non-blocking)
- Clear reason if available
- Retry CTA

### Partial Payments

- Explicit labeling
- Remaining balance always visible

---

## 9. UX & Interaction Principles

- No full-page reloads
- Inline confirmations
- Skeleton loaders for financial data
- Mobile-first tap targets
- One-screen payment flow
- Clear fee disclosure before payment

---

## 10. Mobile Layout Priority Order

1. Current Balance
2. Pay Now CTA
3. Payment Method
4. Breakdown (Accordion)
5. Payment History (Collapsible)

---

## Key Integrations (Implied)

- Payment processor (ACH + Card)
- Receipt generation
- Autopay scheduling
- Notifications (payment success, failure, upcoming due)

---

## Success Criteria

- Tenant can pay rent in under 30 seconds
- Zero ambiguity about balances or fees
- Payment proof always accessible
- Minimal support tickets related to payments
