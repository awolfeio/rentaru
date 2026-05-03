# Rentaru — Backend Data Storage Plan

## Context

The app is a fully-typed React SaaS (dual operator + tenant interfaces) with comprehensive UI and mock data, but no backend. Everything in `/src/shared/services/` is empty and all data comes from `/src/shared/mockData/`. The goal is to design where and how real user data should live — leases, images, documents, payments, messages, and everything else — so that implementation can proceed in prioritized phases without breaking the existing UI.

---

## Platform: Supabase

**Recommendation: Supabase (PostgreSQL + Auth + Storage + Realtime)**

**Why not Firebase:** The data model is deeply relational (Properties → Units → Leases → Tenants → Payments). Firestore fights this shape — cross-collection joins are client-side waterfalls. PostgreSQL joins are the right tool.

**Why not custom Node.js backend:** Supabase provides auth, RLS, storage, realtime, and a typed REST API without building any infrastructure. With a static GitHub Pages frontend, you need a hosted service — Supabase is the fastest path from zero to production.

**Why Supabase specifically:**

- `supabase-js` v2 + React Query v5 is a well-documented, well-trodden pattern
- Row-Level Security enforces multi-tenant data isolation at the database level
- Realtime Postgres Changes subscriptions satisfy the real-time requirement for messages and maintenance
- Storage buckets with signed URLs handle lease PDFs, maintenance photos, and property images
- Auth supports email/password, Google OAuth, and magic links (tenant invite flow)
- Free tier covers development; Pro ($25/mo) covers production

---

## Database Schema

### Build Order & Priority

| Priority | Domain                   | Tables                                                                                                |
| -------- | ------------------------ | ----------------------------------------------------------------------------------------------------- |
| 1        | Auth & Org               | `profiles`, `organizations`, `memberships`, `membership_roles`, `roles`, `membership_property_scopes` |
| 2        | Properties & Units       | `properties`, `units`                                                                                 |
| 3        | Tenants & Leases         | `tenants`, `leases`                                                                                   |
| 4        | Payments                 | `payments`, `payment_attachments`, `monthly_financial_summaries`                                      |
| 5        | Maintenance              | `maintenance_tickets`, `maintenance_requests`, `maintenance_messages`, `maintenance_media`, `vendors` |
| 6        | Messages & Documents     | `message_threads`, `thread_participants`, `messages`, `message_attachments`, `documents`              |
| 7        | Notifications & Activity | `notification_preferences`, `notification_log`, `tenant_activity_log`, `tenant_household`             |

### Naming Conventions

- All tables: `snake_case`, plural
- All IDs: `uuid` using `gen_random_uuid()` as default
- All timestamps: `timestamptz`, not `text`
- Soft deletes: `deleted_at timestamptz` on mutable entities

### Priority 1 — Auth & Org Foundation

```sql
create table organizations (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text unique not null,
  plan        text not null default 'free',
  settings    jsonb not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);

-- Extends Supabase auth.users — one row per authenticated user
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  email       text not null,
  name        text not null default '',
  avatar_url  text,
  status      text not null default 'active',
  last_active timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create table roles (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid references organizations(id) on delete cascade,
  name            text not null,
  description     text not null default '',
  permissions     text[] not null default '{}',
  is_system       boolean not null default false,
  created_at      timestamptz not null default now(),
  unique (organization_id, name)
);

create table memberships (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references profiles(id) on delete cascade,
  organization_id uuid not null references organizations(id) on delete cascade,
  status          text not null default 'active',  -- 'invited'|'active'|'suspended'
  invited_at      timestamptz,
  invite_token    text unique,
  invite_expires_at timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (user_id, organization_id)
);

create table membership_roles (
  membership_id uuid not null references memberships(id) on delete cascade,
  role_id       uuid not null references roles(id) on delete cascade,
  primary key (membership_id, role_id)
);

-- Per-membership property access scoping
create table membership_property_scopes (
  membership_id uuid not null references memberships(id) on delete cascade,
  property_id   uuid not null,  -- FK added after properties table
  primary key (membership_id, property_id)
);
```

### Priority 2 — Properties & Units

