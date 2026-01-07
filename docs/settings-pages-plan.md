# Settings Pages Plan

## Purpose
Provide a single, unified Settings experience that supports:
- Individual landlords (1–15 units)
- Large property management organizations
- Clear separation of **user-level** vs **organization-level** configuration
- Multiple entry points that route into the same IA without duplication

---

## Routing & Entry Points

### Canonical Route
- `/settings/*` → single Settings system

### Entry Points
- **Sidebar (bottom-left):** `Settings`
  - Routes to `/settings` (default tab)
- **Top-right Account Menu:**
  - `Account Settings` → `/settings/account`
  - `Billing & Plan` → `/settings/billing`
  - `Security & Compliance` → `/settings/security`

> All entry points land within the same Settings experience, just deep-linked.

---

## Settings Information Architecture

### Top-Level Layout
- Left-side vertical sub-navigation
- Right-side content panel
- Persistent org/user context indicator at top

