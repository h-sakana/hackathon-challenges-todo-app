FROM node:20-slim
WORKDIR /app
COPY package*.json ./
# 自動でバージョンを上げないように「npm install」ではなく「npm ci」を使用
RUN npm ci
COPY . .
EXPOSE 5173

# Viteでコンテナ外からアクセス可能とするため「--host」を指定
CMD ["npm", "run", "dev", "--", "--host"]
