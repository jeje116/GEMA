# GEMA Restaurant & Sociëteit

Modern web application and editorial content management system for **GEMA Restaurant & Sociëteit** (Surabaya, Indonesia).

---

## 1. Repository Architecture

- **`apps/web/`**: **Authoritative Production Application.** Next.js 16 (App Router), React 19, Tailwind CSS v4, and co-located Payload CMS 3.90 backed by PostgreSQL.
- **`compose.yaml`**: **Production Docker Compose.** Defines disposable `web` application and isolated `postgres:16-alpine` database service with named volume and media bind mounts.
- **`.agents/`**: *Local Development Only (Untracked).* Engineering governance protocol, architectural decisions, task registry, and approved implementation plans. Excluded from GitHub tracking, Docker builds, and VPS deployments.

---

## 2. Local Development

### Prerequisites
- **Node.js**: v20 LTS or v22 LTS (developed with Node 24)
- **npm**: v10+
- **PostgreSQL 16**: Local Docker container or native instance

### Quick Start
```bash
# 1. Navigate to application root
cd apps/web

# 2. Configure environment
cp .env.example .env
# Edit .env with your local PostgreSQL URI and Payload secret

# 3. Install dependencies
npm install

# 4. Bootstrap initial database content (if database is fresh)
npx tsx --env-file=.env scripts/bootstrap-content.ts
node --env-file=.env scripts/migrate-splash-config.cjs

# 5. Start development server (Port 3001)
npm run dev

# Optional: Start local HTTPS reverse proxy for general HTTPS development (Port 3002)
npm run dev:https
```

> [!WARNING]
> ### ResDiary Production Safety Warning
> ResDiary is connected to the live production venue (`GemaSurabaya/2025`).
> Do not submit test reservations or run live widget QA without explicit authorization.
> Automated tests must block/mock ResDiary network requests (`https://*.resdiary.com/*`).

---


## 3. Environment Variables (`apps/web/.env`)

| Variable | Description | Requirement |
|---|---|---|
| `DATABASE_URI` | PostgreSQL connection string (`postgresql://...`) | Required |
| `PAYLOAD_SECRET` | Min 32-character secret for Payload JWT session encryption | Required |
| `NEXT_PUBLIC_SERVER_URL` | Public origin URL (e.g. `http://localhost:3001` or `https://gemagroup.id`) | Required |
| `PREVIEW_SECRET` | Server-only secret for Next.js Draft Mode preview security | Required |

*Note: Zero external object storage (R2/S3) credentials are required. Media is stored on the persistent local filesystem.*

---

## 4. Production Media Architecture

The production deployment uses a simple, resilient, and cost-effective local persistence model on the Hostinger VPS:

```text
Browser
   ↓
Nginx
   ├── Public Media Request (/api/media/file/...)
   │       ↓ (direct static disk delivery)
   │  /opt/gema/data/media/
   │
   └── Application / API / Admin Request
           ↓ (reverse proxy)
      Next.js + Payload Container
           ↓ (bind mount)
      /app/public/media/cms/ ──> /opt/gema/data/media/
```

- **PostgreSQL**: Stores structured CMS document metadata, relations, and portable media references (e.g. filename, MIME type, dimensions). No host absolute paths are persisted in database records.
- **Host Persistent Directory (`/opt/gema/data/media/`)**: Stores binary CMS files outside the Git application source tree.
- **Docker Bind Mount**: The web container mounts `/opt/gema/data/media/` to `/app/public/media/cms/`. Containers remain completely disposable.
- **Payload Mutation Ownership**: Payload CMS retains full ownership of media mutations (upload, replacement, deletion, metadata, Admin UI) via Next.js `/api/media` endpoints, writing directly through the bind mount.
- **Nginx Direct Public Media Delivery**: Nginx directly serves GET requests for public CMS media:
  ```nginx
  location ^~ /api/media/file/ {
      alias /opt/gema/data/media/;
      access_log off;
      expires 1h;
  }
  ```
  - Direct static file mapping without routing bytes through Node.js; missing files naturally return 404.
  - Safe because all current GEMA CMS media are public restaurant/editorial website assets (`access.read: () => true`).
  - Standard static delivery with HTTP byte-range support handles MP4 video seeking out of the box (no `ngx_http_mp4_module` or streaming module required).
  - Conservative initial cache policy of 1 hour without `immutable`, accommodating editorial replacements until production asset versioning is observed.
- **Filesystem Permissions Model**:
  - Principle of least privilege: directories `755`, regular files `644`. No `chmod 777`.
    ```bash
    find /opt/gema/data/media -type d -exec chmod 755 {} +
    find /opt/gema/data/media -type f -exec chmod 644 {} +
    ```
  - Payload web process requires READ + WRITE; Host Nginx requires READ ONLY.
  - Host ownership assignment: Container runs as non-root user `nextjs:nodejs` (`UID 1001, GID 1001`). Configure host permissions via:
    ```bash
    chown -R 1001:1001 /opt/gema/data/media
    ```
- **First Deployment Bootstrap**: Initial canonical media files in `apps/web/public/media/cms/` are copied to `/opt/gema/data/media/` before the container bind mount is activated to prevent masking image layer contents. Subsequent CMS uploads persist across container rebuilds and Git updates.

---

## 5. Operations, Backups & Disk Capacity

### Backup Principle
> **Persistent storage ≠ backup.**

