# Angular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.1.

## Environment variables

This app reads Supabase credentials from environment variables used by the Angular app and SSR server:

- `NG_APP_SUPABASE_URL`: Your Supabase project URL (e.g., https://xyzcompany.supabase.co)
- `NG_APP_SUPABASE_KEY`: Your Supabase anon/public key

Create a `.env` file at the project root of the frontend container (same directory as `package.json`) or set variables in your shell. See `.env.example` for a template.

Example `.env`:

```
NG_APP_SUPABASE_URL=https://your-project.supabase.co
NG_APP_SUPABASE_KEY=your-anon-public-key
```

Notes:
- Do not commit real keys. Use `.env` locally and CI secrets in pipelines.
- The DI token `SUPABASE_CLIENT` is provided app-wide. You can inject it in any service/component.
- If the variables are not configured at runtime in the browser, the Supabase client factory will throw a clear error. During SSR/prerender builds, a safe no-op client is returned to avoid build failures.

## Supabase data model expectations

The frontend assumes the following tables and relationships exist in your Supabase Postgres database. Names and columns are inferred directly from the code under `src/app/core/models` and how services query them.

### destinations
Represents a place users can search and view.

- id: uuid (PK)
- name: text (indexed for search)
- country: text (indexed for search; optional)
- city: text (indexed for search; optional)
- description: text (optional)
- image_url: text (optional)
- featured: boolean (default false)
- created_at: timestamptz (default now())
- updated_at: timestamptz

Indexes recommended:
- idx_destinations_name_trgm on name for ILIKE queries (pg_trgm)
- idx_destinations_city_trgm on city for ILIKE queries (pg_trgm)
- idx_destinations_country_trgm on country for ILIKE queries (pg_trgm)
- idx_destinations_featured on featured

The Search page uses ilike filters across name, city, and country with OR conditions and a limit of 50.

### itineraries
Represents a trip plan created by a specific user.

- id: uuid (PK)
- user_id: uuid (FK to auth.users.id)
- title: text
- description: text (optional)
- start_date: date (optional)
- end_date: date (optional)
- created_at: timestamptz (default now())
- updated_at: timestamptz

Indexes recommended:
- idx_itineraries_user_id on user_id
- idx_itineraries_created_at on created_at desc

The ItineraryService selects `itineraries` with a related `items: itinerary_items(*)` join filtered by `user_id`.

### itinerary_items
Represents timeline entries under an itinerary.

- id: uuid (PK)
- itinerary_id: uuid (FK to itineraries.id) ON DELETE CASCADE
- title: text
- description: text (optional)
- date: date (optional)
- sort_order: int (optional)
- created_at: timestamptz (default now())
- updated_at: timestamptz

Indexes recommended:
- idx_itinerary_items_itinerary_id on itinerary_id
- idx_itinerary_items_sort on (itinerary_id, sort_order)

Frontend operations add and remove items and expect standard CRUD with `itinerary_id` set.

### bookings
Represents a reservation reference (e.g., flight, hotel) tied to a user, optionally linked to an itinerary or destination.

- id: uuid (PK)
- user_id: uuid (FK to auth.users.id)
- itinerary_id: uuid (FK to itineraries.id; nullable)
- destination_id: uuid (FK to destinations.id; nullable)
- provider: text (optional)
- reference: text (optional)
- status: text CHECK (status IN ('pending', 'confirmed', 'canceled')) DEFAULT 'pending'
- check_in: timestamptz (optional)
- check_out: timestamptz (optional)
- created_at: timestamptz (default now())
- updated_at: timestamptz

Indexes recommended:
- idx_bookings_user_id on user_id
- idx_bookings_created_at on (user_id, created_at desc)
- idx_bookings_itinerary_id on itinerary_id

The BookingsService lists bookings by `user_id`, orders by `created_at` desc, creates with default `status='pending'`, and cancels by updating `status='canceled'`.

## Row Level Security (RLS)

Enable RLS on tables that store user-owned data to ensure users can only access their resources:

- itineraries: ON, with policies allowing
  - select/insert/update/delete where `user_id = auth.uid()`.
- itinerary_items: ON, with policies allowing
  - select/insert/update/delete where the parent itinerary’s `user_id = auth.uid()`.
- bookings: ON, with policies allowing
  - select/insert/update where `user_id = auth.uid()`.
  - delete (optional) where `user_id = auth.uid()`.
- destinations: Usually public read-only. You can:
  - keep RLS OFF and expose read access to anon role, OR
  - enable RLS and add a policy that allows read for anon/authenticated, and writes only to service role.

Important: The frontend uses the Supabase anon/public key on the client. Any operation must be permitted by RLS for the anon/authed roles. Do not grant overly broad policies. If you need admin inserts or moderation for `destinations`, use a backend or service role on a trusted server.

## Service to table mapping

- DestinationService → destinations
  - Reads: search by ilike on `name`, `city`, `country`; read a single destination by `id`; read featured destinations.
- ItineraryService → itineraries, itinerary_items
  - Reads: list itineraries by `user_id` with `items: itinerary_items(*)`.
  - Writes: create/update/delete itineraries; add/remove itinerary_items.
- BookingService → bookings
  - Reads: list bookings by `user_id` ordered by `created_at` desc.
  - Writes: create booking (defaults to `pending`), cancel booking (update `status`).

These services rely on RLS policies to scope data to the currently signed-in user via Supabase Auth.

## Suggested SQL snippets (reference)

The exact SQL is environment-specific. The following outlines common patterns consistent with the code paths:

- Trigram indexes for faster ILIKE search (requires pg_trgm):
```
create extension if not exists pg_trgm;

create index if not exists idx_destinations_name_trgm on public.destinations using gin (name gin_trgm_ops);
create index if not exists idx_destinations_city_trgm on public.destinations using gin (city gin_trgm_ops);
create index if not exists idx_destinations_country_trgm on public.destinations using gin (country gin_trgm_ops);
```

- Ownership-based RLS (example for itineraries):
```
alter table public.itineraries enable row level security;

create policy "itineraries_select_own"
  on public.itineraries for select
  using (user_id = auth.uid());

create policy "itineraries_modify_own"
  on public.itineraries for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
```

- Child table RLS (example for itinerary_items):
```
alter table public.itinerary_items enable row level security;

create policy "items_access_via_parent_ownership"
  on public.itinerary_items for all
  using (exists (
    select 1 from public.itineraries i
    where i.id = itinerary_items.itinerary_id
      and i.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.itineraries i
    where i.id = itinerary_items.itinerary_id
      and i.user_id = auth.uid()
  ));
```

- Bookings RLS:
```
alter table public.bookings enable row level security;

create policy "bookings_access_own"
  on public.bookings for all
  using (user_id = auth.uid())
  with check (user_id = auth.uid());
```

- Destinations (public read):
```
-- Option A: RLS off and anon can select via grants (simplest for public catalog)
-- Option B: RLS on and policy allows select to anon/authed
```

Ensure foreign keys exist between bookings.itinerary_id → itineraries.id and itinerary_items.itinerary_id → itineraries.id, with ON DELETE CASCADE for child rows as appropriate.

## Supabase client usage

Inject the client using Angular DI:

```ts
import { Component, inject } from '@angular/core';
import { SUPABASE_CLIENT } from './app/core/supabase/supabase.tokens';

@Component({
  standalone: true,
  template: `...`
})
export class Example {
  private supabase = inject(SUPABASE_CLIENT);
}
```

The configuration provider reads `NG_APP_SUPABASE_URL` and `NG_APP_SUPABASE_KEY` from `process.env` via Angular’s build/SSR pipeline. During SSR/prerender, a no-op client is returned if env vars are missing; in the browser a helpful runtime error is thrown when the client is first used.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:3000/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This compiles your project and stores artifacts in `dist/`. Production builds enable optimizations.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner:

```bash
ng test
```

## Additional Resources

- Angular CLI Overview and Command Reference: https://angular.dev/tools/cli
- Supabase docs: https://supabase.com/docs
