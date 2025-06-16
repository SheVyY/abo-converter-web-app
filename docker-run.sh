#!/bin/bash

# CSV to ABO Converter - Docker Run Script
# Author: Sebastian Hozak <hozaksebastian@gmail.com>

set -e

IMAGE_NAME="abo-converter:latest"
CONTAINER_NAME="abo-converter"
PORT="3001"

echo "🐳 Starting CSV to ABO Converter..."

# Stop and remove existing container if running
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "🛑 Stopping existing container..."
    docker stop $CONTAINER_NAME
fi

if [ "$(docker ps -aq -f status=exited -f name=$CONTAINER_NAME)" ]; then
    echo "🗑️  Removing existing container..."
    docker rm $CONTAINER_NAME
fi

# Run the container
echo "🚀 Starting new container..."
docker run -d \
    --name $CONTAINER_NAME \
    -p $PORT:3000 \
    -e NODE_ENV=production \
    -e NEXT_TELEMETRY_DISABLED=1 \
    --restart unless-stopped \
    $IMAGE_NAME

echo "✅ Container started successfully!"
echo ""
echo "🌐 Application is available at:"
echo "   http://localhost:$PORT"
echo ""
echo "📊 Container status:"
docker ps -f name=$CONTAINER_NAME --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
echo ""
echo "📝 To view logs:"
echo "   docker logs -f $CONTAINER_NAME"
echo ""
echo "🛑 To stop:"
echo "   docker stop $CONTAINER_NAME"