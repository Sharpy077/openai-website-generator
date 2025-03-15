# Build frontend image
Set-Location -Path "D:\Github Repositories\Sharpy077\openai-website-generator\frontend"
docker build -t sharpy077/sharphorizons-frontend:latest .

# Build nginx image
Set-Location -Path "D:\Github Repositories\Sharpy077\openai-website-generator\nginx"
docker build -t sharpy077/sharphorizons-nginx:latest .

# Push images to Docker Hub
docker push sharpy077/sharphorizons-frontend:latest
docker push sharpy077/sharphorizons-nginx:latest