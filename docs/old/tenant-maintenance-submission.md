Enhanced Tenant Maintenance Submission Wizard
Wizard Overview (Updated)

Issue Category (primary)

Issue Location / Context (required, dynamic)

Issue Type / Specific Problem (required, dynamic)

Details & Urgency

Media Upload

Access Preferences

Review & Submit

Steps 2 and 3 are contextual and mandatory based on Step 1.

Step 1: Primary Issue Category (Required)

Selectable cards:

Plumbing

Electrical

HVAC

Appliance

Structural

Pest

Safety

Other

Selection here drives all downstream options.

Step 2: Issue Location / Area (Required)

Dynamic options based on primary category.

Plumbing

Bathroom

Kitchen

Laundry Room

Utility / Basement

Exterior

Other

Electrical

Living Area

Bedroom

Kitchen

Bathroom

Garage

Exterior

Other

HVAC

Entire Unit

Living Area

Bedroom

Utility / Closet

Other

Appliance

Kitchen

Laundry

Utility / Storage

Other

Structural

Ceiling

Wall

Floor

Door / Window

Balcony / Patio

Exterior

Other

Pest

Kitchen

Bathroom

Living Area

Bedroom

Entire Unit

Other

Safety

Smoke Detector

Carbon Monoxide Detector

Door / Lock

Window

Lighting

Other

Other

Entire Unit

Specific Room

Exterior

Other

Rules

Required to proceed

“Other” requires optional text input: “Please specify”

Step 3: Issue Type / Specific Problem (Required)

Further narrows the request and improves routing.

Plumbing – Issue Type

Leaking pipe

Clogged drain

Running toilet

No hot water

Low water pressure

Water backing up

Broken fixture

Other

Electrical – Issue Type

Power outage

Flickering lights

Outlet not working

Circuit breaker tripping

Exposed wiring

Appliance causing power issue

Other

HVAC – Issue Type

No heat

No air conditioning

Weak airflow

Strange noises

Thermostat issue

Unit not turning on

Other

Appliance – Issue Type

Refrigerator

Stove / Oven

Dishwasher

Microwave

Washer

Dryer

Garbage disposal

Other

Appliance Follow-up (Conditional)
If appliance selected:

Appliance provided by property? (Yes / No)

Structural – Issue Type

Water damage

Cracks

Door won’t close

Window leak

Ceiling damage

Flooring damage

Other

Pest – Issue Type

Rodents

Ants

Roaches

Bed bugs

Wasps / Bees

Other insects

Other

Safety – Issue Type

Alarm not working

Alarm chirping

Door lock failure

Broken window

Exposed hazard

Other

Other – Issue Type

General concern

Noise issue

Odor issue

Unknown issue

Other

Rules

Required

“Other” reveals required text input

Step 4: Issue Details & Urgency

Short title (auto-suggested based on selections)

Description (required)

Urgency selector:

Emergency

Normal

Emergency Selection Behavior

Inline warning:

“Emergency requests are for active safety risks, flooding, no heat in winter, etc.”

Emergency policy link

Step 5: Media Upload

Photos (recommended)

Video (optional)

Drag-and-drop + camera support

Helper text:

“Photos help us resolve issues faster”

Step 6: Access Preferences

Permission to enter without tenant present (required)

Preferred access times

Pets present? (Yes / No)

Step 7: Review & Submit

Full summary grouped by:

Category → Location → Issue Type

Edit links per section

Submit confirmation

Data Model Enhancements
MaintenanceRequest (Wizard-Relevant Fields)
{
category: string
locationContext: string
issueType: string
subIssueDetail?: string

title: string
description: string
priority: "emergency" | "normal"

applianceProvidedByProperty?: boolean
}

UX Principles Applied

Forced specificity without friction

Progressive disclosure (no overwhelming forms)

“Other” always available, never blocking

Better backend routing, better vendor assignment

Cleaner analytics and reporting later
