# Frontend Deployment Guide - Digital Ocean Droplet

This guide covers redeploying the GidiNest frontend (React + Vite + TypeScript) on your Digital Ocean Droplet with Apache.

## Quick Deployment

**TL;DR** - Standard deployment:
```bash
# SSH into your droplet
ssh user@your-droplet-ip

# Navigate to project directory
cd /var/www/gidinet-frontend-portal  # adjust path as needed

# Pull latest changes
git pull origin main

# Install dependencies (if package.json changed)
npm install

# Build the project
npm run build

# Apache will automatically serve the new files from dist/
```

---

## Prerequisites

- SSH access to your Digital Ocean Droplet (with SSH key configured)
- Git repository cloned on the droplet
- Node.js v20+ installed on the droplet
- Apache web server configured and running

---

## Pre-Deployment Checklist (Local Machine)

### 1. Test Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test your changes at http://localhost:3039
```

### 2. Verify Build Works Locally

```bash
# Build for production
npm run build

# Check for errors
# If build succeeds, you should see "dist" folder created

# Preview production build
npm run start
```

### 3. Check for Linting & Type Errors

```bash
# Run linter
npm run lint

# Fix issues automatically
npm run lint:fix

# Check TypeScript
npx tsc --noEmit
```

### 4. Commit and Push Changes

```bash
# Stage changes
git add .

# Commit with descriptive message
git commit -m "Description of your changes"

# Push to GitHub
git push origin main
```

---

## Deployment Steps

### Step 1: Connect to Your Droplet

```bash
# SSH into your droplet
ssh root@your-droplet-ip
# or
ssh your-username@your-droplet-ip
```

If you have a custom SSH key location:
```bash
ssh -i ~/.ssh/your-key-name root@your-droplet-ip
```

### Step 2: Navigate to Project Directory

```bash
# Navigate to your frontend directory
cd /var/www/gidinet-frontend-portal
# or wherever your project is located

# Verify you're in the right directory
pwd
ls -la
```

### Step 3: Pull Latest Changes

```bash
# Make sure you're on the correct branch
git branch

# Pull latest changes from GitHub
git pull origin main

# If you see conflicts, you may need to:
# git stash  # save local changes
# git pull
# git stash pop  # reapply local changes
```

### Step 4: Install Dependencies (if needed)

```bash
# Only needed if package.json changed
npm install

# Or if using yarn
yarn install
```

**Skip this step if you didn't add/update dependencies.**

### Step 5: Build the Project

```bash
# Build for production
npm run build

# This creates/updates the dist/ folder
# Build should complete without errors
```

**Watch for errors!** Common issues:
- TypeScript errors
- Linting errors (if strict mode)
- Memory issues (if droplet has low RAM)

### Step 6: Verify Build Output

```bash
# Check that dist folder was created/updated
ls -lh dist/

# You should see:
# - index.html
# - assets/ folder with JS and CSS files
```

### Step 7: Apache Automatically Serves New Files

If Apache is configured to serve from your `dist/` folder, the new files are now live!

No need to restart Apache unless you changed configuration.

---

## Apache Configuration

### Verify Apache Configuration

```bash
# Check Apache configuration file
sudo nano /etc/apache2/sites-available/gidinet.conf
# or
sudo nano /etc/apache2/sites-available/000-default.conf
```

Your configuration should look like:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com

    # Point to your built files
    DocumentRoot /var/www/gidinet-frontend-portal/dist

    <Directory /var/www/gidinet-frontend-portal/dist>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted

        # Enable React Router (SPA routing)
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>

    ErrorLog ${APACHE_LOG_DIR}/gidinet-error.log
    CustomLog ${APACHE_LOG_DIR}/gidinet-access.log combined
</VirtualHost>
```

### Enable Required Apache Modules

```bash
# Enable rewrite module (for SPA routing)
sudo a2enmod rewrite

# Restart Apache
sudo systemctl restart apache2
```

### Fix SPA Routing (404 on Refresh)

If refreshing pages shows 404 errors, ensure:

1. **RewriteEngine is enabled** (see config above)
2. **AllowOverride is set to All**
3. **mod_rewrite is enabled:**
   ```bash
   sudo a2enmod rewrite
   sudo systemctl restart apache2
   ```

