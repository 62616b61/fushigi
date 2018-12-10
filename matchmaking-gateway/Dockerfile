FROM node:11-alpine

RUN mkdir -p /app
WORKDIR /app

COPY package.json package-lock.json /app/
RUN npm install --production

COPY . /app

CMD npm start
