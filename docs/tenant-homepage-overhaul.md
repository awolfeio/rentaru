# Tenant Homepage Overhaul

## Goal

The tenant homepage should become a practical command center for the tenant. Instead of only showing static account status, it should answer three questions immediately:

1. What needs my attention?
2. What can I do quickly?
3. What is coming up next?

The current screen is clean and visually strong, but it is mostly a status dashboard. The overhaul should increase value by surfacing urgent items, common actions, upcoming dates, and property-enabled features such as amenity reservations.

---

## Core Homepage Strategy

The homepage should prioritize:

- Rent and payment status
- Open maintenance requests
- Unread messages
- Upcoming reservations, inspections, lease dates, and payment due dates
- Fast action entry points
- Property-specific enabled features

This page should adapt based on the tenant's property configuration. If a property does not support vehicles, amenities, renter's insurance, guest parking, or other optional modules, those items should not appear.

---

## Recommended Homepage Structure

```text
Hi, John
Rent is overdue and 1 maintenance request is in progress.

[Balance Card] [My Unit Card]

Quick Actions
[Pay Rent] [Submit Maintenance] [Reserve Amenity] [Message Property]

Upcoming
[Lease ends Feb 28] [Rent due Mar 1] [Clubroom Feb 12]

Recent Activity
[Maintenance] [Payments] [Messages] [Reservations]
```

This gives the homepage a clearer role: help the tenant take the next important action without needing to navigate around the app.

---

# 1. Dynamic Greeting Area

## Current State

```text
Hi, John
Welcome back to your home dashboard.
```

This is friendly, but it does not add much functional value.

## Recommended Enhancement

Make the greeting summarize the tenant's current status.

### Overdue / Action Needed Example

```text
Hi, John
You have 1 maintenance request in progress and rent is overdue.
```

### Normal / Healthy State Example

```text
Hi, John
Everything is up to date. Your next rent payment is due Mar 1.
```

### Reservation-Focused Example

```text
Hi, John
Your clubroom reservation is confirmed for Friday at 6:00 PM.
```

### Lease-Focused Example

```text
Hi, John
Your lease ends in 30 days. Review your renewal options when ready.
```

## Value

This turns the top of the page into a useful daily summary instead of a generic welcome message.

---

# 2. Primary Top Cards

The current top-card layout should remain. It is visually clear and gives the page a strong hierarchy.

## Card 1: Balance / Rent

The existing rent card is already one of the strongest parts of the page. It should remain the most prominent card when payment is overdue.

### Recommended Data

- Total balance
- Rent status
- Due date
- Late fee warning, if relevant
- Auto-pay status
- Last payment date
- Primary payment CTA
- Secondary auto-pay CTA

### Overdue State Example

```text
Rent Overdue

Total Balance
$1,450

Was due on Jan 1, 2024. Late fees may apply.

[Pay Now] [Manage Auto-Pay]
```

### Normal State Example

```text
Next Rent Due

$1,450
Due Mar 1, 2024

Auto-pay is enabled.

[Pay Early] [Manage Auto-Pay]
```

## Card Behavior

When rent is overdue, the card should visually dominate.

When rent is current, the card should become calmer and shift from urgency to reassurance.

---

## Card 2: My Unit

The current My Unit card is visually strong, but it can carry more useful information.

### Recommended Data

```text
Unit 3B
Sunset Apartments

Lease ends: Feb 28, 2024
Rent: $1,450/mo
Residents: 2

[View Unit]
```

### Optional Contextual States

If renewal is available:

```text
Renewal Available
[Review Renewal]
```

If renter's insurance is required but missing:

```text
Insurance Needed
[Upload Proof]
```

If vehicle registration is required:

```text
Vehicle Info Needed
[Add Vehicle]
```

## Value

This makes the My Unit card more than a visual identity block. It becomes a compact lease and occupancy summary.

---

# 3. Add a Quick Actions Section

## Recommendation

Add a Quick Actions module directly beneath the top cards and above the tabbed activity section.

This is the best place to add the Reserve Amenity entry point.

## Desktop Layout Example

```text
Quick Actions

[ Pay Rent ] [ Submit Maintenance ] [ Reserve Amenity ] [ Message Property ]
```

## Card-Based Version

```text
Pay Rent
Make a payment or manage auto-pay.

Submit Maintenance
Report an issue in your unit.

Reserve Amenity
Book guest suites, clubroom, parking, and more.

Message Property
Contact your property team.
```

## Why This Works

Amenity reservation is a common action-oriented task. A tenant may not naturally think to look under My Unit, Lease & Docs, or Maintenance. A homepage action gives it a clear and discoverable entry point.

## Property Configuration Logic

Quick Actions should be driven by enabled modules.

### Always Available Actions

- Pay Rent
- Submit Maintenance
- Message Property

### Conditional Actions

