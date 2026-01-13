FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Collect static files (placeholder command, might fail if settings not ready, so we run it at startup or skip here)
# RUN python manage.py collectstatic --noinput

CMD ["uvicorn", "config.asgi:app", "--host", "0.0.0.0", "--port", "8000"]
