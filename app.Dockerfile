FROM node:lts-alpine

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package.json /app

RUN npm install

RUN npm prune --production

COPY . .

ENV PORT 4000

EXPOSE $PORT

CMD ["npm", "run", "start"]