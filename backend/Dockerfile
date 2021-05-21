FROM node:14.16.1-alpine3.13 AS builder

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
COPY /src/graphql/schema/*.schema.gql ./graphql/schema/
RUN find graphql

FROM node:14.16.1-alpine3.13 as production

WORKDIR /usr/app
COPY --from=builder /usr/app/package.json .
COPY --from=builder /usr/app/package-lock.json .
RUN npm install

COPY --from=builder /usr/app/dist .
COPY --from=builder /usr/app/graphql ./graphql
RUN find graphql

ENV NODE_ENV=production
ENV SERVER_PORT=3000
ENV REDIS_HOST=redis
ENV REDIS_PORT=6379
ENV SOCKETCLUSTER_HOST=socketcluster
ENV SOCKETCLUSTER_PORT=8000
ENV POSTGRAPHILE_HOST=postgraphile
ENV POSTGRAPHILE_PORT=3000
ENV MINIO_ENDPOINT=localhost
ENV MINIO_PORT=9000
ENV MINIO_ACCESSKEY=minio
ENV MINIO_SECRETKEY=minio123
ENV MINIO_BUCKET=test
ENV GRAPHQL_SCHEMA_PATH=graphql/schema

CMD ["node", "main"]