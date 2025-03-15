#!/bin/bash

# Load environment variables
source .env

# Create required directories if they don't exist
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

echo "Starting SSL certificate initialization for sharphorizons.tech..."

# Stop nginx container if running
docker compose stop nginx

# Request the certificate
docker compose run --rm certbot certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot \
    --email $SSL_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d sharphorizons.tech \
    --force-renewal

# Start nginx container
docker compose start nginx

echo "SSL certificate initialization completed!"