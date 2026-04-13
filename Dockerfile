# ── Stage 1: Build frontend assets ───────────────────────────────────────────
FROM node:20-alpine AS frontend

WORKDIR /build

COPY package.json webpack.config.js tailwind.config.js ./
# .babelrc potrebbe non essere presente, viene copiato se esiste
COPY .babelrc* ./
COPY react_app/ ./react_app/
COPY django/tailwind.css ./django/tailwind.css

RUN npm install
RUN npm run build && npm run twbuild


# ── Stage 2: Production Django application ────────────────────────────────────
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

# Dipendenze Python
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

# Sorgente Django
COPY django/ .

# Asset frontend buildati dallo stage 1
COPY --from=frontend /build/django/static/react/ ./static/react/
COPY --from=frontend /build/django/static/css/   ./static/css/
COPY --from=frontend /build/django/webpack-stats.json ./webpack-stats.json

# Raccoglie i file statici (serviti da whitenoise in produzione)
RUN SECRET_KEY=collectstatic-build-dummy python manage.py collectstatic --no-input

# Entrypoint: esegue le migration e avvia gunicorn
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 8000

ENTRYPOINT ["/entrypoint.sh"]
