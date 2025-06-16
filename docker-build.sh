#!/bin/bash

# CSV to ABO Converter - Docker Build Script with Cleanup
# Author: Sebastian Hozak <hozaksebastian@gmail.com>

set -e

IMAGE_NAME="abo-converter-webapp"
IMAGE_TAG="latest"

echo "🐳 Building CSV to ABO Converter Docker image..."

# Stop and remove existing containers using this image
echo "🛑 Stopping existing containers..."
docker ps -q --filter ancestor=${IMAGE_NAME}:${IMAGE_TAG} | xargs -r docker stop

echo "🗑️  Removing old containers..."
docker ps -aq --filter ancestor=${IMAGE_NAME}:${IMAGE_TAG} | xargs -r docker rm

# Remove old images with same name
echo "🧹 Cleaning up old images..."
OLD_IMAGES=$(docker images ${IMAGE_NAME} -q 2>/dev/null || true)
if [ ! -z "$OLD_IMAGES" ]; then
    echo "Removing old ${IMAGE_NAME} images..."
    docker rmi ${OLD_IMAGES} 2>/dev/null || true
else
    echo "No old images to remove"
fi

# Build the new Docker image
echo "🔨 Building new image..."
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .

# Clean up dangling images and build cache
echo "🧼 Cleaning up dangling images and build cache..."
docker image prune -f
docker builder prune -f

echo "✅ Docker image built successfully!"
echo "📊 Current images:"
docker images ${IMAGE_NAME}
echo ""
echo "🚀 To run the container on port 3333:"
echo "  docker run -p 3333:3000 ${IMAGE_NAME}:${IMAGE_TAG}"
echo ""
echo "🛟 To run on different port (e.g., 8080):"
echo "  docker run -p 8080:3000 ${IMAGE_NAME}:${IMAGE_TAG}"