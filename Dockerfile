FROM node:lts-alpine

RUN mkdir -p /opt/app

WORKDIR /opt/app

RUN npm prune --production

COPY package.json /app

RUN npm install

COPY . .

ENV PORT 4000

EXPOSE $PORT

CMD ["npm", "run", "start"]