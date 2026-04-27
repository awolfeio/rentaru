# tenants-filters-plan.md

## Purpose

Define a comprehensive, scalable filtering system for the **Tenants** page that supports:

- Small landlords (1–10 units)
- Mid-size portfolios
- Enterprise property management
- Accounting, operations, and risk workflows

Filters must enable **rapid triage**, **financial oversight**, and **operational action**, while remaining approachable and performant.

---

## Filter UX Architecture

### Filter Entry Points

- **Primary Filters (Top Bar / Always Visible)**
  - Tenant Status
  - Rent Status
  - Lease Expiring Soon
- **Advanced Filters Drawer**
  - All remaining filters
- **Saved Filter Presets**
  - User-defined and system-defined
- **Active Filter Chips**
  - Dismissible
  - Persistent on page reload

---

## Core Filter Categories

---

## 1. Tenant Status Filters

Defines the lifecycle and operational state of the tenant.

**Field:** `tenant_status`

**Options:**

- All
- Active
- Inactive / Former
- Pending Move-In
- Pending Move-Out
- Notice Given
- Eviction In Progress
- Lease Ended (Historical)

**Default:** Active

---

## 2. Rent & Financial Status

### 2.1 Rent Status

**Field:** `rent_status`

**Options:**

- Paid
- Partially Paid
- Overdue
- Credit Balance
- No Balance

---

### 2.2 Overdue Aging Buckets

**Field:** `overdue_days`

**Options:**

- 1–7 days
- 8–30 days
- 31–60 days
- 60+ days

---

### 2.3 Balance Amount

**Field:** `balance_amount`

**Options:**

- $0
- $1–$499
- $500–$999
- $1,000+
- Custom Range (min / max)

---

## 3. Lease Filters

### 3.1 Lease Status

**Field:** `lease_status`

**Options:**

- Active
- Month-to-Month
- Signed, Not Started
- Renewal Pending
- Expired (Not Renewed)
- Draft
- Terminated Early

---

### 3.2 Lease Expiration

**Field:** `lease_end_date`

**Options:**

- Expiring in 7 days
- Expiring in 30 days
- Expiring in 60 days
- Expiring in 90 days
- Already Expired
- Custom Date Range

---

### 3.3 Move Dates

**Fields:**

- `move_in_date`
- `move_out_date`

**Options:**

- Past
- Upcoming
- Scheduled
- Not Set
- Custom Date Range

---

## 4. Property & Unit Filters

### 4.1 Property

**Field:** `property_id`

**Options:**

- Multi-select property list

---

### 4.2 Unit Details

**Fields:**

- `unit_number`
- `unit_type`
- `floor` (optional / enterprise)

**Unit Type Options:**

- Studio
- 1BR
- 2BR
- 3BR+

---

## 5. Maintenance-Related Filters

### 5.1 Maintenance Activity

**Field:** `maintenance_status`

**Options:**

- Has Open Tickets
- Has Urgent Tickets
- Has Repeated Issues
- No Maintenance History

---

### 5.2 Last Maintenance Request

**Field:** `last_maintenance_at`

**Options:**

- Last 7 days
- Last 30 days
- Last 90 days
- Never

---

## 6. Payment & Behavior Filters

### 6.1 Payment Method

**Field:** `payment_method`

**Options:**

- ACH
- Credit Card
- Debit Card
- Check
- Cash
- Not Set

---

### 6.2 Autopay

**Field:** `autopay_enabled`

**Options:**

- Enabled
- Disabled

---

### 6.3 Payment Reliability (Derived)

**Field:** `payment_reliability`

**Options:**

- Consistently On-Time
- Occasionally Late
- Frequently Late
- New Tenant (No History)

---

## 7. Communication & Engagement Filters

### 7.1 Communication Status

**Field:** `communication_status`

**Options:**

- Unread Messages
- Unresponsive
- Recently Contacted
- Never Contacted

---

### 7.2 Portal Access

**Field:** `portal_status`

**Options:**

- Invited
- Accepted
- Never Logged In
- Disabled

---

## 8. Compliance & Risk Filters (Advanced)

### 8.1 Documents & Compliance

**Field:** `document_status`

**Options:**

- Missing Required Documents
- Lease Signed
- ID On File
- Insurance On File

---

### 8.2 Internal Flags / Labels

**Field:** `internal_tags`

**Options:**

- High Risk
- VIP
- Legal Review
- Manual Review Required
- Custom Admin Tags

---

## 9. Meta Filters

### 9.1 Tenant Type

**Field:** `tenant_type`

**Options:**

- Individual
- Co-Tenants
- Corporate / Company Lease

---

### 9.2 Tenant Created Date

**Field:** `created_at`

**Options:**

- Added in last 7 days
- Added in last 30 days
- Custom Date Range

---

## Saved Filter Presets

### System Defaults

- **Overdue Tenants**
  - Rent Status: Overdue
- **Leases Expiring Soon**
  - Lease Expiration ≤ 30 days
- **High Risk Tenants**
  - Frequently Late
  - Balance ≥ $1,000
- **Maintenance Attention Needed**
  - Has Open or Urgent Tickets

### User-Defined

- Create / Edit / Delete
- Persist per user account
- Shareable (future)

---

## API & Data Notes

- Filters must support **compound AND logic**
- Numeric and date filters must support ranges
- Derived fields (e.g., payment reliability) should be precomputed nightly
- Filters must be URL-serializable for deep linking
- Saved presets stored per-user with optional org defaults

---

## Performance Considerations

- Indexed fields:
  - tenant_status
  - rent_status
  - lease_end_date
  - balance_amount
  - property_id
- Debounced search + filter application
- Pagination-aware filtering

---

## Success Criteria

- Admin can identify overdue tenants in <5 seconds
- Portfolio-wide risk is visible without reports
- Filters scale to 10,000+ tenants
- Zero ambiguity between financial, lease, and operational states

---

**Status:** Ready for design + backend implementation