```sql
create table properties (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  address_line1   text not null,
  address_line2   text,
  city            text not null,
  state           text not null,
  zip             text not null,
  country         text not null default 'US',
  address_full    text generated always as (address_line1 || ', ' || city || ', ' || state || ' ' || zip) stored,
  cover_image_url text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

create table units (
  id              uuid primary key default gen_random_uuid(),
  property_id     uuid not null references properties(id) on delete cascade,
  organization_id uuid not null references organizations(id),
  number          text not null,
  floor           text,
  bedrooms        numeric(3,1),
  bathrooms       numeric(3,1),
  sqft            integer,
  base_rent       numeric(10,2),
  status          text not null default 'vacant',  -- 'occupied'|'vacant'|'maintenance'
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz,
  unique (property_id, number)
);
```

### Priority 3 — Tenants & Leases

Key design: `tenants` are people (not users). A tenant may or may not have a portal account. `tenants.portal_user_id` links them once they accept an invite.

```sql
create table tenants (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  portal_user_id  uuid references profiles(id) on delete set null,
  name            text not null,
  email           text not null,
  phone           text,
  status          text not null default 'active',
  tags            text[] not null default '{}',
  communication_status  text not null default 'never_contacted',
  portal_status         text not null default 'never_logged_in',
  document_status       text not null default 'missing_docs',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

-- A lease ties a tenant to a unit. Historical leases are kept.
-- Only one active lease per unit enforced by partial unique index.
create table leases (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  tenant_id       uuid not null references tenants(id) on delete restrict,
  unit_id         uuid not null references units(id) on delete restrict,
  property_id     uuid not null references properties(id),
  status          text not null default 'active',
  start_date      date not null,
  end_date        date not null,
  move_in_date    date,
  move_out_date   date,
  rent_amount     numeric(10,2) not null,
  security_deposit numeric(10,2) not null default 0,
  late_fee_amount numeric(10,2) not null default 0,
  late_fee_grace_days integer not null default 5,
  renewal_status  text,
  renewal_offered_at timestamptz,
  lease_document_url text,
  signed_at       timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create unique index uq_active_lease_per_unit
  on leases(unit_id) where status in ('active', 'month_to_month', 'signed_not_started');
```

### Priority 4 — Payments

```sql
create table payments (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  tenant_id       uuid references tenants(id) on delete set null,
  lease_id        uuid references leases(id) on delete set null,
  unit_id         uuid references units(id) on delete set null,
  property_id     uuid references properties(id) on delete set null,
  amount          numeric(10,2) not null,
  type            text not null default 'rent',    -- 'rent'|'fee'|'adjustment'
  status          text not null default 'pending', -- 'paid'|'pending'|'failed'|'late'|'tentative'|'voided'
  date            date not null,
  method          text not null,
  origin          text not null default 'manual',  -- 'processor'|'manual'
  processor_ref   text,
  last4           text,
  manual_ref      text,
  manual_source_label text,
  payer_name      text,
  payer_type      text,
  notes           text,
  failure_reason  text,
  next_retry_date date,
  created_by      uuid references profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create table payment_attachments (
  id          uuid primary key default gen_random_uuid(),
  payment_id  uuid not null references payments(id) on delete cascade,
  file_url    text not null,
  file_name   text not null,
  mime_type   text not null,
  size_bytes  bigint,
  uploaded_by uuid references profiles(id) on delete set null,
  created_at  timestamptz not null default now()
);

-- Aggregated monthly summaries for the FinancialPanel / stability score
-- Updated nightly by a scheduled Edge Function
create table monthly_financial_summaries (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  month           date not null,       -- always first-of-month: '2025-01-01'
  collected       numeric(12,2) not null default 0,
  pending         numeric(12,2) not null default 0,
  overdue         numeric(12,2) not null default 0,
  vacancy_loss    numeric(12,2) not null default 0,
  maintenance_cost numeric(12,2) not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique (organization_id, month)
);
```

### Priority 5 — Maintenance

