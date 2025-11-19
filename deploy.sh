#!/bin/bash

# GidiNest Frontend Deployment Script
# This script builds and deploys the frontend to the Nginx web server

set -e  # Exit on any error

echo "🚀 Starting deployment..."

# Step 1: Build the application
echo "📦 Building application..."
npm run build

# Step 2: Find the Nginx web root
# Adjust this path to match your Nginx configuration
WEB_ROOT="/var/www/gidinest"

echo "🔍 Nginx web root: $WEB_ROOT"

# Step 3: Backup old files (optional but recommended)
if [ -d "$WEB_ROOT" ]; then
    echo "💾 Creating backup of old files..."
    sudo cp -r "$WEB_ROOT" "$WEB_ROOT.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Step 4: Clear old files
echo "🧹 Clearing old files..."
sudo rm -rf "$WEB_ROOT"/*

# Step 5: Copy new build files
echo "📂 Copying new files to web root..."
sudo cp -r dist/* "$WEB_ROOT/"

# Step 6: Set correct permissions
echo "🔐 Setting permissions..."
sudo chown -R www-data:www-data "$WEB_ROOT"
sudo chmod -R 755 "$WEB_ROOT"

# Step 7: Clear Nginx cache (if it exists)
if [ -d "/var/cache/nginx" ]; then
    echo "🗑️  Clearing Nginx cache..."
    sudo rm -rf /var/cache/nginx/*
fi

# Step 8: Reload Nginx
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

# Step 9: Verify Nginx is running
if sudo systemctl is-active --quiet nginx; then
    echo "✅ Deployment successful! Nginx is running."
    echo "🌐 Your app should now be live at https://app.gidinest.com"
else
    echo "❌ Warning: Nginx is not running!"
    sudo systemctl status nginx
    exit 1
fi

echo ""
echo "⚠️  Remember to:"
echo "   1. Clear your browser cache (Ctrl+Shift+Delete)"
echo "   2. Do a hard refresh (Ctrl+Shift+R)"
echo "   3. Or use an incognito window to test"
