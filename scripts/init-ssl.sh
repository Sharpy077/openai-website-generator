#!/bin/bash

# Exit on error
set -e

# Create required directories
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Stop any running containers
docker-compose down

# Start nginx with temporary configuration
docker-compose up -d nginx

# Wait for nginx to start
sleep 5

# Request the certificate
docker-compose run --rm certbot certbot certonly \
    --webroot \
    -w /var/www/certbot \
    -d sharphorizons.tech \
    --agree-tos \
    --non-interactive \
    --email admin@sharphorizons.tech

# Restart containers
docker-compose down
docker-compose up -d

echo "SSL certificates have been initialized successfully!"