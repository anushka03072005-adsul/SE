import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get('DJANGO_ADMIN_USER', 'admin')
email = os.environ.get('DJANGO_ADMIN_EMAIL', 'admin@example.com')
password = os.environ.get('DJANGO_ADMIN_PASS', 'adminpass')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"Created superuser {username}")
else:
    print(f"Superuser {username} already exists")
