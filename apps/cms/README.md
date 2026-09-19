# GEMA CMS (Payload 3 + PostgreSQL)

Isolated Payload CMS headless backend application for GEMA Restaurant & Sociëteit.

---

## 1. Local PostgreSQL Setup

GEMA CMS uses PostgreSQL via `@payloadcms/db-postgres`.

### Local Cluster Initialization & Execution
```bash
# Initialize local cluster (if not already initialized)
/Library/PostgreSQL/18/bin/initdb -D ~/.local/share/postgresql/data -U postgres -A trust

# Ensure port = 5433 in postgresql.conf to avoid conflicting with default 5432 services:
# port = 5433

# Start PostgreSQL server
/Library/PostgreSQL/18/bin/pg_ctl -D ~/.local/share/postgresql/data -l ~/.local/share/postgresql/logfile start

# Create the database
/Library/PostgreSQL/18/bin/createdb -p 5433 -U postgres gema_cms
```

---

## 2. Environment Variables

Create `.env.local` inside `apps/cms/`:

```bash
DATABASE_URL=postgresql://postgres@127.0.0.1:5433/gema_cms
PAYLOAD_SECRET=your_32_character_secret_key_here
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000
```

Refer to `.env.example` for safe templates. Never commit `.env.local`.

---

## 3. Starting Applications Independently

The frontend (`apps/web`) and CMS (`apps/cms`) run as independent sibling services:

```bash
# Terminal 1: Run CMS Backend (Port 3000)
cd apps/cms
npm run dev

# Terminal 2: Run Public Frontend (Port 3001)
cd apps/web
npm run dev
```

---

## 4. Database Migrations

Schema changes are managed through explicit migrations:

```bash
# Generate a new migration based on schema changes
npm run migrate:create <migration_name>

# Execute pending migrations against the database
npm run migrate
```

---

## 5. First Admin Setup

1. Open `http://localhost:3000/admin` in your browser.
2. Complete the initial registration form to create the root Admin account.
3. Once created, the admin can invite or manage other users (`admin` or `editor` roles).

---

## 6. Access Control Summary

- **Users**:
  - `admin`: Full content access, user creation, updating, and deletion.
  - `editor`: Content and media access. Prohibited from managing users.
- **Media**:
  - Public read access for published assets.
  - Authenticated create, update, and delete.

---

## 7. Media Persistence Strategy

- **Development**: Stored locally under `apps/cms/public/media/uploads/`.
- **Production VPS**: Media uploads must reside on a persistent volume mount outside the ephemeral application build container, or be routed through an S3-compatible object storage provider (e.g., MinIO or Cloudflare R2).
