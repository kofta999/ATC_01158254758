## 📦 Frontend (`apps/frontend`)

### 🛠️ Tech Stack

- React + Vite (SPA)
- TailwindCSS v4 with design system + dark mode via CSS variables
- TanStack Router (file-based routing)
- i18next for internationalization
- Strongly typed API client and hooks (`useAuth`, etc.)

### ⚙️ Architecture

```mermaid
flowchart TB
    %% Frontend Actors
    User["User (Browser)"]:::external
    Admin["Admin (Browser)"]:::external

    subgraph "Frontend (apps/frontend)"
        direction TB
        SPA["Vite-built SPA"]:::frontend
        APIClient["Base API Client"]:::frontend
        AuthHook["Auth Hook"]:::frontend
        Routes["Route Definitions"]:::frontend
        UIComponents["UI Components"]:::frontend
    end

    User -->|"loads SPA"| SPA
    Admin -->|"loads SPA"| SPA

    %% Clicks (optional - link to GitHub)
    click SPA "https://github.com/kofta999/atc_01158254758/tree/master/apps/frontend"
    click APIClient "https://github.com/kofta999/atc_01158254758/blob/master/apps/frontend/src/lib/base-api-client.ts"
    click AuthHook "https://github.com/kofta999/atc_01158254758/blob/master/apps/frontend/src/lib/hooks/use-auth.tsx"
    click Routes "https://github.com/kofta999/atc_01158254758/tree/master/apps/frontend/src/routes"
    click UIComponents "https://github.com/kofta999/atc_01158254758/tree/master/apps/frontend/src/components"

    %% Styles - dark mode optimized
    classDef external fill:#0f172a,stroke:#cbd5e1,color:#f8fafc,stroke-width:1px
    classDef frontend fill:#2563eb,stroke:#cbd5e1,color:#f8fafc,stroke-width:1px
```

- Modular component-based design
- Clear separation of views, reusable components, and logic
- Uses React context for auth state and language
- Global theming via Tailwind `@theme` block (no JS needed)

### 📁 Structure

```
src/
  components/         → UI components (Card, Button, etc.)
  routes/             → App routes (auth, dashboard, etc.)
  lib/
    base-api-client/  → Generated API client bindings
    hooks/            → `useAuth`, `useDarkMode`, etc.
```

### ✨ General Features

- User & admin login (JWT-based)
- Event browsing & booking
- Admin dashboard for event CRUD
- Responsive layout + dark mode
- Language switching with i18n

### 🧪 Scripts

```bash
bun dev       # start dev server
bun build     # production build
bun preview   # preview production build
```

### 🧭 Routes

```txt
/pages/
  /                             → Landing Page
  /login                        → User login
  /register                     → User register
  /events                       → List of all available events
  /events/:id                   → Event details & booking
  /booking-success              → Congratulations page for successful event booking
  /bookings                     → Authenticated user's bookings
  /admin/login                  → Admin login
  /admin/dashboard              → Admin event management
  /admin/dashboard/events/new   → Admin create event
  /admin/dashboard/events/:id   → Admin edit event
```
