# App / Tenant Frontend Segmentation – Implementation Plan

## Objective

Introduce a clean, scalable separation between:

- **Property Management users (operators)**
- **Tenants**

…without rewriting existing code, while preserving shared primitives and enabling future expansion (tenant subdomain, mobile apps, white-label portals).

This plan assumes the current codebase is **operator-focused** and built with **Vite + React + TypeScript**.

---

## High-Level Strategy

- Keep a **single app repo** (`rentaru`)
- Introduce **explicit namespaces** inside `src/`
- Enforce separation via **routing + layouts**
- Keep shared primitives centralized
- Avoid conditional role rendering inside components

---

## Target Folder Structure

```txt
src/
  app/                     # Operator (Property Management) experience
    layouts/
      AppLayout.tsx
    pages/
      Dashboard.tsx
      Properties.tsx
      Tenants.tsx
      Units.tsx
      Maintenance.tsx
    routes.tsx
    nav.config.ts

  tenant/                  # Tenant experience (greenfield)
    layouts/
      TenantLayout.tsx
    pages/
      Home.tsx
      Payments.tsx
      Maintenance.tsx
      Leases.tsx
    routes.tsx
    nav.config.ts

  shared/                  # Role-agnostic primitives
    components/
    lib/
    services/
    hooks/
    types/
    styles/
    fonts/
    images/

  App.tsx
  main.tsx
Migration Plan (Minimal Churn)
1. Move Operator Pages
diff
Copy code
- src/pages/*
+ src/app/pages/*
No behavioral changes — purely structural.

2. Introduce src/tenant/ (Empty Initial State)
Create tenant folder structure

Do not reuse operator pages

Tenant UI starts intentionally small

3. Consolidate Shared Primitives
Move or alias existing folders into shared/:

txt
Copy code
components → shared/components
lib        → shared/lib
services   → shared/services
types      → shared/types
scss       → shared/styles
fonts      → shared/fonts
images     → shared/images
Rule of thumb
Shared: doesn’t know the user role

App/Tenant: renders role-specific UX

Routing Architecture
App Entry (App.tsx)
tsx
Copy code
<Routes>
  <Route path="/app/*" element={<AppLayout />}>
    {appRoutes}
  </Route>

  <Route path="/tenant/*" element={<TenantLayout />}>
    {tenantRoutes}
  </Route>

  <Route path="*" element={<Navigate to="/app" />} />
</Routes>
Operator Routes (src/app/routes.tsx)
tsx
Copy code
export const appRoutes = (
  <>
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="properties" element={<Properties />} />
    <Route path="tenants/:id" element={<TenantDetail />} />
  </>
);
Tenant Routes (src/tenant/routes.tsx)
tsx
Copy code
export const tenantRoutes = (
  <>
    <Route path="home" element={<TenantHome />} />
    <Route path="payments" element={<Payments />} />
    <Route path="maintenance" element={<TenantMaintenance />} />
  </>
);
Layout Separation (Required)
App Layout (AppLayout.tsx)
Sidebar navigation

Dense data views

Power-user affordances

Desktop-first

Tenant Layout (TenantLayout.tsx)
Mobile-first

Simplified navigation

Reduced surface area

Softer visual language

Layouts must never be shared.

Authentication & Guards
Auth logic lives in shared/services/auth

Role enforcement happens at layout level

tsx
Copy code
<AppLayout>
  <RequireRole role="ORG" />
</AppLayout>
tsx
Copy code
<TenantLayout>
  <RequireRole role="TENANT" />
</TenantLayout>
Navigation Ownership
Each namespace owns its own navigation:

txt
Copy code
src/app/nav.config.ts
src/tenant/nav.config.ts
No shared nav state.

Explicit Non-Goals
❌ No role-based conditional rendering inside components
❌ No shared layouts
❌ No /app/tenant nesting
❌ No delaying tenant separation “until later”

Future-Proofing
This structure enables:

tenant.rentaru.co without refactors

Native tenant mobile apps

White-labeled tenant portals

Independent release cadence per surface
```
