FROM node:14.16.1-alpine3.13 AS builder

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

FROM nginx:1.21.0-alpine as production

COPY --from=builder /usr/app/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/app/dist/frontend /usr/share/nginx/html

ENV NODE_ENV=production
ENV BACKEND_HOST=backend-service
ENV BACKEND_PORT=3000
ENV SOCKETCLUSTER_HOST=socketcluster
ENV SOCKETCLUSTER_PORT=8000

EXPOSE 4200