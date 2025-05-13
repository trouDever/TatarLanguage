FROM python:3.10.11-slim

# Устанавливаем зависимости для psycopg2 (PostgreSQL)
RUN apt-get update && apt-get install -y \
    gcc \
    python3-dev \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Создаем и переходим в рабочую директорию
WORKDIR /app

# Копируем requirements.txt сначала для оптимизации кэширования
COPY requirements.txt .

# Устанавливаем зависимости Python
RUN pip install --upgrade pip && \
    pip install -r requirements.txt

# Копируем остальные файлы проекта
COPY . .

# Команда для запуска приложения (может быть переопределена в docker-compose)
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]