#!/bin/bash

# Stop nginx
docker compose stop nginx

# Renew certificates
docker compose run --rm certbot renew

# Copy new certificates
docker compose start nginx

# Reload nginx to pick up new certificates
docker compose exec nginx nginx -s reload