Host persistence ensures container restarts do not discard uploads, but it does not protect against VPS failure, disk corruption, or accidental deletion. Production operations must maintain:
1. Automated daily PostgreSQL database dumps (`pg_dump`).
2. Regular file archive backups of `/opt/gema/data/media/`.
3. Independent off-server or Hostinger cloud snapshots.
4. Periodic restore verification rehearsals.

### Disk-Capacity Operational Guidelines
The VPS maintains approximately 100 GB storage. Monitor disk usage via standard operational thresholds:
- **`< 70%`**: Normal operation.
- **`70% – 80%`**: Investigate growth patterns and prune obsolete files/backups.
- **`80% – 90%`**: Capacity planning required; expand disk volume.
- **`> 90%`**: Urgent; immediate action required to prevent database or write failures.

---

## 6. Database & Content Management

- **Migrations**: Automatic schema pushes are disabled (`push: false`). Database schemas are managed strictly through Drizzle/Payload migrations in `apps/web/src/migrations/`:
  ```bash
  npx payload migrate
  ```
- **Admin Password Reset Tool**: If you need to set or reset a local admin password interactively:
  ```bash
  npx tsx --env-file=.env scripts/reset-admin-password.ts
  ```
- **Accessing Admin Panel**: Navigate to `http://localhost:3001/admin` (or `https://localhost:3002/admin` on HTTPS).

---

## 7. Production Docker Architecture & Operations

The production deployment runs via Docker Compose on the Hostinger VPS:

```text
Hostinger VPS
Nginx (:80 / :443)
  ├── /api/media/file/*  ──>  Direct host filesystem: /opt/gema/data/media/
  └── /*                 ──>  Reverse proxy to 127.0.0.1:3000
                                  │
                          Docker Bridge Network
                                  ├── gema-web (Next.js 16 + Payload 3, non-root uid 1001)
                                  │      bind mount: /opt/gema/data/media -> /app/public/media/cms
                                  └── gema-postgres (PostgreSQL 16-alpine, private network only)
                                         named volume: postgres_data -> /var/lib/postgresql/data
```

### Required Production Environment Variables (`.env`)

Copy `.env.production.example` to `.env` in the deployment directory:

| Variable | Description | Default / Example |
|---|---|---|
| `POSTGRES_USER` | PostgreSQL superuser/app user | `gema_user` |
| `POSTGRES_PASSWORD` | Strong PostgreSQL password (required) | `[secure password]` |
| `POSTGRES_DB` | Production database name | `gema_production` |
| `PAYLOAD_SECRET` | Strong secret for JWT encryption (min 32 chars) | `[32+ random chars]` |
| `PREVIEW_SECRET` | Secret for Next.js Draft Mode preview | `[32+ random chars]` |
| `NEXT_PUBLIC_SERVER_URL` | Public site domain URL | `https://gemagroup.id` |
| `MEDIA_DIR` | Host persistent media path | `/opt/gema/data/media` |

### Persistence Architecture
- **Database Persistence**: PostgreSQL data is stored in the Docker named volume `postgres_data`. It survives container recreations, image updates, and host reboots.
- **Media Persistence**: CMS upload binaries are stored in `/opt/gema/data/media/` and bind-mounted to `/app/public/media/cms/`. The container runs as non-root user `nextjs:nodejs` (`UID 1001, GID 1001`), which requires read/write permissions on `/opt/gema/data/media/`.

> [!CAUTION]
> **DATABASE DESTRUCTION WARNING**: Running `docker compose down -v` will **DESTROY** the named `postgres_data` volume and delete the entire PostgreSQL database. **NEVER use the `-v` flag in production.**

### First-Deployment Initialization & Bootstrap
1. **Canonical Media**: The Docker image bakes 35 canonical assets into `/app/canonical-media/`. On startup, `docker-entrypoint.sh` executes `cp -n /app/canonical-media/* /app/public/media/cms/`. It populates missing files into the host bind mount on first run and **never overwrites** existing or newer production uploads.
2. **Database Migrations**: Payload CMS production migrations are bundled directly into the standalone application (`prodMigrations`). On container startup, Payload automatically executes any pending migrations against PostgreSQL.
3. **Splash Media Config**: `docker-entrypoint.sh` idempotently creates/verifies the `splash_media_config` table and seeds default desktop/mobile splash video paths.
4. **First Admin User**: When the `users` collection is empty, Payload Admin (`/admin`) automatically displays the initial user registration screen. Create the first admin user securely through the browser on first deployment.

### Service Healthcheck & Logging
- **Web Healthcheck**: `GET /api/health` queries the database via `payload.count({ collection: 'users' })`. It returns HTTP 200 `{"status":"ok"}` only when both the Next.js process and PostgreSQL database are healthy and responding.
- **Log Management**: Both services use Docker's `json-file` logging driver with conservative log limits: `max-size: "10m"` and `max-file: "3"`, preventing unbounded disk growth.

### Basic Operational Commands
```bash
# Start all production services in background
docker compose up -d

# Check service status and healthcheck
docker compose ps

# View live application logs
docker compose logs -f web

# View live database logs
docker compose logs -f postgres

# Graceful restart of web application
docker compose restart web

# Graceful shutdown (preserves database and media)
docker compose down
```

---

## 8. Build & Verification Commands

```bash
cd apps/web

# TypeScript typecheck
npm run typecheck

# Standalone production build
npm run build

# Docker production build & configuration validation
docker compose build
docker compose config
```

