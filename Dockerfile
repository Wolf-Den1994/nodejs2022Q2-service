FROM node:lts-alpine

RUN mkdir -p /opt/app

WORKDIR /opt/app

RUN npm prune --production

COPY . .

RUN npm install

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]