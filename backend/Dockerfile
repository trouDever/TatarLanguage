FROM python:3.10.11-slim

# Устанавливаем зависимости для psycopg2 (PostgreSQL)
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*


WORKDIR /app


COPY requirements.txt .

RUN pip install --upgrade pip && \
    pip install -r requirements.txt


COPY manage.py ./
COPY tatarlang ./tatarlang
COPY api ./api
COPY users ./users
COPY organizations ./organizations
COPY exams ./exams
COPY events ./events

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]