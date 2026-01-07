# Global Utility Bar (a.k.a. App Utility Bar)

## Recommended Name
**Global Utility Bar**

**Why**
- Conveys *persistent*, *cross-app*, *non-primary navigation*
- Industry-aligned (used implicitly by tools like Notion, Linear, Stripe, GitHub)
- Scales cleanly from small landlords to enterprise orgs
- Distinct from primary nav (sidebar / top nav) and page-level actions

**Acceptable Alternatives**
- App Utility Bar  
- Global Action Bar  
- Global App Bar (Material-adjacent, slightly heavier connotation)  
- Top Utility Bar (more explicit, slightly less elegant)

---

## Purpose
A persistent, global control surface that provides:
- Cross-app search
- Time-sensitive alerts
- Help & support access
- Account and organization management

Always visible across authenticated views, positioned **top-right**, above page H1s and content.

---

## Placement & Layout
- **Location:** Top of viewport, right-aligned cluster
- **Z-Index:** Above page headers, below modals/drawers
- **Height:** Compact (40–48px)
- **Behavior:** Sticky (does not scroll with page content)

**Order (Left → Right)**
1. Global Search
2. Notifications
3. Help & Support
4. Account Menu

---

## Component Breakdown

### 1. Global Search
**Type:** Input with icon (⌘K / Ctrl+K accessible)

**Scope**
- Properties
- Units
- Tenants
- Owners
- Documents
- Transactions
- Maintenance tickets
- Messages

**Features**
- Typeahead
- Category scoping (optional advanced tier)
- Recent searches
- Keyboard-first UX

---

### 2. Notifications Button
**Type:** Icon button + badge

**Notification Types**
- Rent paid / failed
- Maintenance updates
- Lease expiring
- Message received
- System alerts

**Dropdown Contents**
- Chronological list
- Read/unread states
- Deep links to source records
- “Mark all as read”

---

### 3. Help & Support Button
**Type:** Icon button

**Dropdown Contents**
- Help Center
- Search Docs
- Contact Support
- Report a Bug
- Feature Requests
- System Status (optional)

**Enterprise Tier Additions**
- Dedicated support contact
- SLA information

---

### 4. Account Menu (Avatar / Icon)
**Type:** Icon button → dropdown menu

---

## Account Menu Dropdown (Detailed)

### Identity Section
- User avatar
- Name
- Email
- Current role (Owner, Manager, Admin)

---

### Organization / Portfolio
- Current Organization / Portfolio name
- Switch Organization (if applicable)
- Manage Organizations (permissions-aware)

---

### Account Settings
- Profile Settings  
  - Name
  - Email
  - Password
  - 2FA
- Notification Preferences
- Appearance
  - Theme (Light/Dark/System)
  - Density (Compact / Comfortable)

---

### Billing & Plan
- Current Plan
- Usage (units, users)
- Billing Portal
- Upgrade / Manage Plan

---

### Security & Compliance
- Sessions & Devices
- API Keys (advanced tiers)
- Audit Logs (enterprise)

---

### Legal & System
- Terms of Service
- Privacy Policy
- Data Export
- Account Deletion (guarded)

---

### Sign Out
- Clear, isolated destructive action
- Always last item

---

## Permissions & Tier Awareness
- Menu items dynamically visible based on:
  - Role
  - Plan tier
  - Organization context

Example:
- Solo landlord → no org switching
- Enterprise admin → audit logs, SSO, user management links

---

## UX Guidelines
- Icon-only by default (tooltips on hover)
- Dropdowns open downward, right-aligned
- Keyboard navigable
- Accessible labels for screen readers
- No page reloads; client-side routing

---

## Technical Notes
- Implement as a standalone **GlobalUtilityBar** component
- Mounted once at app shell level
- Context-aware via:
  - Auth state
  - Org state
  - Feature flags
- Lazy-load dropdown contents where possible

---

## Summary
**Global Utility Bar** is the correct abstraction:
- Not navigation
- Not page actions
- A persistent control surface for global concerns

It will age well as the product scales from 1-unit landlords to multi-portfolio operators.
