# Notifications Settings – Product Specification

## Overview

The Notifications Settings system allows users and organizations to control **what events generate notifications**, **how they are delivered**, **who receives them**, and **when**.  
It is designed to scale from single-landlord usage to enterprise property-management teams while preventing notification fatigue.

---

## Goals

- High signal, low noise
- Role-aware defaults with user overrides
- Clear separation of **event**, **priority**, **channel**, and **scope**
- Enterprise-ready auditability and control

---

## Access & Permissions

- **All users**: Manage personal notification preferences (within allowed bounds)
- **Admins / Owners**: Configure organization defaults, mandatory notifications, limits

---

## Navigation

**Settings → Notifications**

Tabs:

1. General
2. Categories
3. Channels
4. Roles & Defaults
5. Schedule
6. History

---

## 1. General Settings

### Global Toggles

- Enable / disable notifications (soft off; mandatory notifications still apply)
- Mark notifications as read when opened
- Auto-open related record on click

### Severity Handling

Severity levels:

- Informational
- Action Required
- Urgent / Emergency

Each severity can map to different channels.

---

## 2. Notification Categories

Each category supports:

- Enable / disable
- Channel selection
- Severity override
- Scope selection (see Section 6)

### Payments & Accounting

- Rent payment received
- Rent payment failed
- Partial payment
- Late fee applied
- Refund issued
- Payout sent
- Bank connection issue
- Reconciliation mismatch

### Maintenance

- New maintenance request
- Priority change
- Vendor assigned
- Work completed
- Tenant follow-up message
- SLA breach
- Emergency flagged (water, gas, fire)

### Leases & Documents

- Lease expiring (configurable days)
- Lease signed
- Renewal started
- Renewal completed
- Document uploaded
- Document signed
- Signature pending reminder
- Document rejected

### Tenants & Applications

- New application
- Background check completed
- Application approved / rejected
- Tenant move-in
- Tenant move-out
- Tenant account issue
- Tenant message received

### Properties & Units

- Unit vacancy detected
- Unit marked available
- Unit status change
- Inspection due / overdue
- Property added / archived

### Messages

- New tenant message
- New internal message
- Mention / @tag
- Unread reminder

### System & Platform

- System update
- Scheduled maintenance
- Feature announcement
- Security alert
- Role or permission change
- Integration failure

---

## 3. Notification Channels

Supported channels:

- In-app
- Email
- SMS (optional / paid / urgent-only)
- Push (future)
- Webhook (Enterprise)

### Channel Controls

- Enable / disable per channel
- Channel allowed severities
- Channel rate limits (org-level)
- SMS restricted to urgent by default

---

## 4. Roles & Defaults

### Role Presets

- Owner
- Admin
- Property Manager
- Leasing Agent
- Maintenance Staff
- Accounting
- Read-only

Each role defines:

- Enabled categories
- Default channels
- Severity thresholds

Users may override unless restricted by admin.

---

## 5. Schedule & Frequency

### Delivery Timing

- Instant
- Daily digest
- Weekly summary

### Time Controls

- Quiet hours (Do Not Disturb)
- Timezone-aware delivery
- Weekend suppression (optional)

### Escalation

- Escalate if unread after X minutes (urgent only)
- Escalation target: role or user

---

## 6. Scope & Targeting

Each notification can be scoped to:

- All properties
- Selected properties
- Selected units only
- Assigned properties only

Used heavily for:

- Maintenance staff
- Regional managers
- Multi-portfolio organizations

---

## 7. Actionability Rules

- Require acknowledgment (urgent only)
- Auto-assign task on notification
- Forward to role or vendor
- Trigger follow-up reminder if unresolved

---

## 8. Organization-Level Controls (Admin Only)

- Global defaults
- Mandatory notifications (cannot opt-out)
- SMS usage limits
- Emergency override rules
- Vendor notification policies
- Tenant-facing notification policies

---

## 9. Notification History & Audit Log

### Features

- Full notification log
- Read / unread state
- Delivery timestamp
- Channel used
- Trigger source
- Linked record

### Actions

- Filter by category, severity, channel
- Export CSV
- Retention policy (configurable, enterprise)

---

## 10. Tenant Notifications (Separate Surface)

Tenant notification settings are managed separately but share the same backend model.

Tenant events include:

- Rent reminders
- Payment confirmations
- Maintenance updates
- Lease reminders
- Document signing reminders
- Messages

---

## MVP vs Phase Breakdown

### MVP

- Categories
- Channels (in-app + email)
- Role defaults
- Property scoping
- Basic schedule controls

### Phase 2+

- SMS
- Webhooks
- Escalations
- Digest summaries
- Audit export
- Push notifications

---

## Non-Goals

- No per-notification custom copy in MVP
- No user-defined notification types
- No cross-org notification sharing

---

## Success Metrics

- Reduced unread urgent notifications
- High engagement with actionable notifications
- Low opt-out rates
- Clear audit trail for compliance
