FROM python:3.12-slim
RUN apt-get update && apt-get install -y gcc default-libmysqlclient-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 8000

# コンテナ外からアクセス可能とするため「127.0.0.1」ではなく「0.0.0.0」を指定
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
