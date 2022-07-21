FROM node:lts-alpine

RUN mkdir -p /opt/app

WORKDIR /opt/app

RUN npm prune --production

COPY prisma ./prisma/

COPY . .

RUN npm install

RUN npx prisma generate

EXPOSE ${PORT}

CMD ["npm", "run", "start:dev"]