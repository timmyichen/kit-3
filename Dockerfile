FROM node:10.7.0

WORKDIR /usr/ydb2

COPY package.json /usr/ydb2

RUN npm install