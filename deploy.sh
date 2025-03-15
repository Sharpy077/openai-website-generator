#!/bin/bash

# Load environment variables
source .env

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for required commands
for cmd in docker docker-compose curl; do
    if ! command_exists $cmd; then
        echo "Error: $cmd is required but not installed."
        exit 1
    fi
done

# Create necessary directories
echo "Creating required directories..."
mkdir -p nginx/conf
mkdir -p certbot/conf
mkdir -p certbot/www

# Make scripts executable
chmod +x init-ssl.sh ssl-renew.sh

# Stop existing containers
echo "Stopping existing containers..."
docker compose down

# Build and start containers
echo "Building and starting containers..."
docker compose up --build -d

# Initialize SSL certificates
echo "Initializing SSL certificates..."
./init-ssl.sh

# Set up cron job for SSL renewal
(crontab -l 2>/dev/null; echo "0 0 * * * /bin/bash $(pwd)/ssl-renew.sh") | crontab -

echo "Deployment complete! Checking services..."

# Check services
docker compose ps