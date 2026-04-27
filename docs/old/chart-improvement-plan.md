# chart-improvement-plan.md

## Goal

Refine the Financial Overview chart to improve clarity, hierarchy, and perceived trustworthiness while preserving the multi-metric insight density.

---

## Overall Assessment

- **Data model:** Correct
- **Primary issue:** Visual hierarchy and metric separation
- **Risk:** Mixed units ($ vs index) visually compete, causing ambiguity

---

## Core Improvements

### 1. Separate Metric Planes

**Problem:** Risk Pressure Line shares visual space with dollar-based stacked areas.

**Fix options (choose one):**

- Add a **right-side Y-axis** for Risk Pressure (index-based).
- Move Risk Pressure into a **thin top sparkline panel** sharing the same X-axis.
- Reduce chart height of Risk Pressure and visually decouple via spacing.

**Result:** Immediate mental separation of “financial volume” vs “financial risk.”

---

### 2. Rebalance Stacked Area Dominance

**Problem:** Collected (green) visually overwhelms other layers.

**Actions:**

- Reduce saturation and gradient intensity on Collected.
- Flatten fill (minimal gradient, low visual noise).
- Increase contrast on non-collected layers.

**Result:** Problem states remain visible and interpretable.

---

### 3. Improve Color Semantics

**Current issues:**

- Overdue (yellow) and Vacancy (red) feel too similar in weight.
- Pending (blue) is too visually quiet.

**Adjustments:**

- Make Vacancy the most visually aggressive (deeper red).
- Slightly desaturate Overdue yellow.
- Increase brightness or edge definition on Pending.
- Keep Collected muted and stable.

**Result:** Color hierarchy matches business severity.

---

### 4. Increase Sharpness & Financial “Crispness”

**Problem:** Soft gradients and blur reduce trust.

**Actions:**

- Reduce blur and glow on stacked areas.
- Sharpen layer edges.
- Use subtle but crisp top-edge strokes per stack.
- Introduce ultra-light gridlines (5–8% opacity).

**Result:** Chart feels precise, analytical, and enterprise-grade.

---

### 5. Strengthen Hierarchy & Focus

**Risk Pressure Line Enhancements:**

- Increase stroke weight slightly.
- Add soft glow or highlight to nodes only.
- Ensure it is always visually readable above stacks.

**Stacked Area Enhancements:**

- Only emphasize **top contours**, not internal boundaries.
- Fade non-hovered layers on interaction.

---

### 6. Improve Legend-to-Chart Mapping

**Problem:** Legend requires cognitive effort to map.

**Solutions:**

- Match legend ordering to visual stack order.
- Add subtle hover linking (legend hover highlights layer).
- Consider inline micro-labels on stack peaks.

---

## Insight Layer (Optional but High Value)

### Contextual Annotations

- Inline callouts for:
  - Vacancy increase
  - Overdue spikes
  - Risk Pressure inflection points

Example:

> “↑ Vacancy pressure entering January”

---

## Advanced / Optional Enhancements

- Toggle:
  - Absolute values ($)
  - Percentage of Expected Rent
- Hover isolation mode (fade others to 20%)
- Smooth animated transitions between time ranges
- Compact mobile variant with:
  - Risk Pressure sparkline only
  - One dominant financial metric at a time

---

## Success Criteria

- Risk vs revenue metrics are immediately distinguishable
- Problem states remain readable at a glance
- Chart feels premium, stable, and decision-oriented
- No single layer visually dominates without intent

---
