# notification-panel-plan.md

## Purpose
Provide a centralized, real-time feed of actionable events across the platform. Optimize for **scanability**, **clear priority**, and **fast resolution** for both small landlords and large portfolios.

---

## Panel Behavior
- **Trigger**: Click Notifications icon in Global Utility Bar
- **Placement**: Right-side slide-over panel
- **Width**: ~360–420px
- **Persistence**: Dismiss on outside click or close icon
- **Unread Badge**: Count of unread notifications on icon
- **Realtime**: WebSocket / polling-backed where applicable

---

## Notification Categories (Types)

### 1. Financial & Payments
- Rent payment received
- Rent payment failed / returned
- Partial payment received
- Upcoming rent due (configurable reminder)
- Late fee applied
- Owner payout processed / failed

**Priority**: High  
**Default State**: Enabled

---

### 2. Maintenance & Work Orders
- New maintenance request submitted
- Maintenance request updated (status change)
- Vendor assigned / unassigned
- Vendor marked job complete
- Tenant replied to maintenance thread

**Priority**: High–Medium  
**Action-Oriented**

---

### 3. Leasing & Documents
- Lease signed (tenant / owner)
- Lease pending signature
- Lease expiring soon
- New document uploaded
- Document request from tenant

**Priority**: Medium

---

### 4. Tenant Communication
- New message from tenant
- Reply in an existing message thread
- Tenant sent an attachment

**Priority**: Medium  
**Grouped by Thread**

---

### 5. Property & Portfolio Events
- New property added
- Unit vacancy detected
- Unit status change (occupied ↔ vacant)
- Rent amount updated

**Priority**: Low–Medium

---

### 6. System & Account
- User invited / role changed
- Security alert (new login, password change)
- Integration connected / disconnected
- Billing issue or subscription update
- Platform announcements (rare, dismissible)

**Priority**: Variable (system alerts can be High)

---

## Notification Object (Data Model)

```ts
Notification {
  id: string
  type: enum
  title: string
  description?: string
  entityType?: "property" | "unit" | "tenant" | "lease" | "payment" | "maintenance"
  entityId?: string
  priority: "high" | "medium" | "low"
  isRead: boolean
  createdAt: timestamp
  action?: {
    label: string
    deepLink: string
  }
}
