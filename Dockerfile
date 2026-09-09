# Этап сборки (Build stage)
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Этап запуска (Nginx stage)
FROM nginx:alpine

# Копируем собранные статические файлы React
COPY --from=build /app/dist /usr/share/nginx/html

# КОПИРУЕМ НАШ NGINX КОНФИГ В КОНТЕЙНЕР
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]