```sql
create table vendors (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  name            text not null,
  category        text,
  phone           text,
  email           text,
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  deleted_at      timestamptz
);

-- Manager/system created tickets (MaintenanceTicket type)
create table maintenance_tickets (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  property_id     uuid not null references properties(id),
  unit_id         uuid references units(id),
  tenant_id       uuid references tenants(id) on delete set null,
  title           text not null,
  description     text not null default '',
  category        text not null,
  urgency         text not null default 'routine',
  status          text not null default 'open',
  reporter_type   text not null default 'manager',
  reported_by     text,
  assigned_to_user_id uuid references profiles(id) on delete set null,
  vendor_id       uuid references vendors(id) on delete set null,
  access_permission boolean not null default false,
  preferred_time  text,
  estimated_cost  numeric(10,2),
  actual_cost     numeric(10,2),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  resolved_at     timestamptz
);

-- Tenant-submitted requests (MaintenanceRequest type)
-- ticket_id is null until manager promotes to a formal ticket
create table maintenance_requests (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  unit_id         uuid not null references units(id),
  tenant_id       uuid not null references tenants(id) on delete restrict,
  property_id     uuid not null references properties(id),
  ticket_id       uuid references maintenance_tickets(id) on delete set null,
  title           text not null,
  description     text not null default '',
  category        text not null,
  priority        text not null default 'normal',
  status          text not null default 'submitted',
  allow_entry_without_tenant boolean not null default false,
  preferred_access_times text,
  pets_present    boolean not null default false,
  location_context text,
  issue_type      text,
  sub_issue_detail text,
  appliance_provided_by_property boolean,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  completed_at    timestamptz
);

create table maintenance_media (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  request_id      uuid references maintenance_requests(id) on delete cascade,
  ticket_id       uuid references maintenance_tickets(id) on delete cascade,
  type            text not null default 'image',
  storage_path    text not null,
  public_url      text,
  uploaded_by     text not null default 'tenant',
  uploaded_by_id  uuid references profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  check (request_id is not null or ticket_id is not null)
);

create table maintenance_messages (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  request_id      uuid not null references maintenance_requests(id) on delete cascade,
  sender_type     text not null,   -- 'tenant'|'manager'|'vendor'|'system'
  sender_id       uuid references profiles(id) on delete set null,
  message         text not null,
  created_at      timestamptz not null default now()
);
```

### Priority 6 — Messages & Documents

```sql
create table message_threads (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  subject         text not null,
  primary_entity_type text,  -- 'maintenance'|'lease'|'payment'|'unit'
  primary_entity_id   uuid,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  last_message_at timestamptz,
  archived_at     timestamptz
);

create table thread_participants (
  thread_id uuid not null references message_threads(id) on delete cascade,
  user_id   uuid not null references profiles(id) on delete cascade,
  unread_count integer not null default 0,
  last_read_at timestamptz,
  primary key (thread_id, user_id)
);

create table messages (
  id          uuid primary key default gen_random_uuid(),
  thread_id   uuid not null references message_threads(id) on delete cascade,
  sender_id   uuid not null references profiles(id) on delete restrict,
  sender_type text not null default 'staff',  -- 'tenant'|'staff'|'system'
  body        text not null,
  created_at  timestamptz not null default now(),
  edited_at   timestamptz
);

create table message_attachments (
  id           uuid primary key default gen_random_uuid(),
  message_id   uuid not null references messages(id) on delete cascade,
  storage_path text not null,
  file_name    text not null,
  mime_type    text not null,
  size_bytes   bigint,
  created_at   timestamptz not null default now()
);

create table documents (
  id                  uuid primary key default gen_random_uuid(),
  organization_id     uuid not null references organizations(id),
  name                text not null,
  type                text not null,   -- 'lease'|'notice'|'report'|'invoice'|'other'
  status              text not null default 'draft',
  related_entity_type text,
  related_entity_id   uuid,
  size_bytes          bigint,
  storage_path        text not null,
  public_url          text,
  mime_type           text not null,
  uploaded_by         uuid references profiles(id) on delete set null,
  signed_at           timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted_at          timestamptz
);
```

### Priority 7 — Notifications & Activity

