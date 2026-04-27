# Maintenance Page Plan

> **Purpose:** Define a scalable, ticket‑driven Maintenance page that gives landlords and property managers immediate visibility into what’s broken, what’s urgent, and what’s costing money—without turning maintenance into a vendor CRM or accounting system.

---

## Core Principles

- Maintenance is an **operational workflow**, not a message board
- Optimized for **urgency, status, and resolution speed**
- Tickets are first‑class objects with lifecycle states
- Progressive density from 1 ticket → enterprise volumes
- Inline actions over multi‑page flows

---

## Mental Model

> _“What’s broken, how bad is it, who’s handling it, and what needs to happen next?”_

---

## Page Layout Overview

```
┌───────────────────────────────────────────────┐
│ Maintenance Header + Controls                 │
├───────────────────────────────────────────────┤
│ Maintenance Queue (Primary Surface)           │
│  ├─ Ticket Row                                │
│  │   ├─ Urgency & Status                      │
│  │   ├─ Property / Unit Context               │
│  │   ├─ Cost & Vendor Snapshot                │
│  │   └─ Expand → Ticket Details               │
│  └─ …                                         │
└───────────────────────────────────────────────┘
```

---

## 1. Maintenance Header

### Left: Page Identity

- **Title:** `Maintenance`
- **Subtitle:** `All open and historical maintenance requests`

---

### Right: Primary Controls

- `+ New Ticket`
- Search (issue, unit, tenant)
- Filters:

  - Status (open / in progress / waiting / resolved)
  - Urgency (routine / urgent / emergency)
  - Property
  - Vendor assigned / unassigned

**Rules**

- Defaults to open tickets
- Filters persist per user

---

## 2. Maintenance Queue (Primary Surface)

### Default View: Ticket Rows

Each maintenance request appears as a **single dense ticket row**, optimized for triage and action.

---

### Ticket Row Columns

| Column          | Purpose            |
| --------------- | ------------------ |
| Issue           | Short description  |
| Property / Unit | Physical context   |
| Reported By     | Tenant / manager   |
| Urgency         | Severity indicator |
| Status          | Workflow state     |
| Vendor          | Assigned party     |
| Cost            | Estimated / actual |
| Flags           | Risk indicators    |
| Expand          | Inline drilldown   |

---

### Example Ticket Row

```
Water leak under sink
Unit 3B · Oak Street Apts

Reported by Tenant | Urgent | In Progress | Plumber Co | $350 est | ⚠️
```

---

### Visual Rules

- Neutral rows by default
- Urgency controls color emphasis
- Icons over labels for speed
- Consistent row height

---

## 3. Urgency & Status Indicators

### Urgency Levels

- Routine
- Urgent
- Emergency

### Status States

- Open
- In Progress
- Waiting (tenant / vendor)
- Resolved
- Closed

Only **Urgent** and **Emergency** trigger strong visual emphasis.

---

## 4. Expand → Ticket Inline Detail

### Interaction

- Click caret / row
- Expands inline beneath ticket row
- No route change

---

### Inline Detail Sections

#### A. Issue Details

- Full description
- Photos / attachments
- Reported date

---

#### B. Assignment & Vendor

- Assigned vendor
- Contact info
- Work order reference

---

#### C. Cost Tracking

- Estimated cost
- Actual cost (if complete)
- Owner approval state (optional)

---

#### D. Activity Timeline

- Status changes
- Notes
- Tenant / vendor updates

---

#### E. Quick Actions

- Assign vendor
- Change status
- Add note
- Mark resolved

---

## 5. Ticket Row Actions

### Primary Actions (Inline)

- Assign vendor
- Update status

---

### Secondary Actions (Overflow Menu)

- Edit ticket
- Upload attachment
- Cancel ticket
- Archive ticket

---

## 6. Scaling Behavior

### Small Landlords (1–10 Tickets)

- More text labels
- Auto-expanded details optional
- Minimal reliance on filters

---

### Mid-Size Portfolios (25–250 Tickets)

- Compact rows
- Icon-driven urgency
- Filters and sorting essential

---

### Enterprise (1,000+ Tickets)

- Virtualized list
- Bulk status updates
- SLA-based sorting default

---

## 7. Empty States

### No Maintenance Requests

- Simple confirmation state
- No celebratory UI

---

### All Tickets Resolved

- Muted success state
- No charts or gamification

---

## 8. Accessibility & Performance

- Keyboard navigable ticket rows
- Screen-reader friendly urgency labels
- Virtualized lists for large datasets
- No blocking animations

---

## 9. Data Model (Simplified)

```ts
MaintenanceTicket {
  id
  title
  description
  propertyName
  unitNumber
  reportedBy
  urgency
  status
  vendorName?
  estimatedCost?
  actualCost?
  createdAt
}
```

---

## What Is Explicitly Excluded

- ❌ Vendor CRM
- ❌ Accounting reports
- ❌ Messaging inbox replacement
- ❌ Asset depreciation tracking

---

## One-Line Definition

> **The Maintenance page is a real‑time triage board—not a backlog archive.**

---

_End of maintenance-page-plan.md_
