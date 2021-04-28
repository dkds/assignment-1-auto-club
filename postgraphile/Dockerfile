FROM node:14.16.1-alpine3.13

WORKDIR /usr/project/postgraphile
COPY . .
RUN npm install

ENTRYPOINT ["node", "index.js"]