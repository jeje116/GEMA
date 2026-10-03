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
| `R2_BUCKET` | Cloudflare R2 bucket name | Production |
| `R2_ENDPOINT` | Cloudflare R2 S3 endpoint (`https://<account-id>.r2.cloudflarestorage.com`) | Production |
| `R2_ACCESS_KEY_ID` | Cloudflare R2 S3 API access key | Production |
| `R2_SECRET_ACCESS_KEY` | Cloudflare R2 S3 API secret key | Production |
| `R2_PUBLIC_URL` | Public media CDN URL (e.g. `https://media.gemagroup.id`) | Production |

*Note: If any `R2_*` variable is set, all 5 R2 variables must be set (atomic configuration).*

---

## 4. Media Storage Architecture

- **Local Development**: When R2 variables are omitted, Payload automatically falls back to local filesystem storage in `apps/web/public/media/cms/`.
- **Production VPS**: **Stateless Web Container.** All mutable CMS uploads are routed directly to **Cloudflare R2** via `@payloadcms/storage-s3`. Local filesystem storage is disabled in production (`disableLocalStorage: true`). No persistent volume is required for media uploads.
- **R2 Migration Utility**: To migrate local media assets to Cloudflare R2:
  ```bash
  cd apps/web
  npx tsx --env-file=.env scripts/migrate-media-to-r2.ts
  ```

---

## 5. Database & Content Management

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

## 6. Build & Production Commands

```bash
cd apps/web

# Typecheck
npm run typecheck

# Production Build
npm run build

# Start Production Server
PORT=3000 npm run start
```
