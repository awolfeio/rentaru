# single-property-actions.md

## Purpose
Defines the **More (⋯) actions menu** on the Single Property page.  
This menu contains **secondary, property-level actions** that are infrequent, administrative, or high-impact.  
Primary actions (e.g. *Add Unit*) are intentionally excluded.

---

## Placement & Trigger
- Location: Right of **Add Unit** CTA
- Trigger: Icon-only ellipsis button (⋯)
- Scope: Applies to the **entire property**, not individual units

---

## Menu Structure (Top → Bottom)

### 1. Property Management

#### Edit Property Details
- Name
- Address (with validation / geocoding)
- Property type (Apartment, Duplex, SFH, Mixed Use)
- Amenities (parking, storage, laundry, etc.)
- Year built, notes

#### Property Settings
- Default rent due date
- Grace period
- Late fee rules (flat / % / tiered)
- Accepted payment methods
- Auto-charge & reminders
- Default lease template

#### Manage Access / Roles
- Assign users to property
- Roles:
  - Owner
  - Property Manager
  - Accountant (read/write financials)
  - Maintenance (tickets only)
- Property-scoped permissions (overrides org defaults)

#### Property Documents
- Upload / manage:
  - Insurance
  - Inspections
  - Warranties
  - Floor plans
  - Compliance docs
- Tags + expiration dates
- Visibility control (internal vs tenant-facing)

---

### 2. Operations

#### Bulk Actions
Opens a modal with scoped bulk tools:
- Bulk rent updates
- Bulk fee application
- Bulk tenant notice (email / SMS)
- Bulk maintenance status updates

#### Export Property Data
- Units
- Tenants
- Leases
- Payments
- Maintenance tickets
Formats:
- CSV
- PDF (summary)
- Date range + filters

#### Generate Property Report
Quick-access reports:
- Property snapshot
- Delinquency report
- Occupancy trend
- Maintenance summary
Exportable + schedulable

---

### 3. Financial

#### Property Accounting Settings
- Linked bank account
- Ledger mapping
- Income/expense categories
- Tax region
- Owner payout rules

#### Reconcile Transactions
- Property-scoped reconciliation view
- Bank vs recorded payments
- Flags discrepancies

#### View Property Ledger
- Full property-level ledger
- Filter by unit, tenant, date, category
- Read-only for non-finance roles

---

### 4. Lifecycle & State

#### Duplicate Property
- Creates a new property using this one as a template
- Copies:
  - Settings
  - Fee rules
  - Document structure
- Does **not** copy tenants, payments, or leases

#### Transfer Property Ownership
- Reassign property to another owner/org
- Preserves historical data
- Permission-gated + audited

#### Archive Property
- Hides from active views
- Read-only access preserved
- Can be restored

---

### 5. Danger Zone (Visually Separated)

#### Delete Property
- Hard delete
- Disabled if:
  - Active leases exist
  - Outstanding balances exist
- Requires:
  - Explicit confirmation
  - Typed property name
  - Admin/Owner role
- Permanent and non-recoverable

---

## Permission Matrix (High Level)

| Action                          | Owner | Manager | Accountant | Maintenance |
|---------------------------------|-------|---------|------------|-------------|
| Edit Property Details           | ✓     | ✓       | ✕          | ✕           |
| Property Settings               | ✓     | ✓       | ✕          | ✕           |
| Manage Access / Roles           | ✓     | ✕       | ✕          | ✕           |
| Bulk Actions                    | ✓     | ✓       | ✕          | ✕           |
| Reports / Exports               | ✓     | ✓       | ✓          | ✕           |
| Accounting Settings             | ✓     | ✕       | ✓          | ✕           |
| Archive Property                | ✓     | ✓       | ✕          | ✕           |
| Delete Property                 | ✓     | ✕       | ✕          | ✕           |

---

## UX Rules

- **Secondary-only actions**  
  Nothing users do daily.
- **Context-aware enablement**  
  Disabled states explain *why*.
- **Keyboard accessible**
  - `.` opens menu
  - Arrow keys navigate
  - `Enter` activates
- **Audit logging**
  All actions logged with user + timestamp.

---

## Future Enhancements
- Saved bulk action presets
- Scheduled property reports
- Automation hooks (webhooks, Zapier)
- Property health score entry point

---

## Explicit Non-Goals
- No unit-specific actions
- No tenant messaging
- No lease signing
- No payment collection entry points
