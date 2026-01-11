# org-user-page-plan.md

## Purpose

The **Organization User Profile Page** represents internal users of a property management organization (admins, owners, managers, maintenance, front office).  
It provides a clear, auditable view of **identity, access, activity, and security**, and serves as the primary management surface for internal accounts.

This page is **not** tenant-facing.

---

## Route

/organization/users/:userId

yaml
Copy code

---

## Primary Goals

- Clearly identify who the user is
- Show exactly what they can access (effective permissions)
- Provide audit-level visibility into their actions
- Allow safe lifecycle management (invite → active → suspended → removed)

---

## Page Layout Overview

### Header Section (Identity + State)

**Left**

- Avatar
- Full name
- Email (secondary)
- Optional internal title / label

**Right (Primary Actions)**

- Edit Roles & Access
- Suspend / Reactivate User
- Remove from Organization (danger, confirmation gated)

**Status Indicators**

- Account Status: Active / Invited / Suspended
- MFA Status: Enabled / Not Enabled
- Last Active (human-readable timestamp)

---

## Tab Navigation

Default to **Overview**

Tabs:

1. Overview
2. Roles & Access
3. Property Access
4. Activity
5. Security

---

## Tab: Overview

### User Summary Card

- Primary Role(s)
- Access Scope
  - All Properties
  - X Properties
  - Property Groups
- Account Created Date
- Last Login
- Login Methods
  - Password
  - Passkey
  - SSO Provider (if applicable)

### Security Snapshot

- MFA Enabled (yes/no)
- Password Last Reset
- Failed Login Attempts (last 30 days)
- Active Sessions (count + revoke all)

---

## Tab: Roles & Access

### Roles

- Admin
- Owner
- Property Manager
- Maintenance
- Front Office / Leasing
- Custom Roles (future)

### Effective Permissions (Read-only by default)

Grouped by domain:

- Properties
- Units
- Tenants
- Payments & Payouts
- Maintenance Tickets
- Documents & Leases
- Reports
- System Settings
- Users & Roles

> Display **effective permissions**, not raw role names only.

### Edit Flow

- Opens `Edit Roles & Access` modal
- Role selection
- Permission overrides (if supported)
- Confirmation before save

---

## Tab: Property Access

### Access Scope Visualization

- Table or list of properties:
  - Property Name
  - Assigned Role
  - Access Level (Read / Write / Admin)

### Controls

- Add / Remove Property Access
- Assign Property Groups (if supported)
- Bulk updates for large orgs

---

## Tab: Activity

### Activity Log (User-Scoped)

Examples:

- Login events
- Lease created / edited
- Tenant status changes
- Maintenance ticket updates
- Payments issued or adjusted
- Permission changes

### Filters

- Date range
- Action type
- Property

Purpose:

- Audit trail
- Accountability
- Trust & transparency

---

## Tab: Security

### Authentication Methods

- Email
- Registered Passkeys
- SSO Provider (if applicable)

### Security Actions

- Reset Password
- Force Logout All Sessions
- Require Password Reset on Next Login
- Re-send Invite (Invited users)

### Compliance (Future-Proof)

- IP Allowlist
- Time-based access (shift control)
- Trusted devices

---

## Edge States

### Invited User

- Banner: “Invite pending”
- Resend Invite
- Edit role & access before acceptance
- Cancel Invite

### Suspended User

- Read-only profile
- Suspension banner
- Reactivate CTA
- Activity frozen

### Owner / Super Admin

- Restricted destructive actions
- Strong confirmation modals
- Owner badge / indicator

---

## Design Principles

- Professional, neutral tone
- Clear separation of identity, access, and activity
- Strong visual hierarchy for risk actions
- Audit-ready by default
- Scales from small landlords to enterprise orgs

---

## Future Enhancements

- Custom roles builder
- Property group management
- Session-level device management
- Advanced audit exports
- Enterprise compliance controls

---
