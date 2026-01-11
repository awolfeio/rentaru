# tenant-profile-page-plan.md

## Purpose

The Tenant Profile Page is the system of record for an individual renter across time.  
It represents the **person**, not a single lease, and aggregates identity, occupancy, financials, maintenance, communication, and history into one authoritative view.

This page must support:

- Active tenants
- Past tenants
- Future / pending tenants
- Multiple leases over time
- Staff, accounting, and maintenance role access

---

## Core UX Principles

- Tenant = Person, not lease
- Financial truth lives in a ledger (never inferred)
- Status is always visible
- History is immutable (archived, never deleted)
- High-frequency actions are always accessible
- Clear separation between internal-only and tenant-visible data

---

## Page Layout Overview

Tenant Profile
├─ Header (Identity + Status)
├─ Sticky Action Bar
├─ Overview Summary
├─ Tabbed Content
│ ├─ Leases & Units
│ ├─ Payments & Ledger
│ ├─ Maintenance
│ ├─ Documents
│ ├─ Messages
│ ├─ Household
│ ├─ Notes & Flags (Internal)
│ └─ Activity Log

markdown
Copy code

---

## 1. Header Section (Persistent)

### UI Elements

- Avatar / Initials
- Full Name
- Primary Email
- Phone Number
- Status Chips:
  - Tenant Status: Active | Past | Future
  - Lease Status: Active | Expired | Pending
  - Payment Status: Paid | Partial | Overdue
- Badges:
  - VIP
  - Legal Hold
  - Eviction Risk
  - Former Tenant

### Primary Actions

- Message Tenant
- Record Payment
- Create Maintenance Ticket
- More Actions (⋯)

### Data Model

```ts
Tenant {
  id
  firstName
  lastName
  avatarUrl
  email
  phone
  status        // active | past | future
  tags[]        // vip, legal_hold, etc
  createdAt
}
2. Sticky Action Bar
Purpose
Keep high-frequency actions accessible while scrolling.

Actions
Message Tenant

Record Payment

Add Internal Note

Upload Document

Create Maintenance Ticket

3. Overview Summary Section
UI Cards
Current Property & Unit

Current Lease Status

Outstanding Balance

Next Rent Due Date

Active Maintenance Requests

Data Model
ts
Copy code
TenantSummary {
  currentPropertyId
  currentUnitId
  leaseStatus
  balance
  nextDueDate
  openTicketsCount
}
4. Leases & Units Tab
UI
Expandable timeline of leases

Property name

Unit identifier

Lease start & end dates

Rent amount

Security deposit

Lease status

View Lease action

Capabilities
Multiple historical leases

Unit transfers

Renewals

Pending leases

Data Model
ts
Copy code
Lease {
  id
  propertyId
  unitId
  startDate
  endDate
  rentAmount
  depositAmount
  status        // active | expired | terminated | pending
  signedAt
  documents[]
}
5. Payments & Ledger Tab
UI
Balance summary

Auto-pay status

Stored payment methods

Ledger table:

Date

Entry type

Amount

Status

Reference

Actions
Record payment

Apply credit

Add fee

Export ledger

Data Models
ts
Copy code
LedgerEntry {
  id
  date
  type        // rent | fee | credit | payment
  amount
  method
  status
  reference
}
ts
Copy code
PaymentProfile {
  autoPayEnabled
  methods[]   // ACH, Card
}
6. Maintenance Tab
UI
Highlighted active requests

Collapsed resolved requests

Priority indicators

Last update timestamps

Actions
Create ticket (on behalf of tenant)

Assign vendor

Update priority or status

Data Model
ts
Copy code
MaintenanceTicket {
  id
  status        // open | in_progress | resolved
  priority      // low | medium | high | emergency
  category
  createdAt
  resolvedAt
}
7. Documents Tab
UI
Grouped by category:

Lease Agreements

Amendments

Notices

ID / Verification

Miscellaneous

Features
E-signature status

Version history

Upload new documents

Data Model
ts
Copy code
Document {
  id
  type
  filename
  signed
  uploadedAt
  relatedLeaseId
}
8. Messages Tab
UI
Threaded conversation view

System vs manual message distinction

Read receipts

Attachments

Data Model
ts
Copy code
Message {
  id
  senderType     // system | tenant | admin
  body
  attachments[]
  createdAt
  read
}
9. Household Tab
Purpose
Represent non-primary occupants and emergency contacts.

UI
Co-tenants

Occupants

Emergency contacts

Data Model
ts
Copy code
HouseholdMember {
  id
  name
  role          // co-tenant | occupant | emergency
  contactInfo
}
10. Notes & Flags Tab (Internal Only)
UI
Timestamped internal notes

Pinned warnings

Author attribution

Use Cases
Behavioral notes

Legal context

Payment arrangements

Data Model
ts
Copy code
InternalNote {
  id
  body
  createdBy
  createdAt
  pinned
}
11. Activity Log Tab
Purpose
Immutable audit trail of tenant-related events.

UI
Chronological event list

Actor attribution

Event type labeling

Data Model
ts
Copy code
ActivityEvent {
  id
  type
  description
  actor
  timestamp
}
12. Permissions & Visibility Rules
Role	Access Scope
Tenant	Payments, documents, maintenance, messages
Admin	Full access
Accounting	Payments & ledger only
Maintenance	Maintenance + contact info

Non-Goals
No destructive deletes (archive only)

No lease-specific logic in tenant identity

No financial calculations outside ledger

Success Criteria
One tenant profile supports unlimited leases

Financial data is auditable and exportable

High-frequency actions are reachable in <1 click

Clear separation between internal vs tenant-visible data

Scales from 1 unit landlord to enterprise portfolios
```
