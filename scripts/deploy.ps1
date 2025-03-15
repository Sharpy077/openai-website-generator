# Exit on error
$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting deployment process..."

# Disable BuildKit for compatibility
Write-Host "⚙️ Configuring Docker build settings..."
$env:DOCKER_BUILDKIT = "0"
$env:COMPOSE_DOCKER_CLI_BUILD = "0"

# Check if port 80 is in use
$port80InUse = Get-NetTCPConnection -State Listen -LocalPort 80 -ErrorAction SilentlyContinue
if ($port80InUse) {
    Write-Host "⚠️ Port 80 is in use. Stopping processes..."
    foreach ($process in $port80InUse) {
        Stop-Process -Id $process.OwningProcess -Force
    }
}

# Load environment variables
if (Test-Path .env.production) {
    Write-Host "📝 Loading production environment variables..."
    Get-Content .env.production | ForEach-Object {
        if ($_ -match '^([^=]+)=(.*)$') {
            $key = $matches[1]
            $value = $matches[2]
            [Environment]::SetEnvironmentVariable($key, $value)
        }
    }
}
else {
    Write-Host "❌ Error: .env.production file not found!"
    exit 1
}

# Generate secure passwords if not set
if (-not $env:POSTGRES_PASSWORD) {
    Write-Host "🔑 Generating secure database password..."
    $env:POSTGRES_PASSWORD = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object { [char]$_ })
    Add-Content .env.production "`nPOSTGRES_PASSWORD=$env:POSTGRES_PASSWORD"
}

# Ensure Docker is running
Write-Host "🔍 Checking Docker status..."
docker info > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Docker is not running. Please start Docker Desktop and try again."
    exit 1
}

# Login to Docker Hub if not already logged in
Write-Host "🔑 Verifying Docker Hub login..."
docker login > $null 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Please log in to Docker Hub:"
    docker login
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to log in to Docker Hub"
        exit 1
    }
}

# Build Docker images with progress output
Write-Host "🏗️ Building frontend Docker image..."
docker build --progress=plain -t "$env:DOCKER_USERNAME/sharphorizons-frontend:latest" -f Dockerfile .
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Frontend image build failed"
    exit 1
}

Write-Host "🏗️ Building Nginx Docker image..."
docker build --progress=plain -t "$env:DOCKER_USERNAME/sharphorizons-nginx:latest" -f nginx/Dockerfile ./nginx
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Nginx image build failed"
    exit 1
}

# Push Docker images with retry logic
function Push-DockerImage {
    param (
        [string]$ImageName,
        [int]$MaxAttempts = 3
    )

    for ($i = 1; $i -le $MaxAttempts; $i++) {
        Write-Host "📤 Pushing $ImageName (Attempt $i of $MaxAttempts)..."
        docker push $ImageName
        if ($LASTEXITCODE -eq 0) {
            return $true
        }
        Start-Sleep -Seconds ($i * 2)
    }
    return $false
}

Write-Host "📤 Pushing Docker images..."
$pushSuccess = $true
if (-not (Push-DockerImage "$env:DOCKER_USERNAME/sharphorizons-frontend:latest")) {
    Write-Host "❌ Failed to push frontend image"
    $pushSuccess = $false
}
if (-not (Push-DockerImage "$env:DOCKER_USERNAME/sharphorizons-nginx:latest")) {
    Write-Host "❌ Failed to push nginx image"
    $pushSuccess = $false
}

if (-not $pushSuccess) {
    Write-Host "❌ Image push failed"
    exit 1
}

# Create required directories
Write-Host "📁 Creating required directories..."
New-Item -ItemType Directory -Force -Path ./certbot/conf
New-Item -ItemType Directory -Force -Path ./certbot/www

# Start application with proper error handling
Write-Host "🌟 Starting application..."
docker-compose -f docker-compose.prod.yml down --remove-orphans
docker-compose -f docker-compose.prod.yml up -d
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to start application"
    exit 1
}

# Initialize SSL certificates
Write-Host "🔒 Initializing SSL certificates..."
docker-compose -f docker-compose.prod.yml run --rm certbot certonly --webroot --webroot-path=/var/www/certbot --email $env:EMAIL --agree-tos --no-eff-email -d $env:DOMAIN
if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ SSL certificate initialization failed. The application will still run but without HTTPS."
}

# Reload Nginx to apply SSL configuration
Write-Host "🔄 Reloading Nginx configuration..."
docker-compose -f docker-compose.prod.yml exec nginx nginx -s reload

Write-Host "✅ Deployment completed successfully!"
Write-Host "🌐 Your application should now be accessible at http://$env:DOMAIN"
if ($LASTEXITCODE -eq 0) {
    Write-Host "🔒 HTTPS will be enabled once DNS propagation is complete"
}