---

## Environment Variables

Since this is a Vite app, environment variables must be set **before building**.

### Option 1: Use .env File (Recommended)

On your droplet, create `.env.production` file:

```bash
cd /var/www/gidinet-frontend-portal
nano .env.production
```

Add your variables:
```bash
VITE_API_URL=https://your-backend-api.com
VITE_API_BASE_URL=https://your-backend-api.com/api
VITE_ENABLE_FEATURE_X=true
```

Save and rebuild:
```bash
npm run build
```

**Important:** Only variables prefixed with `VITE_` are exposed to the browser.

### Option 2: Set in Build Command

```bash
VITE_API_URL=https://api.example.com npm run build
```

---

## Troubleshooting

### Build Fails on Droplet

**1. Memory Issues (Low RAM)**

If build fails with "JavaScript heap out of memory":

```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

Or add swap space:
```bash
# Check current swap
free -h

# Add 2GB swap file
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

**2. TypeScript/Linting Errors**

```bash
# Check for errors
npx tsc --noEmit

# If you must skip checks (not recommended):
# Comment out the checker plugin in vite.config.ts temporarily
```

**3. Permission Issues**

```bash
# Fix ownership
sudo chown -R $USER:$USER /var/www/gidinet-frontend-portal

# Fix permissions
chmod -R 755 /var/www/gidinet-frontend-portal
```

### Site Shows Old Version After Deploy

**1. Clear Browser Cache**
- Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
- Or open in incognito mode

**2. Check Apache is Serving Correct Directory**
```bash
# Check Apache config
sudo apache2ctl -S | grep DocumentRoot

# Verify it points to your dist/ folder
```

**3. Verify Build Actually Ran**
```bash
# Check file timestamps
ls -lh dist/

# Should show recent modification times
```

**4. Restart Apache (if needed)**
```bash
sudo systemctl restart apache2
```

### Cannot Connect via SSH

```bash
# Test connection
ssh -v user@your-droplet-ip

# Common fixes:
# - Check firewall allows port 22
# - Verify SSH key is correct
# - Check droplet is running in Digital Ocean dashboard
```

### Apache Not Running

```bash
# Check Apache status
sudo systemctl status apache2

# Start Apache
sudo systemctl start apache2

# Enable on boot
sudo systemctl enable apache2

# Check for config errors
sudo apache2ctl configtest
```

### 403 Forbidden Error

```bash
# Fix permissions
sudo chown -R www-data:www-data /var/www/gidinet-frontend-portal/dist
sudo chmod -R 755 /var/www/gidinet-frontend-portal/dist

# Check Apache error logs
sudo tail -f /var/log/apache2/error.log
```

---

## Rollback Procedure

If the new deployment breaks something:

### Option 1: Revert Git Commit

```bash
# On your droplet
cd /var/www/gidinet-frontend-portal

# View recent commits
git log --oneline -n 5

# Reset to previous commit
git reset --hard HEAD~1

# Or reset to specific commit
git reset --hard <commit-hash>

# Rebuild
npm run build
```

### Option 2: Keep Old Dist Folder

**Before deploying**, backup your current dist:
```bash
# Backup current version
cp -r dist dist-backup-$(date +%Y%m%d)

# After deployment, if issues arise:
rm -rf dist
mv dist-backup-20250104 dist  # use actual backup name
```

---

## Performance Optimization

### 1. Enable Gzip Compression in Apache

```bash
sudo nano /etc/apache2/mods-available/deflate.conf
```

Add:
```apache
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

Enable and restart:
```bash
sudo a2enmod deflate
sudo systemctl restart apache2
```

### 2. Enable Browser Caching

Add to your Apache VirtualHost:
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/html "access plus 1 hour"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType text/javascript "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

Enable:
```bash
sudo a2enmod expires
sudo systemctl restart apache2
```

### 3. Optimize Build Size

```bash
# Check build size
du -sh dist/

# Analyze bundle
npm run build
ls -lh dist/assets/
```

---

## Monitoring & Logs

### Check Apache Logs

```bash
# Access logs (successful requests)
sudo tail -f /var/log/apache2/access.log

# Error logs (problems)
sudo tail -f /var/log/apache2/error.log

