1. Global Search UX Goals

One entry point to everything (Cmd/Ctrl + K)

Immediate clarity on entity type (Property, Unit, Tenant, Lease, Ticket, Payment, Document, User)

Fast keyboard-first navigation

Zero ambiguity about where clicking will take the user

Scales cleanly from 1 property → 1,000+ properties

2. Trigger & Entry UX

Search Bar

Placeholder: Search properties, tenants, units, leases, tickets…

Shortcut hint: ⌘K

Always global (top app chrome)

Behavior

Opens dropdown on:

Focus

Typing

Cmd/Ctrl + K

Closes on:

Esc

Click outside

Selection

3. Dropdown Layout (Key UX Decision)
   A. Sectioned Results (Primary Pattern)

Results grouped by Entity Type, not relevance alone.

[ Properties ]
▸ Sunset Apartments (12 units)
▸ Pine Street Duplex

[ Units ]
▸ Unit 3B — Sunset Apartments
▸ Unit 1A — Pine Street

[ Tenants ]
▸ John Smith — Unit 3B
▸ Sarah Jenkins — Unit 12

[ Maintenance Tickets ]
▸ Water Leak — Unit 3B (Urgent)
▸ Heater Issue — Unit 1A

[ Leases ]
▸ Lease — Unit 12 (Expires in 21 days)

[ Payments ]
▸ Rent Payment — John Smith — $1,250 (Overdue)

[ Documents ]
▸ Lease Agreement — Unit 3B

Why

Zero cognitive load

Users instantly understand what they’re looking at

Allows per-type metadata and iconography

4. Visual Language (Critical)
   Result Row Anatomy

Each row contains:

Element Purpose
Leading Icon Entity type (Property, Tenant, Ticket…)
Primary Label Name / identifier
Secondary Context Property, Unit, status, date
Status Badge (optional) Overdue, Urgent, Expiring
Chevron / Enter Hint Indicates navigation
Icon + Color Mapping (Example)
Entity Icon Color
Property Building Blue
Unit Door Indigo
Tenant User Purple
Lease File Slate
Maintenance Wrench Orange / Red
Payment Dollar Green / Red
Document Document Gray
User Shield Neutral

Status color overrides entity color when applicable (Urgent > Entity).

5. Keyboard UX (Non-Negotiable)

↑ / ↓ navigate

Enter → primary destination

Cmd + Enter → open in new tab (web)

Tab cycles entity groups

Esc closes

6. Global Search Result Data Structure
   Unified Result Schema
   GlobalSearchResult {
   id: string
   entityType: 'property' | 'unit' | 'tenant' | 'lease' | 'maintenance' | 'payment' | 'document' | 'user'
   primaryLabel: string
   secondaryLabel?: string
   status?: {
   label: string
   severity: 'info' | 'warning' | 'critical'
   }
   icon: string
   href: string
   metadata?: Record<string, any>
   }

Example: Property
{
"id": "prop_123",
"entityType": "property",
"primaryLabel": "Sunset Apartments",
"secondaryLabel": "12 units · Portland, OR",
"icon": "building",
"href": "/properties/prop_123"
}

Example: Tenant (Overdue)
{
"id": "tenant_456",
"entityType": "tenant",
"primaryLabel": "John Smith",
"secondaryLabel": "Unit 3B · Sunset Apartments",
"status": {
"label": "Overdue Rent",
"severity": "critical"
},
"icon": "user",
"href": "/tenants/tenant_456"
}

Example: Maintenance Ticket (Urgent)
{
"id": "ticket_789",
"entityType": "maintenance",
"primaryLabel": "Water Leak",
"secondaryLabel": "Unit 3B · Reported 2h ago",
"status": {
"label": "Urgent",
"severity": "critical"
},
"icon": "wrench",
"href": "/maintenance/ticket_789"
}

7. Advanced UX Enhancements (Phase 2+)
   Inline Filters (Optional)

Chips above results:

[ All ] [ Properties ] [ Tenants ] [ Maintenance ] [ Payments ]

Smart Ranking Rules

Urgent > Overdue > Expiring > Normal

Recently accessed items boosted

Tenant name + unit number weighted higher than document text

Empty State
No results found for “3B”
Try searching by:
• Unit number
• Tenant name
• Property name
• Ticket issue

8. Navigation Philosophy

Search never performs actions

Always lands user on:

Detail page

Contextual overview

No destructive actions from search results

9. Why This Works for Rentaru

Mirrors mental model of property managers

Makes scale invisible (1 unit vs 1,000 units)

Supports urgent operational workflows

Feels fast, serious, and “command-center” grade
