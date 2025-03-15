#!/bin/sh

# Create the credentials file with proper permissions
cp /azure.json /etc/letsencrypt/azure.ini
chmod 600 /etc/letsencrypt/azure.ini

# Run Certbot with Azure DNS plugin
certbot certonly \
  --authenticator dns-azure \
  --dns-azure-config /etc/letsencrypt/azure.ini \
  -d sharphorizons.tech \
  -d *.sharphorizons.tech \
  --agree-tos \
  --non-interactive \
  --email admin@sharphorizons.tech