# Backend (Django REST)

This folder contains a Django project scaffolded for a doctor–patient appointment booking system.

Quick start (Windows PowerShell):

```powershell
# create & activate venv (if not already)
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API root is at `http://127.0.0.1:8000/api/`.

Notes:
- Uses sqlite by default for local development. To use PostgreSQL, update `DATABASES` in `core/settings.py`.
- Email backend prints to console.
