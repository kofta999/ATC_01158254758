## 🔧 Backend (`apps/backend`)

### 🛠️ Tech Stack

- Hono.js (high-performance web framework)
- Drizzle ORM (for PostgreSQL)
- JWT Auth (via Hono JWT) + Bcrypt for password hashing
- Redis & in-memory caching support
- Layered architecture: Hexagonal + DDD practices

### ⚙️ Architecture

```mermaid
flowchart TB
    %% Backend Container
    subgraph "Backend (apps/backend)"
        direction TB

        subgraph "Web Adapter (Driving Adapters)"
            RoutesWA["Routes"]:::backend
            Controllers["Controllers"]:::backend
            Middleware["Middleware"]:::backend
        end

        subgraph "Application Services (Core)"
            BookingService["BookingService"]:::service
            EventService["EventService"]:::service
            UserService["UserService"]:::service
        end

        subgraph "Domain (Core Domain)"
            Entities["Entities"]:::domain
            ValueObjects["Value Objects"]:::domain
        end

        subgraph "Ports"
            InputPorts["Input Ports (Service Interfaces)"]:::port
            subgraph "Output Ports"
                ReposPort["Repositories"]:::port
                CacheSecPort["Cache & Security"]:::port
            end
        end

        subgraph "Driven Adapters"
            subgraph "Database Data-Sources"
                DrizzleDS["Drizzle Data-Source"]:::adapter
                PostgresDS["Postgres Data-Source"]:::adapter
            end
            subgraph "Repository Adapters"
                BookingRepo["Booking DB Repo"]:::adapter
                EventRepo["Event DB Repo"]:::adapter
                UserRepo["User DB Repo"]:::adapter
            end
            subgraph "Cache Adapters"
                RedisCache["Redis Cache Adapter"]:::adapter
                MemCache["Memory Cache Adapter"]:::adapter
            end
            subgraph "Security Adapters"
                Bcrypt["Bcrypt Password Adapter"]:::adapter
                JWT["Hono JWT Adapter"]:::adapter
            end
        end
    end

    %% Connections
    RoutesWA --> Controllers
    Controllers --> Middleware
    Controllers --> BookingService
    Controllers --> EventService
    Controllers --> UserService

    BookingService --> InputPorts
    EventService --> InputPorts
    UserService --> InputPorts

    BookingService --> ReposPort
    EventService --> ReposPort
    UserService --> ReposPort
    BookingService --> CacheSecPort
    EventService --> CacheSecPort
    UserService --> CacheSecPort

    ReposPort --> BookingRepo
    ReposPort --> EventRepo
    ReposPort --> UserRepo

    BookingRepo --> DrizzleDS
    BookingRepo --> PostgresDS
    EventRepo --> DrizzleDS
    EventRepo --> PostgresDS
    UserRepo --> DrizzleDS
    UserRepo --> PostgresDS

    CacheSecPort --> RedisCache
    CacheSecPort --> MemCache
    CacheSecPort --> Bcrypt
    CacheSecPort --> JWT

    %% Styles - dark mode optimized
    classDef backend fill:#1e3a8a,stroke:#cbd5e1,color:#f8fafc,stroke-width:1px
    classDef service fill:#2563eb,stroke:#cbd5e1,color:#f8fafc,stroke-width:1px
    classDef domain fill:#334155,stroke:#cbd5e1,color:#f8fafc,stroke-width:1px
    classDef port fill:#475569,stroke:#cbd5e1,color:#f8fafc,stroke-width:1px
    classDef adapter fill:#0f172a,stroke:#cbd5e1,color:#f8fafc,stroke-width:1px
```

- **Driving Adapters**: Expose HTTP routes and middleware
- **Core Application Services**: Pure logic layer (BookingService, etc.)
- **Domain Layer**: Entities + ValueObjects as first-class citizens
- **Ports**:

  - Input Ports → Service interfaces
  - Output Ports → Repositories, Cache, Security

- **Driven Adapters**:

  - DB/Cache/Security implementations

### 📁 Structure

```
src/
  adapters/
    driving/web/         → HTTP routes, middleware, controllers
    driven/database/     → Drizzle/Postgres adapters
    driven/cache/        → Redis/Memory adapters
    driven/security/     → JWT/Bcrypt
  core/
    application/services/ → EventService, BookingService, etc.
    domain/entities/      → Domain models
    domain/value-objects/ → Strongly typed primitives
  ports/
    input/               → Service interfaces (Input Ports)
    output/              → Repos, Cache, Security (Output Ports)
```

### ✨ General Features

- Token-based authentication (JWT)
- RESTful CRUD API for events, users, bookings
- Service-level separation for testability and reuse
- Pluggable infra via adapters (e.g., swap cache layer)

### 🧪 Scripts

```bash
npm dev          # dev server
npm build        # build
npm lint         # lint code
npm test         # coming soon (unit + integration)
```

### 📡 API Routes

```txt
POST   /auth/login               → Login user
POST   /auth/register            → Register new user
GET    /events                   → Get all events (with optional filtering/pagination)
GET    /events/:id               → Get event details by ID
POST   /events                   → Create a new event (Admin only)
PUT    /events/:id               → Update an event by ID (Admin only)
DELETE /events/:id               → Delete an event by ID (Admin only)
POST   /bookings                 → Create a new booking (User only)
GET    /bookings                 → Get user's bookings (User only)
DELETE /bookings/:id             → Delete a booking by ID (User only)
```

---

## 🧠 Design Decisions

- Adopted **hexagonal architecture** for testability & future adapters
- Used **CSS variables** + `@theme` for dark mode
- TanStack Router enables modular route-driven file setup
- Full i18n-ready frontend
