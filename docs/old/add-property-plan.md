# Add Property Plan

Purpose:  
Create a **non-bloated, future-proof property creation flow** that works for landlords with 1 unit and scales cleanly to professional property managers with hundreds or thousands of units.

This plan defines **UX flow, data requirements, logic, and visual structure**.

---

## High-Level UX Decision

**Pattern:** Full-page wizard with modal-like focus  
**Route:** `/properties/new`  
**Stateful:** URL + internal draft state  
**Autosave:** Per-step (recommended)

**Why**
- Property is a core system object
- Requires structured, multi-step data
- Must scale without redesign
- Avoids modal dismissal risk

---

## Page-Level Visual Structure

### Layout
- App shell remains mounted
- Left sidebar dimmed or visually de-emphasized
- Centered card container
  - Max width: 960–1100px
  - Elevated surface (card or sheet)
- Persistent step header

