# Production Deployment Script
Write-Host "🚀 Starting production deployment..." -ForegroundColor Green

# Function to check if a command exists
function Test-Command($CommandName) {
    return $null -ne (Get-Command $CommandName -ErrorAction SilentlyContinue)
}

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow
$prerequisites = @("docker", "docker-compose", "git", "npm")
foreach ($cmd in $prerequisites) {
    if (-not (Test-Command $cmd)) {
        Write-Host "❌ $cmd is not installed. Please install it first." -ForegroundColor Red
        exit 1
    }
}

# Verify we're on main branch
$currentBranch = git rev-parse --abbrev-ref HEAD
if ($currentBranch -ne "main") {
    Write-Host "❌ Not on main branch. Please switch to main branch first." -ForegroundColor Red
    exit 1
}

# Pull latest changes
Write-Host "📥 Pulling latest changes..." -ForegroundColor Yellow
git pull origin main

# Verify .env.production exists
if (-not (Test-Path .env.production)) {
    Write-Host "❌ .env.production file not found!" -ForegroundColor Red
    exit 1
}

# Copy production env and load variables
Write-Host "📝 Setting up production environment..." -ForegroundColor Yellow
Copy-Item .env.production .env -Force

# Load environment variables
$envContent = Get-Content .env.production
foreach ($line in $envContent) {
    if ($line -match '^([^#][^=]+)=(.*)$') {
        $name = $matches[1].Trim()
        $value = $matches[2].Trim()
        [Environment]::SetEnvironmentVariable($name, $value, [System.EnvironmentVariableTarget]::Process)
    }
}

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
npm ci

# Generate Prisma Client
Write-Host "🔧 Generating Prisma client..." -ForegroundColor Yellow
npx prisma generate

# Build containers
Write-Host "🏗️ Building Docker containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.yml build --no-cache

# Stop existing containers
Write-Host "🛑 Stopping existing containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.yml down

# Initialize SSL certificates if they don't exist
Write-Host "🔒 Checking SSL certificates..." -ForegroundColor Yellow
$certsPath = ".\certbot\conf\live\$env:DOMAIN_NAME"
if (-not (Test-Path $certsPath)) {
    Write-Host "🔑 Initializing SSL certificates..." -ForegroundColor Yellow

    # Start nginx with temporary configuration
    docker-compose -f docker-compose.yml up -d nginx

    # Initialize certbot
    docker-compose -f docker-compose.yml run --rm certbot certbot certonly --webroot --webroot-path /var/www/certbot --email $env:SSL_EMAIL --agree-tos --no-eff-email -d $env:DOMAIN_NAME

    # Stop nginx to apply new certificates
    docker-compose -f docker-compose.yml stop nginx
}

# Start new containers
Write-Host "🚀 Starting containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.yml up -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Run database migrations
Write-Host "🔄 Running database migrations..." -ForegroundColor Yellow
docker-compose -f docker-compose.yml exec -T frontend npx prisma migrate deploy

# Health check
Write-Host "🏥 Performing health check..." -ForegroundColor Yellow
$maxAttempts = 6
$attempt = 1
$healthy = $false

while ($attempt -le $maxAttempts) {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001/api/health" -Method GET
        if ($response.StatusCode -eq 200) {
            $healthy = $true
            break
        }
    }
    catch {
        Write-Host "⏳ Waiting for application to be ready... (Attempt $attempt/$maxAttempts)" -ForegroundColor Yellow
        Start-Sleep -Seconds 10
        $attempt++
    }
}

if ($healthy) {
    Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
    Write-Host "🌐 Application is running at: https://$env:DOMAIN_NAME" -ForegroundColor Green

    # Display container status
    Write-Host "`n📊 Container Status:" -ForegroundColor Cyan
    docker-compose -f docker-compose.yml ps

    # Display logs
    Write-Host "`n📜 Recent Logs:" -ForegroundColor Cyan
    docker-compose -f docker-compose.yml logs --tail=50
}
else {
    Write-Host "❌ Health check failed after 60 seconds" -ForegroundColor Red
    Write-Host "📜 Checking logs for errors..." -ForegroundColor Yellow
    docker-compose -f docker-compose.yml logs --tail=100
    exit 1
}