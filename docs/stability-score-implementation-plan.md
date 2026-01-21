# Stability Score — Implementation Plan

## Overview

**Stability** is a 0–100 composite health score that represents how predictable, resilient, and low-risk a property or portfolio’s cash flow is over time. It compresses multiple financial signals into a single, trend-aware metric suitable for dashboards, comparisons, and alerts.

Higher score = steadier income, fewer surprises.

---

## What Stability Represents (User-Facing Definition)

Stability reflects:

- Consistency of net cash flow
- Reliability of rent collection
- Predictability of expenses
- Impact of vacancy
- Direction and volatility of overall financial risk

---

## Score Range & Meaning

| Score  | Meaning                 |
| ------ | ----------------------- |
| 80–100 | Very stable             |
| 60–79  | Stable, manageable risk |
| 40–59  | Watchlist               |
| <40    | Unstable                |

---

## Calculation Model (Composite Index)

**Final Stability Score = weighted sum of 5 normalized sub-scores**

All sub-scores are normalized to **0–100**, then weighted.

### Weight Breakdown

| Component              | Weight   |
| ---------------------- | -------- |
| Cash Flow Volatility   | 30%      |
| Collection Reliability | 25%      |
| Expense Predictability | 20%      |
| Vacancy Pressure       | 15%      |
| Risk Pressure Trend    | 10%      |
| **Total**              | **100%** |

---

## Sub-Score Definitions

### 1. Cash Flow Volatility (30%)

**Purpose:** Measure how consistent net cash flow is.

**Inputs**

- Monthly Net Cash Flow over selected period (1M / 3M / 6M / YTD)

**Method**

- Calculate coefficient of variation (CV):  
  `stddev(net_cash_flow) ÷ mean(net_cash_flow)`
- Invert and normalize (lower volatility → higher score)

**Output**

- 0–100 volatility stability score

---

### 2. Collection Reliability (25%)

**Purpose:** Measure how reliably rent is collected.

**Inputs**

- Collected
- Pending
- Overdue

**Formula**
Collection Rate = Collected ÷ (Collected + Pending + Overdue)

**Adjustments**

- Penalize months with spikes in Overdue
- Smooth using rolling average across time window

**Output**

- 0–100 reliability score

---

### 3. Expense Predictability (20%)

**Purpose:** Detect surprise or unstable expenses.

**Inputs**

- Expense Burn %
- Maintenance spend over time

**Method**

- Measure variance of Expense Burn %
- Compare Maintenance vs baseline (planned average)
- Higher variance or unplanned spikes reduce score

**Output**

- 0–100 predictability score

---

### 4. Vacancy Pressure (15%)

**Purpose:** Capture income loss risk from vacancy.

**Inputs**

- Vacancy dollar amount
- Potential rent

**Formula**
Vacancy Ratio = Vacancy ÷ Potential Rent

**Adjustments**

- Smoothed over time
- Penalize sudden vacancy increases

**Output**

- 0–100 vacancy stability score  
  (Lower vacancy → higher score)

---

### 5. Risk Pressure Trend (10%)

**Purpose:** Detect directional financial risk.

**Inputs**

- Risk Pressure Line values over time

**Method**

- Calculate slope (trend direction)
- Measure variance (smooth vs erratic)
- Rising or volatile risk pressure reduces score

**Output**

- 0–100 trend stability score

---

## Normalization Strategy

- Each sub-score normalized using:
  - Portfolio historical benchmarks **or**
  - Market-level defaults (if portfolio too small)
- Clamp all scores between 0–100
- Apply weights and sum

Stability =
(CF_Volatility _ 0.30) +
(Collection _ 0.25) +
(Expense _ 0.20) +
(Vacancy _ 0.15) +
(Risk_Trend \* 0.10)

---

## Time Range Awareness

Changing the selected range (1M / 3M / 6M / YTD):

- Recalculates all volatility, averages, and trends
- Produces different Stability values for short-term vs long-term health

---

## UI / UX Notes

- Display as a **single integer (0–100)**
- Optional micro-trend indicator (↑ ↓ →)
- Tooltip explains definition, not math
- Advanced breakdown available via drill-in

---

## Tooltip Copy (Final)

> **Stability** is a 0–100 health score showing how predictable and resilient your cash flow is over time. It combines rent reliability, expense consistency, vacancy impact, and financial risk trends into one signal. Higher scores mean steadier income with fewer surprises.

---

## Future Enhancements

- Property-weighted aggregation
- Seasonal normalization
- Alert thresholds tied to Stability drops
- Forecasted Stability projection

---
