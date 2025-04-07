# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    POETRY_VERSION=1.7.1 \
    VIRTUAL_ENV=/app/.venv \
    PATH="/app/.venv/bin:$PATH"

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    curl \
    build-essential \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

# Create and activate virtual environment
RUN python -m venv $VIRTUAL_ENV

# Copy requirements
COPY requirements.txt .

# Install Python dependencies in virtual environment
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

FROM node:23.11.0-alpine AS builder

WORKDIR /app

# Update npm to latest version
RUN npm install -g npm@11.2.0

# Install dependencies including development ones
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies with latest npm
RUN npm ci --audit=false --fund=false

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY . .

# Build application
RUN npm run build

# Production image
FROM node:23.11.0-alpine AS runner

WORKDIR /app

# Update npm in production image
RUN npm install -g npm@11.2.0

# Copy necessary files from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/scripts ./scripts

# Install production dependencies only with latest npm
RUN npm ci --only=production --audit=false --fund=false

# Make start script executable
RUN chmod +x ./scripts/start.sh

# Set environment variables
ENV NODE_ENV=production

# Expose port
EXPOSE 3000

# Start the application using the start script
CMD ["./scripts/start.sh"]