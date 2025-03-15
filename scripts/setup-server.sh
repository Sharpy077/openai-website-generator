#!/bin/bash

# Exit on error
set -e

# Create application directory
sudo mkdir -p /opt/sharphorizons
cd /opt/sharphorizons

# Create necessary directories
mkdir -p {scripts,nginx/conf,certbot/{conf,www}}

# Copy configuration files
cat > docker-compose.prod.yml << 'EOL'
version: '3.8'

services:
  frontend:
    image: sharpy077/sharphorizons-frontend:latest
    restart: unless-stopped
    environment:
      - NODE_ENV=production
    networks:
      - app_network

  nginx:
    image: sharpy077/sharphorizons-nginx:latest
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf:/etc/nginx/conf.d
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    depends_on:
      - frontend
    networks:
      - app_network

  certbot:
    image: certbot/certbot:latest
    volumes:
      - ./certbot/conf:/etc/letsencrypt
      - ./certbot/www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew; sleep 12h & wait \${!}; done;'"

networks:
  app_network:
    driver: bridge

volumes:
  certbot_conf:
  certbot_www:
EOL

# Copy deployment script
cat > scripts/deploy.sh << 'EOL'
#!/bin/bash

# Exit on error
set -e

# Pull the latest images
docker pull sharpy077/sharphorizons-frontend:latest
docker pull sharpy077/sharphorizons-nginx:latest

# Stop and remove existing containers
docker-compose -f docker-compose.prod.yml down || true

# Start new containers
docker-compose -f docker-compose.prod.yml up -d

# Clean up unused images
docker image prune -f

# Check container status
docker ps

# Display logs
docker-compose -f docker-compose.prod.yml logs -f
EOL

# Copy SSL initialization script
cat > scripts/init-ssl.sh << 'EOL'
#!/bin/bash

# Exit on error
set -e

# Create directories for certbot
mkdir -p certbot/conf
mkdir -p certbot/www

# Start nginx with temporary configuration
docker-compose -f docker-compose.prod.yml up -d nginx

# Get SSL certificate
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
  --webroot \
  --webroot-path /var/www/certbot \
  --email admin@sharphorizons.tech \
  --agree-tos \
  --no-eff-email \
  -d sharphorizons.tech \
  -d "*.sharphorizons.tech"

# Restart nginx to load the new certificate
docker-compose -f docker-compose.prod.yml restart nginx

echo "SSL certificates have been initialized successfully!"
EOL

# Make scripts executable
chmod +x scripts/deploy.sh scripts/init-ssl.sh

# Set proper permissions
sudo chown -R $USER:$USER /opt/sharphorizons
sudo chmod -R 755 /opt/sharphorizons

echo "Server setup completed successfully!"