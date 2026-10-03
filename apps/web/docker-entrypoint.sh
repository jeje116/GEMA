#!/bin/sh
set -e

echo "=== GEMA Web Container Startup ==="

# 1. Wait for PostgreSQL connectivity if DATABASE_URI is defined
if [ -n "$DATABASE_URI" ]; then
  echo "Verifying PostgreSQL connection..."
  for i in $(seq 1 30); do
    if node -e "const { Pool } = require('pg'); const pool = new Pool({ connectionString: process.env.DATABASE_URI }); pool.query('SELECT 1').then(() => { pool.end(); process.exit(0); }).catch(() => process.exit(1));" 2>/dev/null; then
      echo "✓ PostgreSQL connection verified."
      break
    fi
    if [ "$i" -eq 30 ]; then
      echo "⚠️ Warning: PostgreSQL connectivity check timed out after 30s. Continuing with startup."
      break
    fi
    echo "Waiting for PostgreSQL ($i/30)..."
    sleep 1
  done
fi

# 2. First-Deployment Bootstrap: Populate persistent media directory if empty
# Copy missing canonical files only; NEVER overwrite existing or updated production media
if [ -d "/app/canonical-media" ] && [ -d "/app/public/media/cms" ]; then
  echo "Checking persistent media directory (/app/public/media/cms)..."
  CANONICAL_COUNT=$(ls -1 /app/canonical-media 2>/dev/null | wc -l || echo 0)
  CURRENT_COUNT=$(ls -1 /app/public/media/cms 2>/dev/null | wc -l || echo 0)
  echo "Canonical assets available: $CANONICAL_COUNT, Current assets in persistent mount: $CURRENT_COUNT"
  cp -n /app/canonical-media/* /app/public/media/cms/ 2>/dev/null || true
  NEW_COUNT=$(ls -1 /app/public/media/cms 2>/dev/null | wc -l || echo 0)
  echo "✓ Persistent media synchronized: $NEW_COUNT files present."
fi

# 3. Non-Payload Splash Media Database Initialization (Idempotent)
if [ -f "scripts/migrate-splash-config.cjs" ] && [ -n "$DATABASE_URI" ]; then
  echo "Running splash media configuration migration..."
  node scripts/migrate-splash-config.cjs || echo "⚠️ Warning: Splash config migration failed to complete."
fi

# 4. Execute primary command (default: node server.js)
echo "Starting application process: $@"
exec "$@"
