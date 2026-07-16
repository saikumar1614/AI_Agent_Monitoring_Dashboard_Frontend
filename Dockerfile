FROM node:20-alpine AS frontend_build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build:prod

FROM nginx:1.27-alpine AS frontend_runtime

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend_build /app/dist/ai-agent-monitoring-dashboard-frontend /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
