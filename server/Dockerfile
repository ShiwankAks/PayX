FROM node:24-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npx prisma generate --config ./prisma7.config.ts

RUN npm run build

EXPOSE 3000

CMD [ "npm" ,"start" ]