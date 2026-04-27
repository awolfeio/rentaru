# system-user-actions-implementation-plan.md

## Purpose

Define the full set of **ellipsis (⋯) actions** available on **System → Users**, including:

- Context-aware action visibility
- Status-based behavior
- Role-based safeguards
- Audit logging requirements

This document specifies **what actions exist**, **when they appear**, and **how they behave**, so engineering and design implement consistently.

---

## Core Principles

- **RBAC-driven** (no hard-coded logic)
- **Context-aware rendering** (hide, don’t disable)
- **Audit-safe** (no hard deletes without logging)
- **Least-privilege by default**
- **Enterprise-safe edge cases handled**

---

## Scope

Applies to:
System → Users → User Row → Ellipsis Actions (⋯)

yaml
Copy code

Applies to:

- Admin-created users
- Maintenance users
- Owners
- Invited users

Does **not** apply to:

- Tenants (managed via Leases)
- Applicants
- External vendor organizations (Phase 2+)

---

## Universal Actions (Baseline)

Available for all non-tenant users unless restricted.

### View Profile

- Read-only view
- Shows:
  - Name, email
  - Roles
  - Property / unit scope
  - Status
  - Last active
- No edits allowed here

---

### Edit Roles & Access

- Change:
  - Roles
  - Property scope
  - Unit scope (if applicable)
- Permission-gated:
  - Admin only
- Logged to audit trail

---

### View Activity

- Lightweight activity feed
- Includes:
  - Login timestamps
  - Ticket actions
  - Financial actions (if applicable)
- Read-only

---

## Status-Based Action Sets

### Active Users

Available actions:

- **View Profile**
- **Edit Roles & Access**
- **View Activity**
- **Suspend User**
- **Reset Password**
- **Remove From Organization** (guarded)

#### Suspend User

- Immediately revokes access
- User remains in system
- Reversible
- Logged as `user.suspended`

---

#### Reset Password

- Sends reset email
- No password visibility
- Logged as `user.password_reset_sent`

---

### Invited Users

Available actions:

- **Edit Invite**
- **Resend Invite**
- **Cancel Invite**

#### Edit Invite

- Modify:
  - Role(s)
  - Scope
- Does not re-send email automatically

---

#### Resend Invite

- Re-sends invite email
- Preserves token or regenerates (implementation choice)
- Logged as `user.invite_resent`

---

#### Cancel Invite

- Invalidates invite token
- User never becomes active
- Logged as `user.invite_canceled`

---

### Suspended Users

Available actions:

- **View Profile**
- **Edit Roles & Access**
- **Reactivate User**
- **Remove From Organization**

#### Reactivate User

- Restores previous access
- Logged as `user.reactivated`

---

## Role-Sensitive Actions

### Maintenance Users

Additional action:

- **View Assigned Tickets**
  - Navigates to filtered Maintenance view

Admin-only additional action:

- **Reassign Tickets**
  - Bulk or single reassignment
  - Required before removal if tickets are open

Restrictions:

- No financial access
- No user management access unless role changed

---

### Owner Users

Additional actions:

- **View Portfolio Access**
  - Read-only property scope view

Admin-only:

- **Convert to Manager**
  - Changes role template
  - Requires confirmation

Restrictions:

- Cannot remove **Primary Owner**
- Ownership must be transferred first

---

### Admin Users

Safeguards apply.

Allowed (if another Admin exists):

- **Remove Admin Role**
- **Suspend User**
- **Remove From Organization**

Restricted:

- Cannot suspend last remaining Admin
- Cannot remove last remaining Admin
- Cannot remove self via ellipsis

---

## Destructive / Guarded Actions

These actions:

- Appear at bottom of menu
- Require confirmation modal
- Logged to audit trail

### Remove From Organization

- Revokes all access
- Preserves historical data
- Hard delete not allowed
- Logged as `user.removed`

Blocked if:

- User is last Admin
- User is Primary Owner (without transfer)

---

## Example Ellipsis Menus

### Active Maintenance User

View Profile
Edit Roles & Access
View Assigned Tickets
────────────
Suspend User
Remove From Organization

yaml
Copy code

---

### Invited User

Edit Invite
Resend Invite
Cancel Invite

yaml
Copy code

---

### Suspended User

View Profile
Edit Roles & Access
Reactivate User
Remove From Organization

yaml
Copy code

---

## Rendering Rules (Critical)

- Actions are **hidden**, not disabled
- Menu content is computed at render time based on:
  - Current user permissions
  - Target user role(s)
  - Target user status
- Max ~6 visible actions per menu
- Destructive actions visually separated

---

## Audit Log Events

All actions must emit structured audit events:

- `user.invited`
- `user.invite_edited`
- `user.invite_resent`
- `user.invite_canceled`
- `user.role_changed`
- `user.scope_changed`
- `user.suspended`
- `user.reactivated`
- `user.password_reset_sent`
- `user.removed`

Each event records:

- Actor user ID
- Target user ID
- Timestamp
- Org ID
- Metadata (roles, scope, reason if provided)

---

## Non-Goals (Explicit)

- No bulk actions in v1
- No tenant actions here
- No hard deletes
- No permission editing via ellipsis (handled elsewhere)

---

## Summary

This ellipsis action system:

- Scales from small landlords to enterprise orgs
- Prevents catastrophic admin lockouts
- Supports vendors and maintenance safely
- Preserves auditability and compliance
- Keeps UI clean and predictable

This plan should be implemented alongside the Users page and Audit Log.
