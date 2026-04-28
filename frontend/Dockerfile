# ─────────────────────────────────────────────────────────
# Stage 1: Build the React app
# ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit

COPY . .
RUN npm run build

# ─────────────────────────────────────────────────────────
# Stage 2: Serve with Nginx (Railway-compatible)
# ─────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS production

# Install envsubst (included in gettext)
RUN apk add --no-cache gettext

# Remove default config
RUN rm /etc/nginx/conf.d/default.conf

# Copy nginx template (env vars replaced at runtime)
COPY nginx.conf.template /etc/nginx/conf.d/default.conf.template

# Copy built React app
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:${PORT:-80}/health || exit 1

# Railway sets PORT automatically — entrypoint handles it
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
