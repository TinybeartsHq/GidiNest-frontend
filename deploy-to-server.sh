#!/bin/bash

# GidiNest Frontend - Server Deployment Script
# Run this ON THE SERVER at /var/www/GidiNest-frontend/

set -e  # Exit on any error

echo "🚀 Starting deployment on server..."

# Step 1: Navigate to the frontend directory
cd /var/www/GidiNest-frontend

# Step 2: Pull latest changes from git (if using git)
if [ -d ".git" ]; then
    echo "📥 Pulling latest changes from git..."
    sudo git pull origin main  # Change 'main' to your branch name if different
fi

# Step 3: Install dependencies (use --legacy-peer-deps for React 19)
echo "📦 Installing dependencies..."
sudo npm install --legacy-peer-deps

# Step 4: Build the application
echo "🏗️  Building application..."
sudo npm run build

# Step 5: Set correct permissions for dist folder
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data dist/
sudo chmod -R 755 dist/

# Step 6: Clear Nginx cache (if it exists)
if [ -d "/var/cache/nginx" ]; then
    echo "🗑️  Clearing Nginx cache..."
    sudo rm -rf /var/cache/nginx/*
fi

# Step 7: Test Nginx configuration
echo "🔍 Testing Nginx configuration..."
sudo nginx -t

# Step 8: Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

# Step 9: Verify Nginx is running
if sudo systemctl is-active --quiet nginx; then
    echo ""
    echo "✅ Deployment successful!"
    echo "🌐 Your app is now live at https://app.gidinest.com"
    echo ""
    echo "⚠️  IMPORTANT: Clear your browser cache!"
    echo "   1. Press Ctrl+Shift+Delete (or Cmd+Shift+Delete on Mac)"
    echo "   2. Select 'All time' and clear 'Cached images and files'"
    echo "   3. Or use an incognito/private window to test"
    echo ""
else
    echo "❌ Error: Nginx is not running!"
    sudo systemctl status nginx
    exit 1
fi
