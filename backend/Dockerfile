# ─────────────────────────────────────────────────────────
# Backend — FastAPI · Python 3.12
# ─────────────────────────────────────────────────────────
FROM python:3.12-slim AS base

# Don't write .pyc / buffer stdout
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev \
    gcc \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python deps (cached layer)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source
COPY . .

# Non-root user
RUN groupadd -r rihla && useradd -r -g rihla rihla \
    && mkdir -p /app/exports \
    && chown -R rihla:rihla /app
USER rihla

# Healthcheck — hits /api/health
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -fsS http://localhost:8000/api/health || exit 1

EXPOSE 8000

# Production command (overridable in docker-compose for dev mode)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
