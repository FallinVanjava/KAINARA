# -------------------------------------------------------------
# Stage 1: Build Frontend Assets
# -------------------------------------------------------------
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY vite.config.js ./
COPY resources resources/
RUN npm run build

# -------------------------------------------------------------
# Stage 2: Application Container (FrankenPHP)
# -------------------------------------------------------------
FROM dunglas/frankenphp:1-php8.2-alpine

# Install PHP extensions
RUN install-php-extensions \
    gd \
    bcmath \
    intl \
    zip \
    pdo_sqlite \
    pdo_mysql

# Copy Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Cache dependencies
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

# Copy application source
COPY . .

# Copy compiled assets from Stage 1
COPY --from=frontend /app/public/build ./public/build

# Finish Composer autoload
RUN composer dump-autoload --optimize --no-dev

# Setup entrypoint
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && sed -i 's/\r$//' /usr/local/bin/docker-entrypoint.sh

# Directory permissions
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache \
    && chmod -R 775 storage bootstrap/cache

ENV SERVER_NAME=":80"
ENV APP_ENV="production"
ENV APP_DEBUG="false"

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["frankenphp", "run", "--config", "/etc/caddy/Caddyfile"]
