# users-and-permissions-plan.md

## Purpose

Define a scalable, role-based user and permissions system that supports:

- Small landlords (1–15 units)
- Large property management organizations
- Internal staff, vendors, and tenants
- Secure, auditable access control

This document defines **who users are**, **how they are created**, **what they can do**, and **where permissions are managed**.

---

## Core Principles

- **RBAC-first** (Role-Based Access Control)
- **Organization-scoped**, not account-type–scoped
- **Multi-role per user**
- **Property- and unit-level scoping**
- **No hard-coded account types**
- **Audit-safe (no hard deletes)**

---

## Top-Level Model

### Organization

The highest-level container. All users (except unaffiliated applicants) belong to an Organization.

Organization
├── Properties
├── Units
├── Users
├── Roles & Permissions
├── Billing
└── Audit Log

---

## User Types (Conceptual, Not Hard-Coded)

These are **role templates**, not account types.

### Tenant

- Created via lease onboarding
- Limited to their own unit
- Cannot access Organization → Users

### Property Manager / Admin

- Highest privilege
- Manages users, properties, leases, tickets, finances

### Owner / Landlord

- Portfolio visibility
- Revenue & reporting access
- Optional operational permissions

### Maintenance (Internal or Vendor)

- Ticket-based access only
- Property-scoped
- No financial access

### Optional (Phase 2+)

- Accounting / Finance
- Leasing Agent
- Regional / Portfolio Admin

---

## Organization → Users Page (Canonical Management Location)

**Path**
Organization → Users

yaml
Copy code

This is the **only place** admins manage non-tenant users.

---

## Users Page – Core Capabilities (MVP)

### 1. Users List

Displays:

- Name
- Email
- Status (Invited / Active / Suspended)
- Role(s)
- Property Scope
- Last Active

---

### 2. Invite User Flow (Primary CTA)

**Invite User**

- Email address
- Role(s)
- Property scope
- Optional invite expiration

Tenants are **not** invited here.

---

### 3. Role Assignment

- Users may have multiple roles
- Roles map to permission sets
- Roles are organization-specific

Example:
User: Jane Doe
Roles: Maintenance
Properties: Building A, Building C

yaml
Copy code

---

### 4. Property & Unit Scoping (Critical)

Scopes control **where permissions apply**, not just **what permissions exist**.

Scope types:

- All Properties
- Selected Properties
- Selected Units (maintenance edge cases)

---

### 5. User Actions

Per-user:

- Edit roles
- Edit scope
- Resend invite
- Suspend / Reactivate
- Remove from organization

> Users are never hard-deleted.

---

## Roles vs Permissions

### Role

A named collection of permissions.

Examples:

- Admin
- Maintenance
- Owner
- Accounting

### Permission

Atomic capability.

Examples:

- submit_ticket
- assign_ticket
- close_ticket
- view_financials
- manage_leases
- manage_users

---

## Permission Matrix (MVP)

| Permission           | Tenant   | Maintenance   | Owner | Admin |
| -------------------- | -------- | ------------- | ----- | ----- |
| submit_ticket        | ✅       | ❌            | ❌    | ❌    |
| view_ticket          | ✅ (own) | ✅ (assigned) | ✅    | ✅    |
| update_ticket_status | ❌       | ✅            | ❌    | ✅    |
| assign_ticket        | ❌       | ❌            | ❌    | ✅    |
| view_financials      | ❌       | ❌            | ✅    | ✅    |
| manage_leases        | ❌       | ❌            | ❌    | ✅    |
| manage_users         | ❌       | ❌            | ❌    | ✅    |

---

## Maintenance Ticket Access Rules

- Maintenance users:
  - See only assigned tickets
  - See only scoped properties
  - Cannot view unrelated tenant data
- Status updates allowed:
  - In Progress
  - Waiting
  - Completed
- Admin approval optional (configurable)

---

## Tenant Creation & Access Model

Tenants are created via:
Lease → Invite Tenant

yaml
Copy code

Tenant access is automatically scoped to:

- Their unit
- Their lease documents
- Their payment history
- Their maintenance tickets

Tenants never appear in Organization → Users.

---

## Data Model (Recommended)

```ts
Organization {
  id
  name
}

User {
  id
  email
  status
}

Membership {
  user_id
  organization_id
  roles[]
  property_scope[]
  unit_scope[]
}

Role {
  id
  name
  permissions[]
}

Permission {
  key
  description
}
Security & Audit Requirements
All permission changes logged

Invite acceptance timestamped

Ticket actions attributed to user

User removal preserves history

UX & IA Notes
Users page is Organization-level, not buried in Settings

Role selection uses human-readable templates

Advanced permission editing hidden by default

Property scope selector required for non-admin roles

Minimum Roles to Launch
Role	Required
Tenant	✅
Admin / Property Manager	✅
Maintenance	✅
Owner	⚠️ (can be merged initially)

Phase 2 Enhancements
Custom role builder

Vendor organizations

Cross-org user accounts

SSO / SCIM

Permission presets per pricing tier

Summary
This users and permissions system:

Scales cleanly from 1 unit to 10,000+

Avoids role explosion

Supports vendors securely

Aligns with industry-standard SaaS RBAC

Keeps UX simple while preserving power

This is a foundational system and should be implemented early.

```
