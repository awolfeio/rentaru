# Add Unit Plan

Purpose:  
Define a **clean, fast, non-bloated Add Unit flow** that supports:
- solo landlords adding a single unit
- professional property managers operating at scale

Units are **revenue-generating objects**, so the flow must be serious, structured, and future-proof — but meaningfully lighter than Add Property.

---

## High-Level UX Decision

**Pattern:** Property-scoped full-page wizard (modal-like focus)  
**Route:** `/properties/:propertyId/units/new`  
**Primary Entry Points:**
- “Add Unit” button on Single Property page
- Future: Bulk Add Units

**Rationale**
- Unit creation is contextual to a Property
- Requires structured data
- Must scale without redesign
- Avoid fragile modals for financial objects

---

## Visual & Interaction Model

### Overall Feel
- Faster and lighter than Add Property
- Transactional, focused, professional
- No sense of “temporary” or “dismissible”

### Layout
- Full-page content area
- Property header persists:
  - Property name
  - Address
  - Unit count
- Centered content card
  - Max width: ~900–1000px

Highland Lofts
Add Unit — Step 1 of 3
────────────────────────────────
[ Unit Details Form ]
────────────────────────────────

← Back Save Draft Next →


---

## Stepper Structure

### Steps
1. Unit Details
2. Rent & Financials
3. Review & Add Unit

Stepper is visible at all times.

---

## Step 1: Unit Details

### Goal
Define **what this unit physically is** and how it should behave operationally.

### Required Fields
- Unit Identifier  
  - e.g. 101, A, Upper, Garden  
  - Must be unique within the property
- Bedrooms  
  - Integer (≥ 0)
- Bathrooms  
  - Integer or .5 increments
- Unit Status  
  - Vacant  
  - Occupied  
  - Offline (Renovation / Hold)

### Strongly Recommended
- Square Footage
- Unit Type  
  - Studio  
  - 1 Bedroom  
  - 2 Bedroom  
  - Custom
- Floor / Level (if applicable)

### Optional
- Internal Notes

### Logic
- Real-time validation for identifier uniqueness
- Status selection affects post-create flow:
  - Occupied → prompt to add lease
  - Vacant → marked available
  - Offline → excluded from occupancy calculations

### Visual Notes
- Single-column layout
- Inline validation and helper text
- No nested accordions

---

## Step 2: Rent & Financials

### Goal
Ensure the unit can **collect rent, report income, and integrate with accounting**.

### Required Fields
- Rent Amount
- Rent Frequency  
  - Monthly (default)  
  - Weekly (future-ready)
- Security Deposit Amount  
  - Defaults from property settings if available

### Strongly Recommended
- Market Rent
- Rent Due Day  
  - Inherited from property by default
- Late Fee Rule  
  - Inherit from property (editable per unit)

### Optional Fields
- Utilities Included  
  - Water  
  - Sewer  
  - Trash  
  - Gas  
  - Electric
- Utility Responsibility  
  - Owner  
  - Tenant
- Accounting Income Category

### Logic
- All values inherit from Property when available
- Per-unit overrides allowed
- No lease required at this stage

### Visual Notes
- Two-column layout
- “Inherited from Property” indicators
- Advanced fields collapsed by default

---

## Step 3: Review & Add Unit

### Goal
Confirm correctness and commit the unit.

### Review Sections
- Unit Summary  
  - Identifier, beds, baths, sqft, status
- Rent & Deposit Summary
- Accounting Summary (if set)

### Status-Based Messaging
- Occupied:  
  “You’ll be prompted to add a lease after creation.”
- Vacant:  
  “This unit will appear as available.”
- Offline:  
  “This unit will not count toward occupancy.”

### Actions
- Edit any previous step
- Add Unit (primary CTA)

---

## Post-Creation Behavior

### Default Routing
- Return to Single Property page
- Newly added unit highlighted in Units table

### Suggested Next Actions (Non-Blocking)
- Add lease
- Invite tenant
- Upload unit photos
- Create maintenance baseline

---

## Data Model (Simplified)

### Unit
```ts
Unit {
  id
  propertyId
  identifier
  unitType
  beds
  baths
  sqft
  floor
  status
  rentAmount
  rentFrequency
  depositAmount
  marketRent
  rentDueDay
  lateFeeRuleId
  accountingCategoryId
  notes
  createdAt
}
