#!/bin/bash
set -e

# Domain name for the certificate
DOMAIN="sharphorizons.tech"
EMAIL="mathew.sharpy@gmail.com"

echo "Initializing SSL certificates for $DOMAIN..."

# Create directories for certbot
sudo mkdir -p /etc/letsencrypt
sudo mkdir -p /var/www/certbot

# Stop any running containers that might be using port 80
echo "Stopping any containers using port 80..."
docker-compose -f docker-compose.prod.yml down || true

# Start nginx container in certbot mode
echo "Starting nginx in certbot mode..."
docker-compose -f docker-compose.prod.yml up -d nginx

# Request the certificate
echo "Requesting SSL certificate from Let's Encrypt..."
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path /var/www/certbot \
    --email $EMAIL \
    --agree-tos \
    --no-eff-email \
    --force-renewal \
    -d $DOMAIN

# Restart nginx to use the new certificate
echo "Restarting nginx with SSL configuration..."
docker-compose -f docker-compose.prod.yml restart nginx

echo "SSL certificate initialization complete!"
echo "Certificate will be automatically renewed by the certbot service."