#!/usr/bin/env bash
set -euo pipefail

if [ -z "${APP_KEY:-}" ]; then
  echo "ERROR: APP_KEY is not set."
  echo "Generate one locally with: php artisan key:generate --show"
  echo "Then add it to Railway → Service → Variables."
  exit 1
fi

# Ensure all required storage directories exist
mkdir -p \
  storage/framework/sessions \
  storage/framework/views \
  storage/framework/cache/data \
  storage/app/public \
  storage/logs \
  bootstrap/cache

# php-fpm runs as www-data; make storage writable by all
chmod -R a+rwx storage bootstrap/cache

# Railway MySQL plugin exposes MYSQL*; Laravel reads DB_* / DB_URL.
if [ -n "${MYSQL_URL:-}" ] && [ -z "${DB_URL:-}" ]; then
  export DB_URL="${MYSQL_URL}"
fi

if [ -z "${DB_CONNECTION:-}" ]; then
  if [ -n "${MYSQLHOST:-}" ] || [ -n "${MYSQL_URL:-}" ] || [ -n "${DB_URL:-}" ]; then
    export DB_CONNECTION=mysql
  else
    export DB_CONNECTION=sqlite
  fi
fi

if [ "${DB_CONNECTION}" = "mysql" ]; then
  export DB_HOST="${DB_HOST:-${MYSQLHOST:-}}"
  export DB_PORT="${DB_PORT:-${MYSQLPORT:-3306}}"
  export DB_DATABASE="${DB_DATABASE:-${MYSQLDATABASE:-}}"
  export DB_USERNAME="${DB_USERNAME:-${MYSQLUSER:-}}"
  export DB_PASSWORD="${DB_PASSWORD:-${MYSQLPASSWORD:-}}"

  if [ -z "${DB_URL:-}" ] && [ -z "${DB_HOST:-}" ]; then
    echo "ERROR: DB_CONNECTION=mysql but no DB_HOST, MYSQLHOST, or DB_URL is set."
    echo "Link your Railway MySQL service or set DB_* variables on the app service."
    exit 1
  fi
elif [ "${DB_CONNECTION}" = "sqlite" ]; then
  db_path="${DB_DATABASE:-database/database.sqlite}"
  mkdir -p "$(dirname "$db_path")"
  touch "$db_path"
fi

php artisan migrate --force

# Cache config for faster boot (soft-fail so a bad config doesn't block startup)
php artisan config:cache || echo "Warning: config:cache failed, running uncached"

# Create public/storage symlink (gitignored; needed for file serving)
php artisan storage:link --quiet 2>/dev/null || true

# Override php-fpm pool: use ondemand pm to conserve memory, pass env vars through
cat > /usr/local/etc/php-fpm.d/zz-railway.conf << 'EOF'
[www]
clear_env = no
pm = ondemand
pm.max_children = 5
pm.process_idle_timeout = 10s
pm.max_requests = 500
EOF

# Build nginx config from template (substitutes only ${PORT})
export PORT="${PORT:-8080}"
echo "==> nginx will listen on port $PORT"
envsubst '${PORT}' < /app/docker/nginx.conf.template > /etc/nginx/conf.d/app.conf
rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf 2>/dev/null || true

# Validate nginx config before starting
nginx -t

# Start php-fpm as a daemon
php-fpm -D

# Wait until php-fpm is accepting connections on 9000
echo "==> waiting for php-fpm..."
timeout 30 bash -c \
  'until (echo > /dev/tcp/127.0.0.1/9000) 2>/dev/null; do sleep 0.2; done' \
  && echo "==> php-fpm ready" \
  || { echo "ERROR: php-fpm did not start within 30s"; exit 1; }

# Start nginx in the foreground (PID 1)
exec nginx -g "daemon off;"