```sql
create table notification_preferences (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references profiles(id) on delete cascade,
  category_id   text not null,
  enabled       boolean not null default true,
  channel_app   boolean not null default true,
  channel_email boolean not null default true,
  channel_sms   boolean not null default false,
  channel_push  boolean not null default false,
  severity      text,
  unique (user_id, category_id)
);

create table notification_log (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references profiles(id) on delete cascade,
  category_id text not null,
  channel     text not null,
  title       text not null,
  body        text not null,
  entity_type text,
  entity_id   uuid,
  read_at     timestamptz,
  sent_at     timestamptz not null default now()
);

create table tenant_activity_log (
  id              uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id),
  tenant_id       uuid not null references tenants(id) on delete cascade,
  type            text not null,
  description     text not null,
  actor_id        uuid references profiles(id) on delete set null,
  actor_label     text,
  metadata        jsonb,
  created_at      timestamptz not null default now()
);

create table tenant_household (
  id        uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references tenants(id) on delete cascade,
  name      text not null,
  role      text not null,  -- 'co-tenant'|'occupant'|'emergency'
  relation  text,
  phone     text,
  email     text,
  created_at timestamptz not null default now()
);
```

---

## File Storage Strategy

### Bucket Structure

```
supabase-storage/
  org-assets/           -- PRIVATE. Signed URLs only.
    {org_id}/
      properties/
        {property_id}/
          cover.jpg
          gallery/{uuid}.jpg
      documents/
        {entity_type}/{entity_id}/
          {document_id}_{slug}.pdf
      maintenance/
        requests/{request_id}/{media_id}.jpg
        tickets/{ticket_id}/{media_id}.jpg
      payments/
        receipts/{payment_id}/{attachment_id}.pdf

  tenant-uploads/       -- PRIVATE. Tenant-scoped folder.
    {tenant_id}/
      maintenance/{request_id}/{uuid}.jpg

  avatars/              -- PUBLIC.
    {user_id}/avatar.jpg
```

### URL Policy

- **Never store full URLs** in the DB. Store `storage_path` and generate 1-hour signed URLs at query time via `supabase.storage.from('org-assets').createSignedUrl(path, 3600)`.
- `public_url` column is only populated for genuinely public files (avatars, public property cover photos).
- Lease PDFs must always use signed URLs — never public.

---

## Auth Strategy

### Two Actor Types

**Manager/Staff** (`/app/*`)

1. Email/password or Google OAuth at `/login`.
2. App reads `memberships` for org, roles, and property scope.
3. Zustand `authStore` holds `{ session, profile, orgId, roles, propertyScope }`.

**Tenant** (`/tenant/*`)

1. Manager sends invite → magic link email generated.
2. Tenant clicks link → Supabase magic-link auth → `tenants.portal_user_id` is set.
3. JWT custom claim `{ "app_role": "tenant", "tenant_id": "...", "org_id": "..." }` is injected via a Supabase Auth hook function.
4. Tenant portal route guard checks `app_role === 'tenant'`.

### JWT Custom Claims (Supabase Auth Hook)

```sql
create or replace function public.custom_jwt_claims(event jsonb)
returns jsonb language plpgsql as $$
declare
  user_id uuid := (event->>'userId')::uuid;
  tenant_rec record;
  membership_rec record;
begin
  select t.id, t.organization_id into tenant_rec
    from tenants t
   where t.portal_user_id = user_id and t.deleted_at is null limit 1;

  if found then
    return jsonb_build_object('app_role', 'tenant', 'tenant_id', tenant_rec.id, 'org_id', tenant_rec.organization_id);
  end if;

  select m.organization_id into membership_rec
    from memberships m
   where m.user_id = user_id and m.status = 'active' limit 1;

  if found then
    return jsonb_build_object('app_role', 'staff', 'org_id', membership_rec.organization_id);
  end if;

  return '{}'::jsonb;
end;
$$;
```

---

## Row-Level Security

### Core Helper Functions

