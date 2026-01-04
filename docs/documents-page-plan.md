# Documents Page Plan

> **Purpose:** Define a scalable, low‑friction Documents page that serves as a trusted source of record for leases and property files—without becoming a full document management system or blocking workflows.

---

## Core Principles

- Documents are **passive records**, not workflows
- Optimized for **finding, verifying, and exporting**
- Clear separation between **documents** and **actions** (signing, renewals)
- Progressive density from a handful of files → thousands
- Strong metadata over folder sprawl

---

## Mental Model

> _“I need to find the right document, confirm it’s signed or valid, and download or reference it.”_

---

## Page Layout Overview

```
┌───────────────────────────────────────────────┐
│ Documents Header + Controls                   │
├───────────────────────────────────────────────┤
│ Document List / Table (Primary Surface)       │
│  ├─ Document Row                              │
│  │   ├─ Type & Status                         │
│  │   ├─ Entity Context                        │
│  │   └─ Metadata & Actions                    │
│  └─ …                                         │
└───────────────────────────────────────────────┘
```

---

## 1. Documents Header

### Left: Page Identity

- **Title:** `Documents`
- **Subtitle:** `Leases, notices, and property files`

---

### Right: Primary Controls

- `Upload Document`
- Search (name, tenant, property)
- Filters:

  - Document type
  - Status (signed / unsigned / expired)
  - Entity (property / unit / tenant / lease)
  - Date range

**Rules**

- Defaults to most recent documents
- Filters persist per user

---

## 2. Document List / Table (Primary Surface)

### Default View: Document Rows

Each document appears as a **single dense row**, optimized for scanning and retrieval.

---

### Document Row Columns

| Column     | Purpose                    |
| ---------- | -------------------------- |
| Document   | Name + type icon           |
| Type       | Lease / notice / report    |
| Related To | Property / unit / tenant   |
| Status     | Signed / pending / expired |
| Date       | Uploaded / signed date     |
| Actions    | View / download / more     |

---

### Example Document Row

```
Lease – Jane Smith – Unit 3B
Lease | Oak Street Apts · 3B | Signed | Jan 1, 2024
```

---

### Visual Rules

- Neutral typography
- Icons indicate document type
- Color only for unsigned or expired documents
- Compact row height

---

## 3. Document Status Indicators

### Status States

- **Signed** – Fully executed
- **Unsigned** – Awaiting signature
- **Expired** – Past validity period
- **Draft** – Uploaded but inactive

Only **Unsigned** and **Expired** receive visual emphasis.

---

## 4. Expand → Document Inline Detail (Optional)

### Interaction

- Click row or caret
- Inline metadata expansion
- No navigation context loss

---

### Inline Detail Sections

#### A. Metadata

- File name
- File size
- Uploaded by
- Upload date

---

#### B. Associations

- Linked lease
- Property
- Unit
- Tenant(s)

---

#### C. Signature Info (If Applicable)

- Signing provider
- Signers
- Signed timestamps

---

#### D. Quick Actions

- View document
- Download
- Replace file
- View related record

---

## 5. Document Actions

### Primary Actions (Row-Level)

- View
- Download

---

### Secondary Actions (Overflow Menu)

- Replace document
- Edit metadata
- Archive document
- Delete (permissions‑based)

---

## 6. Organization & Metadata Strategy

### No Folder Trees by Default

Instead use:

- Document type
- Entity association
- Date

Folders may be enabled **only** for enterprise users as a secondary view.

---

## 7. Scaling Behavior

### Small Landlords (1–20 Documents)

- List view only
- More descriptive names visible
- Minimal filtering needed

---

### Mid-Size Portfolios (50–500 Documents)

- Filters essential
- Compact rows
- Entity-based grouping common

---

### Enterprise (1,000+ Documents)

- Virtualized table
- Bulk actions (download, archive)
- Read-only permission layers common

---

## 8. Empty & Edge States

### No Documents Yet

- Clear CTA to upload first document
- Explanation of supported types

---

### Missing Signatures

- Subtle warning indicators
- No blocking UI

---

## 9. Accessibility & Performance

- Keyboard navigable rows
- Screen-reader friendly status labels
- Virtualized lists for large datasets
- No blocking animations

---

## 10. Data Model (Simplified)

```ts
Document {
  id
  name
  type
  status
  relatedEntityType // property | unit | tenant | lease
  relatedEntityId
  uploadedAt
  signedAt?
  fileUrl
}
```

---

## What Is Explicitly Excluded

- ❌ Full document editing
- ❌ Version diffing UI
- ❌ Workflow automation
- ❌ Legal guidance or compliance advice

---

## One-Line Definition

> **The Documents page is a source‑of‑record library—not a document workflow engine.**

---

_End of documents-page-plan.md_
