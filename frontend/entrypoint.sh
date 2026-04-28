#!/bin/sh
# Railway injects PORT automatically. Default to 80 for local Docker.
export PORT=${PORT:-80}
export BACKEND_URL=${BACKEND_URL:-http://localhost:8000}

# Replace env vars in nginx template → final config
envsubst '${PORT} ${BACKEND_URL}' \
  < /etc/nginx/conf.d/default.conf.template \
  > /etc/nginx/conf.d/default.conf

echo "🚀 RIHLA Frontend starting on port $PORT → backend: $BACKEND_URL"

# Start nginx
exec nginx -g 'daemon off;'