```sql
create or replace function auth.org_id() returns uuid language sql stable as $$
  select (auth.jwt() -> 'app_metadata' ->> 'org_id')::uuid;
$$;

create or replace function auth.tenant_id() returns uuid language sql stable as $$
  select (auth.jwt() -> 'app_metadata' ->> 'tenant_id')::uuid;
$$;

create or replace function auth.is_staff_in_org(org_id uuid) returns boolean language sql stable as $$
  select exists (
    select 1 from memberships m
     where m.user_id = auth.uid() and m.organization_id = org_id and m.status = 'active'
  );
$$;

create or replace function auth.has_permission(org_id uuid, perm text) returns boolean language sql stable as $$
  select exists (
    select 1 from memberships m
      join membership_roles mr on mr.membership_id = m.id
      join roles r on r.id = mr.role_id
     where m.user_id = auth.uid() and m.organization_id = org_id
       and m.status = 'active' and perm = any(r.permissions)
  );
$$;
```

### Key RLS Rules

| Table                  | Staff access                                          | Tenant access                                   |
| ---------------------- | ----------------------------------------------------- | ----------------------------------------------- |
| `organizations`        | Read own org; update if `manage_settings`             | No access                                       |
| `properties`           | Read if in org + scoped; write if `manage_properties` | No access                                       |
| `tenants`              | Read all in org; write if `manage_tenants`            | Read own row only                               |
| `leases`               | Read all in org; write if `manage_leases`             | Read own lease only                             |
| `payments`             | Read/write if `view_financials`                       | Read own payments only                          |
| `maintenance_requests` | Read all in org; manage if `view_ticket`              | Read/create own requests                        |
| `maintenance_messages` | Read all in org                                       | Read/insert on own request's thread             |
| `documents`            | Read/write if `manage_documents`                      | Read docs where `related_entity_id = tenant_id` |

---

## Service Layer Structure

```
src/
  shared/
    services/
      supabase.ts              -- client singleton + DB type import
      auth.service.ts          -- sign in, sign out, session, invite
      organizations.service.ts
      properties.service.ts    -- CRUD for properties + units
      tenants.service.ts       -- CRUD, filters, portal invite
      leases.service.ts
      payments.service.ts
      maintenance.service.ts   -- tickets + requests + messages + media upload
      messages.service.ts      -- threads + messages + read receipts
      documents.service.ts     -- upload, list, signed URLs
      financials.service.ts    -- monthly summaries + dashboard aggregates
      notifications.service.ts
      storage.service.ts       -- signed URL helpers, upload wrappers
      users.service.ts         -- memberships, roles, invites
    hooks/
      useAuth.ts               -- Zustand auth slice + React Query session
      useOrg.ts                -- current org context
    lib/
      queryKeys.ts             -- hierarchical React Query key factory (NEW)
```

### `supabase.ts` Pattern

```typescript
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./database.types"; // generated by supabase CLI

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
```

### React Query Key Factory (`src/shared/lib/queryKeys.ts`)

```typescript
export const queryKeys = {
  session: () => ["session"] as const,
  properties: {
    all: (orgId: string) => ["properties", orgId] as const,
    detail: (orgId: string, propId: string) =>
      ["properties", orgId, propId] as const,
    units: (orgId: string, propId: string) =>
      ["properties", orgId, propId, "units"] as const,
  },
  tenants: {
    all: (orgId: string) => ["tenants", orgId] as const,
    filtered: (orgId: string, filters: TenantFilterState) =>
      ["tenants", orgId, "filtered", filters] as const,
    detail: (orgId: string, tenantId: string) =>
      ["tenants", orgId, tenantId] as const,
    payments: (orgId: string, tenantId: string) =>
      ["tenants", orgId, tenantId, "payments"] as const,
  },
  leases: { all: (orgId: string) => ["leases", orgId] as const },
  payments: { all: (orgId: string) => ["payments", orgId] as const },
  maintenance: {
    tickets: (orgId: string) => ["maintenance", orgId, "tickets"] as const,
    requests: (orgId: string) => ["maintenance", orgId, "requests"] as const,
    messages: (orgId: string, reqId: string) =>
      ["maintenance", orgId, "requests", reqId, "messages"] as const,
  },
  threads: (orgId: string) => ["threads", orgId] as const,
  documents: (orgId: string) => ["documents", orgId] as const,
  financialSummary: (orgId: string) => ["financial", orgId, "summary"] as const,
  notificationPrefs: (userId: string) =>
    ["notifications", userId, "prefs"] as const,
};
```