# Check for specific errors
sudo grep -i error /var/log/apache2/error.log
```

### Monitor Droplet Resources

```bash
# Check memory usage
free -h

# Check disk space
df -h

# Check CPU usage
top

# Or use htop (if installed)
htop
```

---

## Automated Deployment (Optional)

### Simple Deployment Script

Create a deploy script on your droplet:

```bash
# On droplet
nano /var/www/gidinet-frontend-portal/deploy.sh
```

Add:
```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Navigate to project
cd /var/www/gidinet-frontend-portal

# Backup current dist
echo "📦 Backing up current version..."
cp -r dist dist-backup-$(date +%Y%m%d-%H%M%S)

# Pull latest changes
echo "⬇️  Pulling latest changes..."
git pull origin main

# Install dependencies (if needed)
echo "📚 Installing dependencies..."
npm install

# Build project
echo "🔨 Building project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🌐 Site updated at: http://your-domain.com"
else
    echo "❌ Build failed! Restoring backup..."
    rm -rf dist
    mv dist-backup-$(ls -t dist-backup-* | head -1) dist
    exit 1
fi

# Clean up old backups (keep last 3)
echo "🧹 Cleaning up old backups..."
ls -t dist-backup-* | tail -n +4 | xargs rm -rf

echo "✨ Done!"
```

Make executable:
```bash
chmod +x deploy.sh
```

Use it:
```bash
./deploy.sh
```

---

## Best Practices

1. **Always test locally before deploying**
   - Run `npm run build` locally
   - Preview with `npm run start`

2. **Backup before deployment**
   ```bash
   cp -r dist dist-backup-$(date +%Y%m%d)
   ```

3. **Check logs after deployment**
   ```bash
   sudo tail -f /var/log/apache2/error.log
   ```

4. **Keep dependencies updated**
   ```bash
   npm outdated
   npm update
   ```

5. **Monitor disk space**
   ```bash
   df -h
   # Clean up old backups and node_modules if needed
   ```

6. **Use environment-specific configs**
   - `.env.development` (local)
   - `.env.production` (droplet)

7. **Document environment variables**
   - Keep a list of required variables
   - Document what each one does

---

## Security Tips

1. **Keep system updated**
   ```bash
   sudo apt update
   sudo apt upgrade
   ```

2. **Configure firewall**
   ```bash
   sudo ufw status
   sudo ufw allow 80/tcp    # HTTP
   sudo ufw allow 443/tcp   # HTTPS
   sudo ufw allow 22/tcp    # SSH
   sudo ufw enable
   ```

3. **Set up SSL/HTTPS** (Recommended)
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-apache

   # Get SSL certificate
   sudo certbot --apache -d your-domain.com -d www.your-domain.com

   # Auto-renewal is set up automatically
   ```

4. **Disable directory listing**
   - Already done with `Options -Indexes` in Apache config

---

## Quick Command Reference

```bash
# SSH to droplet
ssh user@your-droplet-ip

# Navigate to project
cd /var/www/gidinet-frontend-portal

# Deploy
git pull origin main
npm install                    # if package.json changed
npm run build

# Check Apache
sudo systemctl status apache2
sudo systemctl restart apache2
sudo apache2ctl configtest

# View logs
sudo tail -f /var/log/apache2/error.log
sudo tail -f /var/log/apache2/access.log

# Check resources
free -h                        # Memory
df -h                          # Disk space
top                            # CPU/Memory usage

# Backup
cp -r dist dist-backup-$(date +%Y%m%d)

# Rollback
git reset --hard HEAD~1
npm run build
```

---

## Common Workflow

**Standard deployment:**
```bash
# 1. Local machine - test and push
npm run build
git add .
git commit -m "Your changes"
git push origin main

# 2. SSH into droplet
ssh user@your-droplet-ip

# 3. Deploy
cd /var/www/gidinet-frontend-portal
git pull origin main
npm run build

# 4. Verify
# Visit your site and test
```

---

## Need Help?

- **Apache Docs:** https://httpd.apache.org/docs/
- **Digital Ocean Tutorials:** https://www.digitalocean.com/community/tutorials
- **Vite Deployment:** https://vitejs.dev/guide/static-deploy.html
- **Check Apache logs** for specific error messages
