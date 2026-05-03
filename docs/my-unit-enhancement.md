# My Unit Page Enhancement Plan

## Objective

Improve the tenant-facing **My Unit** page by making the hero area more useful, contextual, and action-oriented without duplicating the entire sidebar navigation.

The My Unit page should help tenants quickly understand:

1. Where they live
2. Whether their unit, lease, and setup status are in good standing
3. Whether anything needs attention
4. What the most relevant next action is

The hero should act as a **unit command center**, not a second navigation menu.

---

## Current State

The current My Unit hero includes:

- Unit number
- Property name
- Move-in date
- Lease end date
- Bed count
- Bath count
- Square footage
- Parking assignment
- View Lease CTA

This is visually strong, but most of the information is static. It tells the tenant what their unit is, but does not clearly communicate status, priority, or next steps.

---

## Core UX Principle

The sidebar should remain the global navigation system.

The My Unit hero should only surface actions that are specifically relevant to the tenant’s unit, lease, household, parking, insurance, utilities, or required setup tasks.

Avoid turning the hero into a duplicate of:

- Payments
- Maintenance
- Messages
- Settings
- Help & Support

Those destinations already exist in the sidebar. The hero should only reference them when there is a unit-specific reason.

---

## Recommended Hero Strategy

### Use Contextual CTAs, Not Permanent Duplicates

The hero should support semi-duplicative CTAs only when they are directly tied to the current unit context.

Good hero CTAs:

- View Lease
- Complete Unit Setup
- Upload Insurance
- Update Insurance
- Review Renewal Options
- Manage Parking
- Manage Vehicles
- Contact Property Manager
- View Move-In Checklist
- View Open Maintenance Request
- Report Unit Issue

Avoid permanent generic CTAs:

- Payments
- Messages
- Settings
- Help & Support
- Generic Maintenance

---

## Maintenance CTA Guidance

Because the app already has an explicit Maintenance page in the sidebar, **Submit Maintenance** should not be a permanent primary CTA in the My Unit hero.

However, maintenance-related actions are appropriate when they are unit-specific or state-based.

### Show maintenance in the hero when:

#### 1. There is an open maintenance request

Example:

> 1 open maintenance request for this unit  
> View Request

#### 2. There is scheduled maintenance

Example:

> Maintenance visit scheduled tomorrow, 10 AM–12 PM  
> View Details

#### 3. The tenant is reporting a unit-specific issue

Use softer, unit-specific language:

- Report Issue
- Report Unit Issue
- Request Repair

This feels more contextual than a generic **Maintenance** CTA.

---

## Recommended Hero Content Model

The improved hero should include five areas:

1. Unit identity
2. Unit status
3. Lease summary
4. Setup/compliance summary
5. Contextual actions

---

## Proposed Hero Layout

```text
Unit 3B
Oak Street Apartments

Lease active · 287 days remaining · Unit setup complete

[View Lease] [Contact Manager]

Lease
Feb 14, 2023 – Feb 14, 2024
Renewal opens Dec 14

Unit Setup
5 of 6 complete
Insurance verified · 2 vehicles linked

Parking
Spot #12
Covered carport

Unit Details
2 beds · 1 bath · 850 sq ft
```

---

## Suggested Default State

For a tenant with no urgent issues:

```text
Lease active · Setup complete · No open unit issues

[View Lease] [Contact Manager]
```

This keeps the hero calm and useful without overwhelming the page.

---

## Suggested CTA State Logic

The primary CTA should change based on the tenant’s highest-priority unit-related need.

### Normal State

```text
Lease active · Setup complete · No open unit issues

[View Lease] [Contact Manager]
```

### Setup Incomplete

```text
2 setup items need attention

[Complete Unit Setup] [View Lease]
```

Possible setup items:

- Insurance missing
- Vehicle registration incomplete
- Pet profile incomplete
- Emergency contact missing
- Utility confirmation incomplete
- Lease document unsigned

### Insurance Missing

```text
Renters insurance required

[Upload Insurance] [View Requirements]
```

### Insurance Expiring Soon

```text
Insurance expires in 14 days

[Update Insurance] [View Policy]
```

### Lease Renewal Window

```text
Renewal options are available

[Review Renewal Options] [View Lease]
```

### Lease Ending Soon

```text
Lease ends in 45 days

[Review Lease Options] [Contact Manager]
```

### Open Maintenance Request

```text
1 open maintenance request for this unit

[View Open Request] [Report Another Issue]
```

### Scheduled Maintenance

```text
Maintenance visit scheduled tomorrow, 10 AM–12 PM

[View Details] [Contact Manager]
```

### Move-In Period

```text
Move-in checklist incomplete

[Complete Move-In Checklist] [View Lease]
```

### Move-Out Period

```text
Move-out tasks available

[View Move-Out Checklist] [Contact Manager]
```

---

## Recommended Hero Cards

