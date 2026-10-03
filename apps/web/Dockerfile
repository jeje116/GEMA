# syntax=docker/dockerfile:1

# ==============================================================================
# 1. Base stage: Node.js 22 LTS Debian bookworm-slim (glibc-native, stable)
# ==============================================================================
FROM node:22-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ==============================================================================
# 2. Dependencies stage: deterministic install from package-lock.json
# ==============================================================================
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ==============================================================================
# 3. Builder stage: compile Next.js standalone bundle with Payload
# ==============================================================================
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Prepare clean public static assets for runner (excluding duplicate CMS binaries)
RUN cp -r /app/public /app/public-clean && \
    rm -rf /app/public-clean/media/cms/*

# ==============================================================================
# 4. Production Runner stage: minimal, secure non-root runtime
# ==============================================================================
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Explicit stable non-root user UID/GID 1001 for predictable host permissions
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid 1001 nextjs

WORKDIR /app

# Copy public static assets (clean mount point, no duplicate CMS binaries) and standalone bundle
COPY --from=builder --chown=nextjs:nodejs /app/public-clean ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Preserve canonical initial CMS media inside dedicated image layer for first-deployment bootstrap
COPY --from=builder --chown=nextjs:nodejs /app/public/media/cms ./canonical-media


# Copy runtime scripts, source schemas, and CLI tooling for migrations/seed
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/src ./src
COPY --from=builder /app/node_modules/tsx ./node_modules/tsx
COPY --from=builder /app/node_modules/esbuild ./node_modules/esbuild

# Setup entrypoint script
COPY --chown=nextjs:nodejs docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

# Ensure persistent mount point exists and is owned by nextjs
RUN mkdir -p /app/public/media/cms && chown -R nextjs:nodejs /app/public/media/cms

USER nextjs

EXPOSE 3000

ENTRYPOINT ["/app/docker-entrypoint.sh"]
CMD ["node", "server.js"]
