#!/bin/sh
set -e

# Auto-generate APP_KEY if empty
if [ -z "$APP_KEY" ]; then
    php artisan key:generate --force
fi

# Ensure SQLite file exists if using sqlite
if [ "${DB_CONNECTION:-sqlite}" = "sqlite" ]; then
    mkdir -p /app/database
    if [ ! -f /app/database/database.sqlite ]; then
        touch /app/database/database.sqlite
    fi
    chown -R www-data:www-data /app/database
fi

# Ensure storage directories exist
mkdir -p /app/storage/app/public \
         /app/storage/framework/cache/data \
         /app/storage/framework/sessions \
         /app/storage/framework/views \
         /app/storage/logs

# Fix permissions
chown -R www-data:www-data /app/storage /app/bootstrap/cache
chmod -R 775 /app/storage /app/bootstrap/cache

# Create storage symlink for uploaded Tapis images
php artisan storage:link --force 2>/dev/null || true

# Run database migrations
php artisan migrate --force 2>/dev/null || true

# Seed database if requested
if [ "${RUN_SEEDER:-true}" = "true" ]; then
    php artisan db:seed --force 2>/dev/null || true
fi

# Caching for production
if [ "${APP_ENV:-production}" = "production" ]; then
    php artisan config:cache 2>/dev/null || true
    php artisan route:cache 2>/dev/null || true
    php artisan view:cache 2>/dev/null || true
fi

exec "$@"