---

## Migration Path (Mock → Real, Incremental)

Each phase replaces one domain of mock data without breaking the UI. Guard with `VITE_USE_MOCK=true` for development.

| Phase                        | Work                                                                    | Key Files Changed                                                                           |
| ---------------------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| **0 — Foundation**           | Supabase project, DDL, type generation, real auth, QueryClientProvider  | `LoginPage.tsx`, `App.tsx`, `supabase.ts` (new)                                             |
| **1 — Properties**           | Seed mock data, implement `properties.service.ts`, replace mock imports | `Properties.tsx`, `SingleProperty.tsx`, `UnitDetails.tsx`, `AddProperty.tsx`, `AddUnit.tsx` |
| **2 — Tenants & Leases**     | Seed data, implement services, replace MOCK_TENANTS imports             | `Tenants.tsx`, `TenantProfile.tsx`, `Leases.tsx`, `TenantFilterDrawer.tsx`                  |
| **3 — Payments**             | Implement service, wire `RecordManualPaymentDrawer` mutation            | `Payments.tsx`, `RecordManualPaymentDrawer.tsx`                                             |
| **4 — Maintenance**          | Implement service, wire Realtime for messages                           | `Maintenance.tsx` (app + tenant), `CreateRequestWizard.tsx`, `CreateTicketModal.tsx`        |
| **5 — Messages & Documents** | Implement services, wire Storage uploads                                | `Messages.tsx`, `Documents.tsx` (app + tenant)                                              |
| **6 — Financial Dashboard**  | Replace `financial-data.ts` with `monthly_financial_summaries` query    | `FinancialPanel.tsx`, `FinancialReality3D.tsx`, `stability-score.ts`                        |
| **7 — Tenant Portal Auth**   | Implement invite flow, JWT claims hook, tenant route guard              | `TenantLayout.tsx`, `LoginPage.tsx`, tenant pages                                           |

---

## Critical Files to Create / Modify

**Create (new):**

- `src/shared/services/supabase.ts` — client singleton
- `src/shared/services/database.types.ts` — generated by `supabase gen types typescript`
- `src/shared/services/auth.service.ts`
- `src/shared/services/properties.service.ts`
- `src/shared/services/tenants.service.ts`
- `src/shared/services/leases.service.ts`
- `src/shared/services/payments.service.ts`
- `src/shared/services/maintenance.service.ts`
- `src/shared/services/messages.service.ts`
- `src/shared/services/documents.service.ts`
- `src/shared/services/storage.service.ts`
- `src/shared/lib/queryKeys.ts`
- `.env.local` (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)

**Modify (existing):**

- `src/App.tsx` — add `QueryClientProvider`, auth session guard
- `src/shared/types/tenant.ts` — extract `Lease` into its own type file (`src/shared/types/lease.ts`)
- `src/shared/types/auth.ts` — extend `Organization` with `slug`, `plan`; `Membership` with `invite_token`, `invite_expires_at`
- `src/app/pages/LoginPage.tsx` — replace `setTimeout` mock with `supabase.auth.signInWithPassword`
- `src/tenant/layouts/TenantLayout.tsx` — add JWT `app_role` route guard

---

## Verification

1. **Auth**: Sign in with real credentials, confirm session persists on page refresh, confirm JWT contains correct `app_role`/`org_id` claims.
2. **Data isolation**: Log in as two different orgs, confirm data from org A does not appear in org B.
3. **Tenant scoping**: Log in as a tenant portal user, confirm only own lease, payments, and maintenance requests are visible.
4. **Realtime**: Open maintenance request on two browser windows (manager + tenant), send a message in one and confirm it appears in the other without a page refresh.
5. **File access**: Upload a lease PDF, confirm unsigned URL 403s and signed URL works. Confirm a different org's user cannot access the signed URL path.
6. **Mock fallback**: With `VITE_USE_MOCK=true`, confirm no Supabase calls are made and the UI looks identical to current state.
