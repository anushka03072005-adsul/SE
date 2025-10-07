#!/bin/sh
set -e

echo "Running migrations..."
python manage.py migrate --noinput

# Optionally create a superuser from env vars (if provided)
if [ -n "$DJANGO_SUPERUSER_USERNAME" ] && [ -n "$DJANGO_SUPERUSER_EMAIL" ] && [ -n "$DJANGO_SUPERUSER_PASSWORD" ]; then
  echo "from django.contrib.auth import get_user_model; User = get_user_model();
username='$DJANGO_SUPERUSER_USERNAME'
email='$DJANGO_SUPERUSER_EMAIL'
password='$DJANGO_SUPERUSER_PASSWORD'
if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
" | python manage.py shell || true
fi

exec "$@"