The current bed/bath/sq ft cards are clean, but they are low-interaction and mostly static. Consider replacing or augmenting them with higher-value cards.

### 1. Lease Card

Shows:

- Lease status
- Lease start and end date
- Days remaining
- Renewal window, if applicable

Example:

```text
Lease
Active
287 days remaining
Ends Feb 14, 2024
```

### 2. Unit Setup Card

Shows:

- Setup completion status
- Missing requirements
- Verification state

Example:

```text
Unit Setup
5 of 6 complete
Insurance verified · Vehicles linked
```

### 3. Parking Card

Shows:

- Assigned space
- Parking type
- Permit/vehicle status

Example:

```text
Parking
Spot #12
Covered carport
2 vehicles linked
```

### 4. Household Card

Shows:

- Number of tenants
- Approved occupants
- Pets, if applicable
- Emergency contact status

Example:

```text
Household
2 tenants
1 approved pet
Emergency contact on file
```

### 5. Unit Details Card

Shows:

- Beds
- Baths
- Sq ft
- Floor plan, if available

Example:

```text
Unit Details
2 bed · 1 bath
850 sq ft
```

---

## What Should Stay Below the Hero

The sections below the hero should remain detailed and modular.

Recommended page sections:

- Vehicles
- Insurance
- Utilities & Services
- Parking
- Household / Occupants
- Pets
- Move-In / Move-Out Checklist
- Unit Documents
- Access & Amenities

Not every property needs every section. The page should only render sections enabled for that property or required for that tenant.

---

## Modularity Requirements

Because the app needs to support both small landlords and large property operators, the My Unit page should be driven by property-level feature configuration.

Each property should be able to enable or disable:

- Renters insurance
- Vehicle registration
- Parking assignments
- Pet profiles
- Utility responsibility tracking
- Amenity access
- Move-in checklist
- Move-out checklist
- Occupant management
- Emergency contact requirements
- Lease renewal workflows
- Scheduled inspections
- Maintenance scheduling

The hero should only surface information for enabled modules.

---

## Hero CTA Priority Rules

When multiple actions are available, prioritize them in this order:

1. Lease signature required
2. Payment-blocking or compliance-blocking issue
3. Insurance missing or rejected
4. Lease renewal or lease ending soon
5. Move-in or move-out checklist
6. Scheduled maintenance or inspection
7. Open maintenance request
8. Vehicle or parking issue
9. Emergency contact or household setup issue
10. Default: View Lease

Only show one primary CTA and one to two secondary CTAs.

---

## Recommended Microcopy

### Status Line Options

```text
Lease active · Setup complete · No open unit issues
```

```text
2 setup items need attention
```

```text
Insurance expires soon · Update required
```

```text
Lease renewal options available
```

```text
Move-in checklist incomplete
```

```text
Maintenance visit scheduled tomorrow
```

### CTA Labels

Good labels:

- View Lease
- Complete Setup
- Upload Insurance
- Update Insurance
- Review Renewal
- Manage Vehicles
- Manage Parking
- Contact Manager
- View Request
- Report Issue
- View Checklist

Avoid vague labels:

- Go
- Details
- Manage
- Learn More
- Continue

---

## UI Recommendation

Keep the bold dark hero, but make it denser with meaningful status.

Suggested structure:

### Left Column

- Unit number
- Property name
- Address shortcut/copy icon
- Status line
- Primary and secondary CTAs

### Right Column

Use 3–4 cards max:

- Lease
- Unit Setup
- Parking
- Unit Details

Avoid showing too many cards in the hero. More detailed information can remain in the lower page sections.

---

## Recommended First Iteration

For the first enhancement pass, implement:

1. Add a status line under the property name
2. Replace static date treatment with a lease summary
3. Add Unit Setup completion state
4. Keep View Lease as the default primary CTA
5. Add Contact Manager as a secondary CTA
6. Add conditional maintenance CTA only when there is an active maintenance state
7. Keep Vehicles, Insurance, and Utilities as detailed sections below the hero

---

## Example First Iteration

```text
Unit 3B
Oak Street Apartments
123 Oak St, Seattle, WA

Lease active · 287 days remaining · Setup complete

[View Lease] [Contact Manager]

Lease
Active
Feb 14, 2023 – Feb 14, 2024

Setup
Complete
Insurance verified · 2 vehicles linked

Parking
Spot #12
Covered

Unit
2 beds · 1 bath
850 sq ft
```

---

## Final Recommendation

Yes, the My Unit hero can include semi-duplicative CTAs, but only when they are contextual, state-based, and unit-specific.

The hero should not compete with the sidebar. It should summarize the tenant’s current unit status and surface the most relevant next action.

The highest-value improvement is a **dynamic Unit Status and Setup system** that changes based on lease state, insurance requirements, vehicles, parking, move-in tasks, maintenance events, and renewal timing.
