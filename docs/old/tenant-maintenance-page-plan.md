# tenant-maintenance-page-plan.md

## Purpose

Provide tenants with a single, clear place to submit, track, and communicate about maintenance issues. The experience should feel fast, transparent, and reassuring, regardless of landlord size or operational complexity behind the scenes.

---

## Page-Level Goals

- Enable quick maintenance request submission
- Clearly communicate request status and next steps
- Centralize all maintenance-related communication
- Support emergency vs non-emergency flows
- Be mobile-first and low-friction

---

## Page Structure

### 1. Page Header

- **Title:** Maintenance
- **Primary CTA:** “Submit Request”
- **Secondary CTA (optional):** “Emergency Info”
- **Context Label:** Unit + Property name (e.g. `Unit 3B · Sunset Apts`)
- Header actions should remain visible at all times

---

### 2. Active Maintenance Requests

Default view when requests exist.

#### Request Card UI

Each request is shown as a compact card:

- Category icon (plumbing, electrical, HVAC, etc.)
- Issue title
- Status pill:
  - Submitted
  - In Review
  - Scheduled
  - In Progress
  - Completed
  - Closed
- Priority tag:
  - Emergency
  - High
  - Normal
- “Last updated” timestamp
- Click action: View details

Behavior:

- Emergency requests are pinned to top
- Completed requests auto-collapse after a set period

---

### 3. Maintenance Request Detail View

Accessible via card click (drawer or full page).

#### A. Request Summary

- Issue title
- Category
- Priority
- Status timeline (submitted → completed)
- Submission date
- Reference ID

#### B. Description

- Tenant-provided description
- Editable only while status = Submitted

#### C. Attachments

- Image/video gallery
- Upload timestamps
- Optional ability to add more media if request is still active

#### D. Access & Scheduling

- Permission to enter without tenant present
- Preferred access windows
- Pet presence indicator

#### E. Communication Thread

Chat-style feed containing:

- Tenant messages
- Property manager messages
- Vendor/system updates

Supports:

- Text
- Image attachments
- System-generated status updates

#### F. Resolution (Completed State)

- Completion notes
- Completion date
- Optional completion photos
- Tenant confirmation:
  - “Resolved”
  - “Still an issue” (reopens request)

---

### 4. Submit Maintenance Request Flow

#### Step 1: Category Selection

Selectable cards:

- Plumbing
- Electrical
- HVAC
- Appliance
- Structural
- Pest
- Other

#### Step 2: Issue Details

- Title (required)
- Description (required)
- Urgency selector:
  - Emergency (shows emergency policy notice)
  - Normal

#### Step 3: Media Upload

- Drag-and-drop image/video upload
- Helper text explaining faster resolution with photos

#### Step 4: Access Preferences

- Permission to enter
- Preferred access times
- Pet disclosure

#### Step 5: Review & Submit

- Summary of entered information
- Submit confirmation
- Success state with “Submitted” status

---

### 5. Maintenance History

Collapsed by default.

- List or table view:
  - Issue
  - Category
  - Status
  - Date submitted
  - Date resolved
- Filters:
  - Status
  - Category
  - Date range
- Search by issue title

---

### 6. Empty States

#### No Requests

- Friendly illustration
- Message: “No maintenance requests yet”
- CTA: “Submit your first request”

#### All Completed

- Message: “You’re all caught up”

---

## Core Data Models

### MaintenanceRequest

```ts
{
  id: string
  unitId: string
  tenantId: string
  propertyId: string
  title: string
  description: string
  category: "plumbing" | "electrical" | "hvac" | "appliance" | "structural" | "pest" | "other"
  priority: "emergency" | "high" | "normal"
  status: "submitted" | "reviewing" | "scheduled" | "in_progress" | "completed" | "closed"
  allowEntryWithoutTenant: boolean
  preferredAccessTimes?: string
  petsPresent: boolean
  attachments: Media[]
  messages: MaintenanceMessage[]
  createdAt: ISODate
  updatedAt: ISODate
  completedAt?: ISODate
}
MaintenanceMessage
{
  id: string
  requestId: string
  senderType: "tenant" | "manager" | "vendor" | "system"
  message: string
  attachments?: Media[]
  createdAt: ISODate
}
Media
{
  id: string
  type: "image" | "video"
  url: string
  uploadedBy: "tenant" | "manager" | "vendor"
  uploadedAt: ISODate
}
```