- Reserve Amenity
- Add Vehicle
- Upload Renter's Insurance
- Request Guest Parking
- Renew Lease
- View Move-Out Checklist

## Empty / Hidden State

If amenities are not enabled for the property, hide Reserve Amenity completely.

Do not show a disabled homepage action unless there is a clear reason the tenant should know the feature exists.

---

# 4. Reserve Amenity Entry Point

## Best Homepage Placement

The primary homepage entry should be in the Quick Actions section:

```text
Reserve Amenity
Book shared spaces and property resources.
```

Alternative helper copy:

```text
Reserve Amenity
Book guest suites, clubroom, parking, and more.
```

## Optional Status Chips

```text
3 Available
Requires Approval
Open Today
New
```

## Why This Is the Best Entry

The homepage is where tenants go to take quick action. Amenity booking belongs alongside payment, maintenance, and messaging because it is a task the tenant initiates.

---

# 5. Sidebar Navigation Recommendation

## Add a Dedicated Sidebar Item

Add a persistent nav item only when amenities are enabled for the property.

Recommended label:

```text
Amenities
```

Recommended placement:

```text
My Unit
Amenities
Vehicles
Messages
```

## Why “Amenities” Is Better Than “Reservations”

Tenants usually think in terms of the thing they want to use:

- Clubroom
- Guest suite
- Pool cabana
- Parking spot
- Conference room
- Elevator reservation

They are less likely to think in terms of “creating a reservation record.”

Use “Amenities” as the navigation label, then use “My Reservations” inside the Amenities page.

## Amenities Page Structure

```text
Amenities

Browse Amenities
My Reservations
Reservation Rules
Availability Calendar
```

---

# 6. Upcoming Module

## Recommendation

Add an Upcoming module or make the existing Upcoming tab more visible.

Upcoming dates are high-value for tenants and should not be buried behind tabs.

## Example

```text
Upcoming

Feb 12    Clubroom reservation
Feb 28    Lease ends
Mar 1     Rent due
Mar 4     HVAC filter inspection
```

## Empty State

```text
No upcoming events.
```

## Upcoming Items to Include

- Rent due dates
- Amenity reservations
- Lease end date
- Renewal deadline
- Scheduled maintenance
- Property inspections
- Package pickup deadlines
- Move-in tasks
- Move-out tasks
- Guest parking reservations

## Value

This gives the tenant a reason to check the homepage regularly.

---

# 7. Recent Activity Section

## Current State

The page currently has tabs for:

- Maintenance
- Payments
- Messages
- Upcoming

This works, but the purpose could be clearer.

## Recommended Label

Rename the section to:

```text
Recent Activity
```

Then keep the tabs underneath.

## Recommended Tabs

```text
Maintenance
Payments
Messages
Reservations
Upcoming
```

## Reservation Tab Example

```text
Guest Suite
Feb 12, 3:00 PM – Feb 13, 11:00 AM
Pending Approval

[View]
```

## Value

This lets the homepage handle both action and status:

- Quick Actions = start something new
- Recent Activity = check on something already happening

---

# 8. My Unit Page Amenity Entry

Amenities should not live only under My Unit, but My Unit can include a secondary entry point.

## Example Card

```text
Property Amenities
Reserve shared spaces and services available at Sunset Apartments.

Available amenities:
Guest Suite, Clubroom, Pool Cabana

[Browse Amenities]
```

## Priority

This should be secondary to the homepage Quick Action and sidebar navigation.

The My Unit page is a contextual location, not the primary discovery location.

---

# 9. Amenity Reservation Flow

## Step 1: Choose Amenity

Use cards or a list view depending on the number of enabled amenities.

### Example Cards

```text
Guest Suite
Overnight stay for approved guests
From $85/night
Requires approval

Clubroom
Private event space
$25/hr
Instant booking

Pool Cabana
Outdoor reservation
Free
2-hour limit
```

### Filters

```text
Available today
Free
Instant booking
Requires approval
Indoor
Outdoor
Overnight
```

## Step 2: Pick Date and Time

The date/time UI should adapt to the amenity type.

### Hourly Amenity

```text
Select date
Select start time
Select duration
```

### Overnight Amenity

```text
Check-in date
Check-out date
Guest count
```

### Resource-Based Amenity

```text
Select item
Select reservation window
```

Examples:

- Loading dock
- Elevator
- Guest parking space
- Grill station
- Conference room

## Step 3: Rules and Details

Show rules before confirmation.

```text
Rules
- No smoking
- Quiet hours after 10 PM
- Max 12 guests
- $100 refundable deposit required
```

### Tenant Fields

```text
Purpose of reservation
Guest count
Special notes
```

### Property-Defined Fields

```text
Will alcohol be served?
Do you need tables/chairs?
Guest names
Vehicle information
Proof of insurance
Event type
```

## Step 4: Review and Submit

