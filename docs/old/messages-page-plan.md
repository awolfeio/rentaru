# Messages / Inbox Page Plan

> **Purpose:** Define a scalable, context-first Messages page that centralizes communication with tenants, vendors, and staff—without becoming a generic chat app or replacing email.

---

## Core Principles

- Messages are **contextual**, not free‑floating
- Optimized for **response speed and traceability**
- Conversation threads always tie back to an entity (tenant, unit, ticket, lease)
- Progressive density from a handful of conversations → enterprise volumes
- Inbox clarity over chat novelty

---

## Mental Model

> _“Show me who needs a response, why they’re messaging, and let me act without losing context.”_

---

## Page Layout Overview

```
┌───────────────────────────────────────────────┐
│ Messages Header + Filters                    │
├───────────────┬───────────────────────────────┤
│ Thread List   │ Conversation Viewer           │
│ (Inbox)      │                               │
│               │  ├─ Message History           │
│               │  ├─ Related Context Panel     │
│               │  └─ Reply Composer             │
└───────────────┴───────────────────────────────┘
```

---

## 1. Messages Header

### Left: Page Identity

- **Title:** `Messages`
- **Subtitle:** `Tenant, vendor, and system communications`

---

### Right: Global Controls

- `New Message`
- Search (name, unit, ticket)
- Filters:

  - Unread / All
  - Sender type (tenant / vendor / internal)
  - Related entity (maintenance / lease / payment)

**Rules**

- Defaults to unread + recent
- Filters persist per user

---

## 2. Thread List (Inbox – Left Column)

### Purpose

Fast scanning of conversations that need attention.

---

### Thread Row Structure

| Element       | Purpose                |
| ------------- | ---------------------- |
| Avatar / Icon | Sender type            |
| Title         | Who + why (contextual) |
| Snippet       | Last message preview   |
| Badges        | Unread / urgent        |
| Timestamp     | Last activity          |

---

### Example Thread Row

```
Jane Smith · Unit 3B
Maintenance: Water leak

“Still leaking under the sink…”   ● Unread   2h
```

---

### Visual Rules

- Unread threads emphasized
- Muted styling for read threads
- Icons indicate tenant vs vendor vs system

---

## 3. Conversation Viewer (Right Column)

### A. Conversation Header

- Participant(s)
- Related entity chips:

  - Unit
  - Maintenance ticket
  - Lease

Clickable chips open context in-place or side drawer.

---

### B. Message History

- Chronological message list
- Clear sender attribution
- Timestamps grouped naturally

**Rules**

- No typing indicators
- No read receipts unless required

---

### C. Context Panel (Side / Inline)

Shows **why this conversation exists**.

**Examples**

- Maintenance ticket summary
- Lease dates
- Outstanding balance (read-only)

This panel is:

- Collapsible
- Read-only

---

### D. Reply Composer

- Text input
- Attachment upload (images, PDFs)
- Send via:

  - In-app
  - Email
  - SMS (if enabled)

**Rules**

- Plain text first
- Templates optional (enterprise)

---

## 4. Message Types & Sources

### Supported Sources

- Tenant portal messages
- Vendor replies
- System-generated notifications (replyable where appropriate)
- Email / SMS bridged into thread

---

### Message Classification

Each message thread has:

- Primary entity (required)
- Secondary entity (optional)

This prevents orphaned conversations.

---

## 5. Actions & Shortcuts

### Thread-Level Actions

- Mark as read / unread
- Assign to staff member
- Mute thread

---

### Contextual Actions

Available based on entity:

- View maintenance ticket
- View tenant profile
- View lease

---

## 6. Scaling Behavior

### Small Landlords (1–20 Threads)

- Single-column layout optional
- Context panel often expanded
- Minimal filtering needed

---

### Mid-Size Portfolios (50–500 Threads)

- Two-column inbox required
- Unread + urgency sorting critical
- Assignment to staff common

---

### Enterprise (1,000+ Threads)

- Virtualized thread list
- Role-based inboxes
- SLA-based unread highlighting

---

## 7. Empty & Edge States

### No Messages

- Simple confirmation state
- Explanation of how messages appear

---

### All Caught Up

- Muted success state
- No gamification

---

## 8. Accessibility & Performance

- Full keyboard navigation
- Screen-reader friendly message structure
- Virtualized lists for large inboxes
- No blocking animations

---

## 9. Data Model (Simplified)

```ts
Thread {
  id
  participants[]
  primaryEntityType // tenant | maintenance | lease | payment
  primaryEntityId
  lastMessageAt
  unreadCount
}

Message {
  id
  threadId
  senderType // tenant | vendor | staff | system
  body
  attachments[]
  createdAt
}
```

---

## What Is Explicitly Excluded

- ❌ Real-time chat features (typing indicators, reactions)
- ❌ Social or emoji-heavy UI
- ❌ CRM-style conversation scoring
- ❌ Standalone messaging without context

---

## One-Line Definition

> **The Messages page is a contextual inbox—not a chat application.**

---

_End of messages-page-plan.md_
