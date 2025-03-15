#!/bin/bash


# Exit on error
set -e

echo "🚀 Starting deployment process..."

# Load environment variables
if [ -f .env.production ]; then
    echo "📝 Loading production environment variables..."
    export $(cat .env.production | grep -v '^#' | xargs)
else
    echo "❌ Error: .env.production file not found!"
    exit 1
fi

# Build Docker images
echo "🏗️ Building Docker images..."
docker build -t $DOCKER_USERNAME/sharphorizons-frontend:latest -f Dockerfile .
docker build -t $DOCKER_USERNAME/sharphorizons-nginx:latest -f nginx/Dockerfile ./nginx

# Push Docker images
echo "📤 Pushing Docker images..."
docker push $DOCKER_USERNAME/sharphorizons-frontend:latest
docker push $DOCKER_USERNAME/sharphorizons-nginx:latest

# Create required directories
echo "📁 Creating required directories..."
mkdir -p certbot/conf certbot/www

# Start the application
echo "🌟 Starting application..."
docker-compose -f docker-compose.prod.yml up -d

# Initialize SSL certificates
echo "🔒 Initializing SSL certificates..."
docker-compose -f docker-compose.prod.yml run --rm certbot certonly \
    --webroot \
    --webroot-path=/var/www/certbot \
    --email $SSL_EMAIL \
    --agree-tos \
    --no-eff-email \
    -d $DOMAIN

# Reload Nginx to apply SSL configuration
echo "🔄 Reloading Nginx configuration..."
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

echo "✅ Deployment completed successfully!"
echo "🌐 Your application should now be accessible at https://$DOMAIN"