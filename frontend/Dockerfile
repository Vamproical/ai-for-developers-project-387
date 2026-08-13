FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --ignore-scripts
COPY frontend/ ./
ARG API_BASE_URL=""
ENV VITE_API_BASE_URL=$API_BASE_URL
RUN npm run build

FROM nginx:1.27-alpine AS serve
ENV PORT=8080
COPY frontend/nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
