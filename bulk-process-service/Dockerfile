FROM node:14.16.1-alpine3.13 AS builder

WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:14.16.1-alpine3.13 as production

ARG NODE_ENV=production
ARG PORT=3000

ENV NODE_ENV=${NODE_ENV}
ENV PORT=${PORT}

WORKDIR /usr/app
COPY --from=builder /usr/app/package.json .
COPY --from=builder /usr/app/package-lock.json .
COPY --from=builder /usr/app/dist .
RUN npm install --only=production

CMD ["node", "main"]