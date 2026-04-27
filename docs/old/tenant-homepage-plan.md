# tenant-homepage-plan.md

## Tenant Home (Dashboard) — Overview

The Tenant Home serves as the primary landing page for tenants. Its purpose is to provide immediate clarity on rent status, required actions, ongoing issues, and recent communication. The page should allow a tenant to understand their full rental situation within seconds.

Primary questions this page answers:

- Is my rent paid?
- Do I owe anything right now?
- Is maintenance in progress?
- Did management contact me?
- What do I need to do next?

---

## 1. Top Summary Zone (Above the Fold)

### 1.1 Rent Status Card (Primary Focus)

Most visually prominent element on the page.

**Displayed Data**

- Rent amount
- Due date
- Payment status (Paid / Due Soon / Overdue)
- Last payment date (if paid)
- Late fee indicator (if applicable)

**States**

- Paid (success / green)
- Due Soon (warning / amber)
- Overdue (error / red)

**Primary Actions**

- Pay Rent (if unpaid)
- View Receipt (if paid)
- Enable Auto-Pay (if not enabled)

---

### 1.2 Upcoming Dates Card

Compact informational card.

**Includes**

- Next rent due date
- Lease end date
- Upcoming inspection (if applicable)
- Utility billing date (if applicable)

---

### 1.3 Unit Snapshot Card

Quick reference information.

**Includes**

- Property name
- Unit number
- Property address
- Assigned parking/storage (optional)
- Link: View Unit Details

---

## 2. Primary Action Shortcuts

High-intent action buttons/cards displayed prominently.

**Actions**

- Submit Maintenance Request
- Make a Payment
- View Lease & Documents
- Message Management

These actions should be optimized for mobile and touch interaction.

---

## 3. Maintenance Overview

### 3.1 Active Maintenance Summary

Shows current maintenance state, not full history.

**Displayed**

- Count of open requests
- Status indicators:
  - Emergency
  - In Progress
  - Awaiting Tenant
- Most recent request preview:
  - Title
  - Status
  - Last update timestamp

**Actions**

- View All Maintenance
- Create New Request

**Empty State**

- Friendly confirmation when no active requests exist

---

## 4. Messages & Announcements

### 4.1 Messages Preview

Critical communication surface.

**Displayed**

- Latest 1–3 messages
- Sender
- Timestamp
- Unread indicators

**Action**

- View All Messages

---

### 4.2 Property Announcements (Optional)

Used for time-sensitive property-wide notices.

**Examples**

- Maintenance outages
- Fire alarms
- Water shutoffs
- Community notices

**Behavior**

- Dismissible
- Time-scoped
- Non-persistent once expired

---

## 5. Lease & Documents Summary

### 5.1 Lease Status Card

Confidence-building snapshot.

**Displayed**

- Lease status (Active / Ending Soon / Expired)
- Lease start date
- Lease end date
- Outstanding signatures (if any)

**Actions**

- View Lease
- Download Documents

---

## 6. Payment History Snapshot

Lightweight preview of recent transactions.

**Displayed**

- Last 2–3 payments
- Payment date
- Amount
- Payment method

**Action**

- View Full Payment History

---

## 7. Household & Utilities (Conditional)

### 7.1 Household

Displayed only if household features are enabled.

**Includes**

- List of household members
- Pending invitations
- Emergency contact access

---

### 7.2 Utilities

Displayed only if utilities are managed through the platform.

**Includes**

- Utility type
- Included vs tenant-paid indicator
- Current balance (if billed)
- Due date

---

## 8. Help & Support Access

Always accessible but visually subtle.

**Includes**

- Help Center
- Contact Property Management
- Emergency instructions (after-hours support)

---

## 9. First-Time / Empty State Experience

Displayed for new tenants or incomplete onboarding.

**Checklist Example**

- Complete profile
- Review lease
- Pay first rent
- Enable auto-pay

Purpose: reduce confusion and support requests.

---

## 10. UX & Behavior Principles

**Hierarchy**

1. Rent status
2. Required actions
3. Maintenance and messages
4. Informational content

**Tone**

- Neutral
- Clear
- Calm
- Non-legalistic

**Mobile Priority**

- Rent status and payment always visible
- Actions stack vertically
- Messages and maintenance remain high priority

---

## 11. Explicit Exclusions

The Tenant Home should NOT include:

- Full maintenance history
- Full lease text
- Account or profile settings
- Billing edge cases or disputes
- Dense tables or long scroll content

---

## Core Design Intent

The Tenant Home should immediately answer:
“Am I okay right now — and if not, what do I need to do?”
