# Project Structure

```
rupantorii-system/
├─ backend/                # Express API + Prisma + services
│  ├─ prisma/              # Prisma schema and migrations
│  └─ src/                 # Controllers, routes, services, middleware
├─ frontend/               # Next.js 14 App Router
│  ├─ app/                 # Pages and layouts
│  ├─ components/          # UI components
│  ├─ contexts/            # Auth and cart state
│  └─ lib/                 # API helpers and utilities
├─ docs/                   # Architecture and project docs
├─ docker-compose.yml      # Local orchestration
├─ .env.example            # Compose defaults
└─ README.md               # Setup and usage guide
```

## Key Paths

- `backend/src/routes`: API routing
- `backend/src/services`: business logic
- `frontend/app`: routing and pages (storefront + admin)
- `frontend/components`: reusable UI
- `docs/ARCHITECTURE.md`: system overview
