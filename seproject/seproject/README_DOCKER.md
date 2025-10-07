# Running the project with Docker

This repository contains a Django backend and a Vite React frontend. The compose setup builds the frontend and serves it with nginx, and runs the Django backend with gunicorn and Postgres.

Quick start (requires Docker & Docker Compose):

1. Build and start:

```powershell
cd path\to\seproject
docker compose up --build
```

2. Open the frontend in your browser:

http://localhost:3000

3. The backend API is available at:

http://localhost:8000/api/

Notes:
- The compose file uses a `backend/.env` with default credentials. Update `DJANGO_SECRET_KEY` for production.
- For development you may prefer running the frontend with `npm run dev` and Django with `python manage.py runserver`.
