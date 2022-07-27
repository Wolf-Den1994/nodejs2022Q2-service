FROM node:lts-alpine

WORKDIR /usr/src/app

RUN mkdir -p /opt/app

COPY package*.json ./

COPY prisma ./prisma/

RUN npm install

COPY . .

EXPOSE ${PORT}

RUN npx prisma generate

CMD ["npm", "run", "start:dev"]