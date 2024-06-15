# syntax=docker/dockerfile:1
FROM node:latest as build-stage

WORKDIR /usr/app/

COPY ./client/package*.json ./
RUN npm install --legacy-peer-deps
COPY client/ ./
RUN npm run build


FROM node:latest as deploy-stage
WORKDIR /usr/app/


COPY --from=build-stage /usr/app/build/ ./client/build

COPY  ./package*.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "start"]