```text
Clubroom
Feb 12, 2024
6:00 PM – 10:00 PM

Fee: $100
Deposit: $100
Approval: Required

[Submit Reservation]
```

## Confirmation States

### Approval Required

```text
Reservation requested
The property team will review your request.
```

### Instant Booking

```text
Reservation confirmed
You're booked for Feb 12.
```

---

# 10. Amenity Feature Configuration

Because properties may vary dramatically, the amenity system should be modular and property-defined.

## Property-Level Settings

Each property should be able to define:

- Whether amenities are enabled
- Which amenities exist
- Amenity names
- Amenity descriptions
- Photos or icons
- Availability schedule
- Booking rules
- Fees
- Deposits
- Approval requirements
- Cancellation rules
- Required tenant fields
- Max guest count
- Minimum and maximum booking duration
- Buffer time between bookings
- Whether recurring reservations are allowed
- Whether the amenity is visible to all tenants or only certain units

## Amenity Types

Potential amenity types:

- Clubroom
- Guest suite
- Pool cabana
- Rooftop deck
- Conference room
- Fitness room slot
- Grill station
- Guest parking
- Loading dock
- Freight elevator
- Storage unit
- Event space
- Coworking room
- Pet wash station

---

# 11. Reservation Statuses

Reservation statuses should be simple and readable.

Recommended statuses:

```text
Draft
Pending Approval
Confirmed
Denied
Canceled
Completed
No Show
Expired
```

## Tenant-Facing Status Labels

Use friendly language in the tenant app:

```text
Pending Approval
Confirmed
Canceled
Completed
```

Avoid overly operational labels unless necessary.

---

# 12. Homepage Rules by Tenant State

The homepage should prioritize content based on tenant state.

## If Rent Is Overdue

Priority:

1. Rent card
2. Pay Now CTA
3. Late fee warning
4. Maintenance / messages / upcoming below

## If Rent Is Current

Priority:

1. Next rent due
2. Quick Actions
3. Upcoming events
4. Recent activity

## If Maintenance Is Active

Show active maintenance prominently in Recent Activity.

```text
Water leak under sink
In progress
Last updated 2 hrs ago
```

## If Amenity Reservation Is Upcoming

Surface it in Upcoming.

```text
Clubroom reservation
Friday, Feb 12 at 6:00 PM
Confirmed
```

## If Lease Renewal Is Available

Surface a contextual CTA in the My Unit card or Upcoming module.

```text
Lease renewal available
Review your renewal options before Feb 15.
```

---

# 13. Highest-Impact Changes

1. Add a Quick Actions section.
2. Add Reserve Amenity as a homepage action.
3. Add a persistent Amenities sidebar item, only when enabled for the property.
4. Rename the lower tab section to Recent Activity.
5. Add Reservations as a tab once amenity booking is enabled.
6. Make the greeting dynamically summarize what matters.
7. Add an Upcoming module that is visible without needing to click a tab.
8. Let homepage modules hide or appear based on enabled property features.
9. Add contextual states to the My Unit card.
10. Keep the rent card dominant only when payment action is urgent.

---

# 14. Recommended Implementation Phases

## Phase 1: Homepage Value Layer

Implement:

- Dynamic greeting summary
- Improved Balance card states
- Improved My Unit card details
- Quick Actions module
- Recent Activity section label
- Conditional rendering based on enabled modules

This phase increases homepage value without requiring the full amenity system to be complete.

## Phase 2: Amenity Entry Points

Implement:

- Reserve Amenity Quick Action
- Amenities sidebar nav item
- Reservations tab in Recent Activity
- Upcoming reservation cards
- Empty states for no amenities and no reservations

This phase creates the user-facing access points.

## Phase 3: Full Amenity Reservation Flow

Implement:

- Browse amenities
- Amenity details page or modal
- Availability calendar
- Date/time selection
- Property-defined rules and fields
- Review and submit step
- Approval-required and instant-booking paths
- My Reservations list
- Reservation detail view
- Cancellation flow

## Phase 4: Property Management Configuration

Implement management-side tooling for:

- Creating amenities
- Setting schedules
- Setting rules
- Setting fees and deposits
- Defining custom fields
- Managing approvals
- Viewing reservation calendar
- Canceling or editing reservations
- Sending tenant messages related to reservations

---

# 15. Final Recommendation

The tenant homepage should become the central daily-use surface of the tenant app.

The best place to introduce Reserve Amenity is the homepage Quick Actions section, supported by a persistent Amenities sidebar item and reservation status visibility in Upcoming and Recent Activity.

This creates a clean hierarchy:

```text
Homepage Quick Action = start a reservation
Amenities sidebar = browse and manage amenities
Upcoming = remember what is scheduled
Recent Activity / Reservations = track status
My Unit = secondary contextual entry
```

This structure keeps the app simple for small landlords while still supporting complex, amenity-rich properties at larger scales.
