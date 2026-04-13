#!/bin/sh
set -e

echo "[LotsTracker] Applying database migrations..."
python manage.py migrate --no-input

echo "[LotsTracker] Starting Gunicorn..."
exec gunicorn app.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 2 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
