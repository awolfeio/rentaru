# Maintenance Ticket Creation – Implementation Plan

## Goal

Provide a fast, low-friction way to create maintenance tickets for tenants, managers, and admins, while supporting advanced operational workflows for larger portfolios.

**Core principle:** Modal-first for speed, full-page for depth.

---

## Entry Point

### Primary CTA

- Button: `+ New Ticket`
- Location: Maintenance list header
- Keyboard shortcut: `N`

### Behavior

- Opens **Create Maintenance Ticket Modal**
- Role-aware defaults (Tenant vs Manager/Admin)
- Context preserved (does not navigate away)

---

## Ticket Creation Modes

### 1. Modal (Default)

Used for ~80–90% of tickets.

**Why**

- Fast creation
- Minimal cognitive load
- Keeps users in workflow

**Specs**

- Desktop: 720–840px width
- Mobile: full-height bottom sheet
- Autosave draft

---

### 2. Full Page (Advanced)

Used when ticket complexity exceeds modal scope.

**Triggered by**

- “Open full ticket view” link
- Complex vendor coordination
- Budget approvals
- Capital repairs

---

## Modal UI Structure

### Header

- Title: `Create Maintenance Ticket`
- Context badge: Tenant / Manager / Admin
- Close (×)
  - Warn on unsaved changes

---

## Section 1 — Location & Scope (Required)

Fields:

- **Property\*** (searchable select)
- **Unit\*** (filtered by property)
- **Area** (optional)
  - Kitchen
  - Bathroom
  - HVAC
  - Exterior
  - Appliance
  - Common Area

Behavior:

- Tenants see only their assigned unit
- Selecting “Common Area” disables Unit field

---

## Section 2 — Issue Details (Required)

Fields:

- **Issue Title\*** (short text)
- **Category\*** (select)
  - Plumbing
  - HVAC
  - Electrical
  - Appliance
  - General
- **Description\*** (multiline)

Enhancements:

- Placeholder examples
- Category used for vendor auto-suggestions

---

## Section 3 — Severity & Access

Fields:

- **Priority\***
  - Routine
  - Urgent
  - Emergency
- **Access Permission**
  - `☑ Permission to enter without tenant present`
- **Preferred Time Window**
  - Morning
  - Afternoon
  - Evening
  - Anytime

Rules:

- Emergency selection shows confirmation warning
- Emergency tickets may bypass approval flows (configurable)

---

## Section 4 — Attachments

Fields:

- Add Photos / Videos
  - Drag & drop
  - Camera-first on mobile
  - 1–10 files

UI:

- Inline thumbnails
- Remove before submit

---

## Section 5 — Assignment (Role-Based)

### Tenant

- Assignment hidden or read-only

### Manager / Admin

Fields:

- **Assign Vendor** (search existing or create new)
- **Estimated Cost**
- **Notify Vendor** (checkbox)

Smart Defaults:

- Category → preferred vendor
- Vendor SLA badge displayed if available

---

## Modal Footer Actions

Primary:

- **Create Ticket**

Secondary (Manager/Admin):

- **Create & Assign**

Tertiary:

- Cancel

Utility:

- Link: `Open full ticket view`

---

## Full Page Creation (Advanced Mode)

### Additional Sections

#### A. Approval & Budgeting

- Requires Owner Approval (toggle)
- Approval Threshold ($)

#### B. Scheduling

- Calendar date picker
- Vendor availability windows

#### C. Notifications

- Notify Tenant
- Notify Property Manager
- Notify Vendor
- Notify Owner

#### D. Internal Notes

- Private (staff only)
- Logged in audit trail

---

## Post-Creation Behavior

- Optimistic UI update
- Success toast: “Ticket created”
- Ticket appears immediately in list
- Optional auto-open ticket detail

---

## UX Guardrails

- Autosave drafts
- Inline validation
- Emergency confirmation modal
- Role-based field visibility
- SLA expectations visible to tenants
- No dead-end states

---

## Data Model Coverage

This flow supports:

- Multi-property organizations
- Tenant-submitted tickets
- Manager/Admin-created tickets
- System-generated tickets
- Vendor assignment & SLA tracking
- Cost estimation & approvals
- Audit logging & compliance
- Scale from 1 unit to enterprise portfolios

---

## Final Recommendation

Implement **both creation modes**:

- **Modal-first** for speed and adoption
- **Full-page escalation** for operational depth

This balances small-landlord simplicity with enterprise-grade capability.
