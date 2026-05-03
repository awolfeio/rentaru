# Tenants "My Unit" Page — Implementation Plan

## Objective
Create a dedicated **My Unit** page that serves as the tenant’s central hub for all information related to the physical unit they live in. This page should reduce support requests, improve tenant self-service, and provide real-world utility beyond payments and documents.

## Guiding Principles
- Focus on real-life usage, not system data
- Avoid duplicating data from other pages
- Keep content scannable and actionable
- Prioritize high-frequency tenant needs
- Design for future extensibility

## Page Structure Overview
[Unit Overview Card]
[Utilities & Services]
[Access & Entry]
[Appliances & Fixtures]
[Rules & Guidelines]
[Emergency & Contacts]
[Optional: Unit Timeline]

## 1. Unit Overview
- Property name
- Unit number
- Address (copyable)
- Beds / baths / sqft
- Parking
- Move-in date
- Lease end (reference)

## 2. Utilities & Services
- Electricity
- Water / sewer
- Gas
- Internet
- Trash schedule

## 3. Access & Entry
- Entry instructions
- Gate codes (masked)
- Intercom
- Parking access

## 4. Appliances & Fixtures
- Appliance list with model + manufacturer
- Actions:
  - Report Issue (prefill maintenance)
  - View Manual

## 5. Rules & Guidelines
- Pet policy
- Smoking policy
- Quiet hours
- Trash rules
- Responsibility split

## 6. Emergency & Contacts
- Emergency maintenance number
- Property manager
- After-hours instructions

## 7. Optional Timeline
- Move-in
- Inspections

## What NOT to Include
- Rent balance
- Lease docs
- Maintenance tickets
- Messages

## Data Model
- Unit
- Utilities
- Appliances
- Access info
- Rules
- Contacts

## Phases
Phase 1:
- Overview
- Utilities
- Emergency

Phase 2:
- Access
- Appliances

Phase 3:
- Rules
- Timeline

## Naming
Recommended: My Home
Alternatives: Unit Details, Property Info

## Success Metrics
- Fewer support messages
- More self-service usage
- Faster issue resolution

## Summary
A practical, real-world utility hub for tenants.
