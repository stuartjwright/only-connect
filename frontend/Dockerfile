# syntax=docker/dockerfile:1

FROM node:16 as build

WORKDIR /code

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci --production

COPY ./src ./src
COPY ./public ./public

RUN npm run build

FROM nginx:1.21 as prod

COPY --from=build /code/build /usr/share/nginx/html
COPY nginx.default.conf /etc/nginx/conf.d/default.conf
