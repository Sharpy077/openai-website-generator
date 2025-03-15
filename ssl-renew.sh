#!/bin/bash

# Load environment variables
source .env

# Path to the certificate
CERT_PATH="/etc/letsencrypt/live/$DOMAIN_NAME/fullchain.pem"

# Check if certificate exists and is close to expiry (30 days)
if [ -f $CERT_PATH ]; then
    exp_date=$(openssl x509 -enddate -noout -in $CERT_PATH | cut -d= -f2)
    exp_epoch=$(date -d "$exp_date" +%s)
    now_epoch=$(date +%s)
    diff_days=$(( ($exp_epoch - $now_epoch) / 86400 ))

    if [ $diff_days -lt 30 ]; then
        echo "Certificate is close to expiry. Attempting renewal..."
        echo "Checking SSL certificate renewal..."
        docker compose run --rm certbot certbot renew --quiet --agree-tos
        docker compose exec nginx nginx -s reload
    else
        echo "Certificate is still valid for $diff_days days"
    fi
else
    echo "Certificate not found. Running initial certificate creation..."
    ./init-ssl.sh
fi