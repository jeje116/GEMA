# GEMA Restaurant & Sociëteit

Modern web application and editorial content management system for **GEMA Restaurant & Sociëteit** (Surabaya, Indonesia).

---

## 1. Repository Architecture

- **`apps/web/`**: **Authoritative Production Application.** Next.js 16 (App Router), React 19, Tailwind CSS v4, and co-located Payload CMS 3.90 backed by PostgreSQL.
- **`apps/cms/`**: *Historical / Legacy.* Standalone Payload scaffold from early prototyping (GEMA-025); superseded by co-located `apps/web`.
- **`.agents/`**: Repository engineering governance protocol, durable architecture decisions ([DECISIONS.md](.agents/DECISIONS.md)), verified system state ([CONTEXT.md](.agents/CONTEXT.md)), task registry ([TASKS.md](.agents/TASKS.md)), and approved implementation contracts.
- **`archive/`**: Preserved immutable design reference materials.

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

# Optional: Start local HTTPS reverse proxy for ResDiary widget QA (Port 3002)
npm run dev:https
```

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
  - Host ownership assignment (`chown`) is deferred until the production Dockerfile is finalized and its container runtime UID/GID is authoritatively known.
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

## 7. Build & Production Commands

```bash
cd apps/web

# Typecheck
npm run typecheck

# Production Build
npm run build

# Start Production Server
PORT=3000 npm run start
```
