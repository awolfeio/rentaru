notifications-improvements.md
Purpose

Define a flexible, scalable notification system where notification type, priority, and visual treatment are decoupled. This allows the same notification type (e.g. maintenance request) to appear at different priority levels while maintaining consistent UX, iconography, and behavior.

1. Core Principles

Type ≠ Priority

Notification type defines what happened

Priority defines urgency and visual emphasis

The same type can resolve to different priorities

Priority Drives Color

Icon color

Accent border

Background tint

Optional priority label

Type Drives Icon

Icon glyph never changes

Icon color adapts to priority

Actions Are Optional

Notifications may be informational or actionable

CTAs are defined per notification instance

2. Notification Object (Canonical Schema)
   Notification {
   id: string
   createdAt: ISODate

readAt?: ISODate
dismissedAt?: ISODate

type: NotificationType
priority: NotificationPriority
category: NotificationCategory

title: string
body: string

icon: NotificationIcon
colorToken: ColorToken

entities?: RelatedEntities
actions?: NotificationAction[]

deeplink?: string
metadata?: Record<string, any>
}

3. Notification Types
   type NotificationType =
   // Financial
   | "rent_payment_received"
   | "rent_payment_failed"
   | "refund_issued"

// Maintenance
| "maintenance_request_created"
| "maintenance_priority_escalated"
| "maintenance_completed"
| "vendor_assigned"

// Lease lifecycle
| "lease_expiring"
| "lease_signed"
| "lease_renewed"
| "lease_terminated"

// Tenant onboarding
| "application_submitted"
| "background_check_completed"
| "application_approved"
| "application_denied"

// Communication
| "message_received"
| "document_uploaded"

// System
| "system_alert"
| "permission_changed"

4. Priority Levels
   type NotificationPriority =
   | "success" // green
   | "high" // red
   | "medium" // amber
   | "low" // neutral
   | "info" // blue

Priority → Visual Mapping
Priority Icon Color Background
success green green-50
high red red-50
medium amber amber-50
low gray gray-25
info blue blue-50

Green is reserved for positive financial or completion events only.

5. Icons (Type-Based)
   type NotificationIcon =
   | "payment"
   | "wrench"
   | "message"
   | "document"
   | "clock"
   | "user"
   | "alert"

Icon Assignment Examples

Rent payment → payment

Maintenance → wrench

Tenant message → message

Lease events → document

Expiration / deadlines → clock

Background checks / applications → user

6. Categories (Filtering & Grouping)
   type NotificationCategory =
   | "financial"
   | "maintenance"
   | "lease"
   | "onboarding"
   | "communication"
   | "system"

7. Variability Examples
   Maintenance (Same Type, Different Priority)
   {
   "type": "maintenance_request_created",
   "priority": "high",
   "title": "Urgent maintenance request",
   "body": "Unit 12A – Active water leak reported.",
   "icon": "wrench"
   }

{
"type": "maintenance_request_created",
"priority": "medium",
"title": "New maintenance request",
"body": "Unit 9C – Dishwasher not draining.",
"icon": "wrench"
}

Rent Payment (Success)
{
"type": "rent_payment_received",
"priority": "success",
"title": "Rent payment received",
"body": "Unit 4B – John Smith paid $2,400 for January.",
"icon": "payment",
"actions": [
{ "label": "View transaction", "action": "open_transaction" }
]
}

Background Check Completed
{
"type": "background_check_completed",
"priority": "info",
"title": "Background check completed",
"body": "Application for Unit 6D is ready for review.",
"icon": "user",
"actions": [
{ "label": "Review application", "action": "open_application" }
]
}

Lease Signed (Incoming Tenant)
{
"type": "lease_signed",
"priority": "success",
"title": "Lease signed",
"body": "Unit 7C – Sarah Johnson has signed the lease.",
"icon": "document",
"actions": [
{ "label": "View lease", "action": "open_lease" }
]
}

Tenant Message
{
"type": "message_received",
"priority": "medium",
"title": "New message from tenant",
"body": "Mike Miller: “I sent the signed parking agreement.”",
"icon": "message",
"actions": [
{ "label": "Reply", "action": "open_message_thread" }
]
}

8. Related Entities
   RelatedEntities {
   propertyId?: string
   unitId?: string
   tenantId?: string
   leaseId?: string
   ticketId?: string
   applicationId?: string
   transactionId?: string
   }

9. Read & Lifecycle States

readAt = null → unread (blue dot)

readAt != null → read

dismissedAt != null → hidden

Optional future:

requiresAction: boolean

autoExpireAt: ISODate

10. UI Rules Summary

Icon glyph = type

Icon color = priority

Messages always use message icon

Success notifications may omit priority label

Financial success always green

Priority label optional for low/info

11. Future Extensions

User-configurable priority overrides

Notification rules engine

Push/email parity

Bulk actions by category

Role-based notification visibility (Admin vs Tenant vs Maintenance)
