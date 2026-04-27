# Main Navigation Plan (Left‑Side Vertical Nav)

> **Purpose:** Define a clean, scalable, no‑bloat left‑side navigation for a rental property management platform that works equally well for 1‑unit landlords and enterprise portfolios.

---

## Navigation Philosophy

- **Reflects landlord mental models**, not database structure
- **Stable order** – muscle memory matters
- **Progressive complexity** – advanced features don’t block basic use
- **Operational before analytical** – act first, analyze second
- **Dashboard aggregates, navigation executes**

---

## Recommended Navigation Order

### 1. Dashboard

**Mental model:** Portfolio truth

- Portfolio health
- Financial snapshot
- Action queue

> The only place where everything comes together.

---

### 2. Properties

**Mental model:** My buildings

**Includes:**

- Property list
- Unit drill‑down
- Occupancy
- Vacancy status

**Rules:**

- Property → Unit hierarchy only
- No tenants or finances here

---

### 3. Tenants

**Mental model:** The people paying me

**Includes:**

- Tenant directory
- Lease associations
- Payment history
- Communication history
- Tenant risk indicators

> People come before spreadsheets.

---

### 4. Leases

**Mental model:** The legal layer

**Includes:**

- Active leases
- Upcoming expirations
- Renewals
- Amendments
- E‑sign workflows

**Rule:**

- Leases are lifecycle objects, not just documents

---

### 5. Maintenance

**Mental model:** What’s broken

**Includes:**

- Open tickets
- Urgency / SLA
- Vendor assignment
- Maintenance costs
- Tenant‑submitted requests

**Rule:**

- Maintenance is operational, not financial

---

### 6. Payments

**Mental model:** Money coming in

**Includes:**

- Rent collection
- Late fees
- Partial payments
- Payment methods
- Payout status

**Rule:**

- Transactional money ≠ accounting

---

### 7. Accounting / Financials

**Mental model:** Where the money went

**Includes:**

- Income vs expenses
- Categorization
- Cash flow
- CPA exports
- Schedule E prep

**Design Constraint:**

- Optional for small landlords
- Powerful for advanced users

---

### 8. Documents

**Mental model:** Where files live

**Includes:**

- Lease copies (read‑only)
- Notices
- Inspection reports
- Tax documents

**Rule:**

- Documents are passive reference material

---

### 9. Reports

**Mental model:** Show me the summary

**Includes:**

- Owner reports
- Property performance
- Rent roll
- Delinquency
- Maintenance cost summaries

**Rule:**

- Reports are outputs, not workflows

---

### 10. Messages / Inbox (Optional)

**Mental model:** Conversations & alerts

**Includes:**

- Tenant messages
- Vendor messages
- System notifications
- Email / SMS threads

**Note:**

- If excluded, messages must surface contextually elsewhere

---

### 11. Settings

**Mental model:** Configure the system

**Includes:**

- Organization settings
- Bank accounts
- Payment configuration
- Users & roles
- Integrations
- Branding (logos, email templates)

**Rules:**

- Always last
- Always collapsed by default

---

## Visual Grouping (Strongly Recommended)

```
— Core —
Dashboard
Properties
Tenants
Leases

— Operations —
Maintenance
Payments
Accounting

— Reference —
Documents
Reports
Messages

— System —
Settings
```

> Section dividers reduce scan time and cognitive load significantly.

---

## Explicitly Excluded from Navigation

- ❌ Units (belongs under Properties)
- ❌ Vendors (belongs under Maintenance)
- ❌ Tasks (Action Queue lives on Dashboard)
- ❌ Notifications (Inbox / contextual surfaces)
- ❌ Insights / AI hubs (bloat risk)
- ❌ Marketing / upsells

---

## Power‑User Enhancements (Optional)

- Command palette (⌘K / Ctrl+K)
- User‑pinnable nav items
- Exception‑only badge counts
- Icon‑only collapsed mode with hover labels

---

## One‑Line Definition

> **Navigation exists to execute work. The Dashboard exists to decide what work matters.**

---

_End of main-nav-plan.md_
