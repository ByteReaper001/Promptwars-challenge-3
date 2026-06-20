# Multi-stage build for Vite React app
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Runtime image
FROM nginx:1.27-alpine

# Cloud Run provides the PORT env var; default to 8080.
ENV PORT=8080

# Replace default nginx config with Cloud Run-friendly config.
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
