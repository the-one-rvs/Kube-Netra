#!/bin/sh
set -e

# Replace env vars in Nginx config
envsubst '$API_HOST $API_PORT' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

# Execute CMD (nginx)
exec "$@"
