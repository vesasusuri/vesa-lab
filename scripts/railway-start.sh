#!/usr/bin/env bash
set -euo pipefail

# #region agent log
DEBUG_LOG_PATH="${DEBUG_LOG_PATH:-storage/logs/debug-7301c9.log}"
_debug_log() {
  local payload
  payload=$(printf '{"sessionId":"7301c9","timestamp":%s,"location":"railway-start.sh","message":"%s","data":%s,"hypothesisId":"%s","runId":"%s"}' \
    "$(date +%s000)" "$1" "$2" "$3" "${DEBUG_RUN_ID:-pre-fix}")
  echo "$payload" >> "$DEBUG_LOG_PATH" 2>/dev/null || true
  echo "$payload" >&2
}
# #endregion

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

# Stale config cache (e.g. baked with Railway ${MYSQLHOST} placeholders) ignores runtime env.
php artisan config:clear --quiet 2>/dev/null || true
rm -f bootstrap/cache/config.php 2>/dev/null || true

# #region agent log
_config_cache="false"
_cached_db_host="null"
if [ -f bootstrap/cache/config.php ]; then
  _config_cache="true"
  _cached_db_host="\"$(php -r '$c=@include "bootstrap/cache/config.php"; echo is_array($c) ? ($c["database"]["connections"]["mysql"]["host"] ?? "missing") : "unreadable";' 2>/dev/null || echo parse-error)\""
fi
_debug_log "pre-migrate env and config cache" \
  "{\"configCached\":${_config_cache},\"cachedDbHost\":${_cached_db_host},\"DB_CONNECTION\":\"${DB_CONNECTION:-}\",\"DB_HOST\":\"${DB_HOST:-}\",\"MYSQLHOST\":\"${MYSQLHOST:-}\",\"hasDbUrl\":$([ -n \"${DB_URL:-}\" ] && echo true || echo false)}" \
  "H1"
# #endregion

php artisan migrate --force

# #region agent log
_debug_log "migrate succeeded" "{}" "H4"
# #endregion

# Create public/storage symlink (gitignored; needed for file serving)
php artisan storage:link --quiet 2>/dev/null || true

# Override php-fpm pool settings
cat > /usr/local/etc/php-fpm.d/zz-railway.conf << 'EOF'
[www]
; Pass all Railway env vars through to PHP workers
clear_env = no
; Explicit TCP listen (matches nginx fastcgi_pass)
listen = 127.0.0.1:9000
; dynamic pm: keeps warm workers ready, avoids cold-spawn 502 on first request
pm = dynamic
pm.max_children = 5
pm.start_servers = 2
pm.min_spare_servers = 1
pm.max_spare_servers = 3
; Give each worker enough memory for Laravel + dependencies
php_admin_value[memory_limit] = 256M
; Log PHP errors to stderr (visible in Railway logs)
php_admin_flag[log_errors] = on
php_admin_value[error_log] = /dev/stderr
EOF

# Build nginx config from template (substitutes only ${PORT})
export PORT="${PORT:-8080}"
echo "==> nginx will listen on port $PORT"
envsubst '${PORT}' < /app/docker/nginx.conf.template > /etc/nginx/conf.d/app.conf
rm -f /etc/nginx/sites-enabled/default /etc/nginx/conf.d/default.conf 2>/dev/null || true

# Validate nginx config before starting
nginx -t

# Supervisord manages both processes: if php-fpm crashes, it restarts automatically.
# Without a supervisor, a dead php-fpm leaves nginx running (PID 1 stays alive)
# so Railway never detects the failure and 502s persist indefinitely.
cat > /etc/supervisor/conf.d/app.conf << 'SUPEOF'
[supervisord]
nodaemon=true
logfile=/dev/null
logfile_maxbytes=0
loglevel=info
pidfile=/tmp/supervisord.pid

[program:php-fpm]
command=/usr/local/sbin/php-fpm -F
autostart=true
autorestart=true
startretries=10
priority=10
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0

[program:nginx]
; 3s head-start lets php-fpm workers initialize before nginx accepts requests
command=/bin/bash -c "sleep 3 && exec /usr/sbin/nginx -g 'daemon off;'"
autostart=true
autorestart=true
startretries=10
priority=20
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
SUPEOF

exec supervisord -c /etc/supervisor/conf.d/app.conf
