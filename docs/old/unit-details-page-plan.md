# Unit Details Page — Implementation Plan

## Purpose

The **Unit Details Page** is the deepest operational view in the product hierarchy:
**Property → Unit → Tenant / Lease / Maintenance**.

It is the primary workspace for property managers and staff to:

- Understand the real-time state of a single unit
- Manage tenant, lease, rent, and maintenance
- View historical and audit-grade activity

This page must work cleanly for:

- Occupied units
- Vacant units
- Units under maintenance or renovation

---

## Page Hierarchy & Navigation

**Breadcrumb**
Properties → {Property Name} → Unit {Unit Number}

markdown
Copy code

**Back Action**

- Back to Property Detail Page (preserve filters & scroll)

---

## 1. Header / Context Bar

### Left

- Back to Property
- **Unit Identifier**
  - Unit Number (e.g. Unit 103)
  - Unit Type (Studio / 1BR / 2BR)
  - Optional metadata:
    - Floor
    - Building / Stack

### Right (Primary Actions)

- Collect Rent / Send Reminder (contextual)
- Create Maintenance Ticket
- Edit Unit
- Overflow Menu (⋮)
  - Archive Unit
  - Mark Offline / Renovation
  - Transfer Tenant
  - View Audit Log

---

## 2. Unit Status Summary (KPI Cards)

Compact summary cards, consistent with Property-level metrics.

### Cards

- **Occupancy**
  - Occupied / Vacant / Maintenance
- **Rent**
  - Monthly Rent
  - Prorated indicator (if applicable)
- **Balance**
  - Current Balance
  - Overdue Amount (if any)
- **Lease Status**
  - Active
  - Ending Soon
  - Month-to-Month
- **Maintenance**
  - Open Ticket Count
  - Urgent Flag

---

## 3. Unit Overview Panel

### Static Unit Attributes

**Left Column**

- Unit Number
- Square Footage
- Bedrooms / Bathrooms
- Floor
- Parking Included (Y/N)
- Storage Included (Y/N)
- Furnished (Y/N)

**Right Column**

- Market Rent
- Current Rent
- Rent History (modal)
- Internal Unit Notes

---

## 4. Tenant Section (Conditional)

### If Unit is Occupied

**Tenant Card**

- Tenant Name
- Contact Information
- Emergency Contact
- Move-in Date
- Lease End Date
- Auto-pay Enabled (Y/N)
- Payment Method (masked)

**Tenant Actions**

- Message Tenant
- View Tenant Profile
- Send Rent Reminder
- Start Renewal
- End Tenancy

---

### If Unit is Vacant

- Last Tenant
- Last Rent Amount
- Vacancy Duration

**Primary CTAs**

- Assign Tenant
- Create Lease

---

## 5. Lease & Financials (Tabbed Section)

### Tabs

- Lease
- Financials

---

### Lease Tab

- Lease Document (PDF viewer)
- Lease Start / End Dates
- Rent Amount
- Late Fee Rules
- Security Deposit
- Special Clauses
- Renewal History

---

### Financials Tab

- Rent Ledger (chronological)
- Charges & Credits
- Late Fees
- Payments Received
- Export CSV
- Generate Unit Statement

---

## 6. Maintenance & Work Orders

### Table or Timeline View

- Ticket ID
- Category
- Priority
- Status
- Assigned Vendor
- Created Date

### Actions

- Create Ticket (unit-scoped)
- Escalate
- Close Ticket
- Attach Photos / Invoices

---

## 7. Documents & Media

### Unit-Scoped Files

- Move-in Inspection
- Move-out Inspection
- Floor Plans
- Appliance Manuals
- Renovation Receipts

**Upload Support**

- Images
- PDFs
- Videos

---

## 8. Activity Timeline (Audit Log)

Chronological, immutable history of unit activity.

### Event Types

- Rent Paid
- Lease Signed
- Lease Renewed
- Ticket Created / Closed
- Rent Changed
- Status Changed
- Notes Added

### Filters

- Financial
- Maintenance
- Lease
- Admin

---

## 9. Notes & Internal Communication

- Internal-only notes
- Tags (e.g. `high-risk`, `plumbing`)
- Mentions (`@admin`, `@maintenance`)

---

## 10. Permissions & Role Awareness

### Role-Based Visibility

- **Owner / Admin**
  - Full access
- **Property Staff**
  - Limited financial visibility
- **Maintenance**
  - Read-only unit info + tickets
- **Tenant (future)**
  - Read-only unit details

---

## 11. Tabs & Default Behavior

### Tab Order

1. Overview
2. Tenant
3. Lease
4. Financials
5. Maintenance
6. Documents
7. Activity

### Default Tab Logic

- Occupied → Overview
- Vacant → Overview (with Vacancy CTAs)
- Maintenance → Maintenance tab auto-highlighted

---

## 12. Empty & Edge States

### Scenarios

- No tenant assigned
- No active lease
- Unit under renovation
- Archived / historical unit

### Rules

- Never show dead UI
- Each empty state must include a single clear CTA

---

## Design & UX Principles

- Mirrors real-world landlord workflows
- Clear separation of Unit vs Tenant vs Lease
- Scales from single-unit landlords to large portfolios
- Keeps Property page high-level, Unit page actionable
- Future-proof for tenant-facing access

---

## Related Pages

- Property Detail Page
- Tenant Detail Page
- Lease Detail Page
- Maintenance Ticket Page
- Financial Reports
