# Tech Stack Plan – Rental Property Management SaaS

> **Purpose:** Define a production‑grade B2B SaaS tech stack that follows enterprise best practices while explicitly supporting **Vite, GSAP, Three.js, Barba.js, and Lenis** without architectural friction.

---

## Core Principles

- Enterprise‑acceptable defaults
- Strong typing end‑to‑end
- Clear separation of concerns (data, UI, animation)
- Progressive enhancement for motion and 3D
- Scales from MVP → large portfolios without rewrites

---

## 1. Frontend Application Layer

### Framework

**React + TypeScript**

- Industry‑standard for B2B SaaS
- Mature ecosystem
- Strong typing and long‑term maintainability

---

### Build Tooling

**Vite**

- Fast local dev and HMR
- Native ESM
- Excellent compatibility with GSAP and Three.js

```
React + TypeScript + Vite
```

---

## 2. UI, Styling, and Design System

### Styling

**Tailwind CSS**

- Token‑driven styling
- Enables dense B2B layouts
- Pairs well with design tokens

---

### Component System

**shadcn/ui (Radix‑based)**

- Accessibility by default
- No vendor lock‑in
- Full Tailwind control

---

### Design Tokens

- CSS variables (`:root`)
- Synced from Figma
- Supports light/dark/brand themes

---

## 3. Motion, Navigation, and Interaction

### Routing

**React Router**

- Owns application state and routing truth
- Predictable URL handling

---

### Page Transitions

**Barba.js**

- App‑like visual transitions
- Route‑aware animation hooks

**Rule:**

```
React Router = routing truth
Barba.js = visual transition layer
```

Barba never controls data fetching or business logic.

---

### Animation Engine

**GSAP**

- Micro‑interactions
- Page transitions
- Data‑driven animations

**Best Practice:**

- Centralized animation orchestration layer
- No uncontrolled GSAP timelines inside components

---

### Scrolling

**Lenis**

- Smooth scrolling
- Scroll velocity access
- Integrates with GSAP ScrollTrigger

**Rules:**

- Disabled in data‑dense tables
- Enabled for dashboard and presentation surfaces

---

## 4. 3D and Advanced Visuals

### 3D Engine

**Three.js**

**Permitted Uses:**

- Ambient visuals
- Hero moments
- Optional data visualization

**Hard Rules:**

- Never blocks workflows
- Never required to complete tasks
- No 3D inside forms or tables

---

### Integration Pattern

- Vanilla Three.js for isolated canvases
- React Three Fiber optional but not required

---

## 5. State and Data Management

### Server State

**TanStack Query**

- Cache‑first architecture
- Automatic refetching
- Ideal for dashboards and lists

---

### Client / UI State

**Zustand**

- Lightweight
- Predictable
- No Redux boilerplate

```
Server State → TanStack Query
UI / Ephemeral State → Zustand
```

---

## 6. Backend Architecture

### Runtime

**Node.js + TypeScript**

- Shared language with frontend
- End‑to‑end typing

---

### Framework

**NestJS**

- Opinionated structure
- Built‑in guards and interceptors
- Enterprise‑friendly

---

## 7. Database and Persistence

### Primary Database

**PostgreSQL**

- Strong relational guarantees
- Required for leases, payments, accounting

---

### ORM

**Prisma**

- Type‑safe queries
- Clean migrations
- Works well with Postgres at scale

---

### Caching & Realtime

- **Redis** – caching, queues, rate limits
- **WebSockets or SSE** – payments, maintenance, action queue updates

---

## 8. Authentication, Authorization, Compliance

### Authentication

**Auth.js**

- Email + OAuth
- MFA support
- B2B org‑aware auth flows

---

### Authorization

- Role‑based access control (RBAC)
- Row‑level permissions (tenant vs owner vs staff)

---

### Compliance Readiness

- SOC2‑friendly architecture
- Immutable financial records
- Audit logs

---

## 9. Payments and Financial Systems

### Payments

**Stripe**

- Rent collection
- Fees
- Payouts
- Webhook‑driven events

---

### Accounting Exports

- CSV exports
- QuickBooks / Xero integrations (later phase)

---

## 10. File Storage and Documents

### Storage

**S3‑Compatible Storage** (AWS S3 or Cloudflare R2)

- Lease documents
- Inspection photos
- Notices

---

### Document Signing

- DocuSign or HelloSign
- Signed PDFs stored as immutable artifacts

---

## 11. Infrastructure and Deployment

### Hosting

**Frontend**

- Vercel or Cloudflare Pages

**Backend**

- AWS (ECS / Lambda) or Fly.io

---

### CI / CD

- GitHub Actions
- Lint → Test → Build → Deploy

---

## 12. Observability and Quality

- **Sentry** – frontend & backend error tracking
- **PostHog** – product analytics (non‑marketing)
- **LogRocket** (optional) – selective session replay

---

## 13. Frontend Folder Structure

```
src/
├── app/            # routing & app shell
├── components/     # shared UI components
├── features/       # domain‑driven features
├── services/       # api, auth, payments
├── animations/     # GSAP + Barba orchestration
├── three/          # isolated Three.js scenes
├── state/          # Zustand stores
├── styles/         # tokens, globals
└── utils/
```

---

## 14. Non‑Negotiable Guardrails

- Animations never block data
- Barba.js handles visuals only
- Lenis disabled for dense operational tables
- Three.js always optional
- Dashboard loads fast before animations

---

## Stack Summary

```
Frontend:  React + Vite + TypeScript
UI:        Tailwind CSS + shadcn/ui
State:     TanStack Query + Zustand
Motion:    GSAP + Barba.js + Lenis
3D:        Three.js (isolated)
Backend:   NestJS + PostgreSQL + Prisma
Auth:      Auth.js + RBAC
Payments:  Stripe
Infra:     Vercel + AWS / Fly.io
```

---

_End of tech-stack-plan.md_
